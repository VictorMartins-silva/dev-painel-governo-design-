// Importa a aba "dash-panel" de docs/catalogo_paineis_osasco.xlsx e gera o módulo estático
// src/config/panels/catalogo-osasco.generated.ts, registrado em src/config/panels/index.ts.
//
// A planilha é a fonte da verdade do catálogo; este script é idempotente e determinístico —
// rodar duas vezes sobre a mesma planilha produz exatamente o mesmo arquivo, sem datas nem
// contadores que gerem diff espúrio.
//
//   npm run catalogo:import
//
// Sem dependências: .xlsx é um zip de XML, e tanto o zip quanto o XML são lidos aqui com o
// `node:zlib` da biblioteca padrão. Isso evita adicionar uma dependência de parsing de planilha
// só para um passo de build que roda manualmente.

import { readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { inflateRawSync } from "node:zlib";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const XLSX_PATH = resolve(projectRoot, "docs/catalogo_paineis_osasco.xlsx");
const OUTPUT_PATH = resolve(projectRoot, "src/config/panels/catalogo-osasco.generated.ts");
const SHEET_NAME = "dash-panel";

// ---------------------------------------------------------------------------------------------
// Leitura do .xlsx (zip + XML)
// ---------------------------------------------------------------------------------------------

/** Extrai as entradas de um zip pelo diretório central — o único índice confiável, já que o
 *  cabeçalho local pode ter tamanhos zerados quando o arquivo usa data descriptor. */
function readZipEntries(buffer) {
  const EOCD_SIGNATURE = 0x06054b50;
  let eocd = -1;
  for (let offset = buffer.length - 22; offset >= 0; offset -= 1) {
    if (buffer.readUInt32LE(offset) === EOCD_SIGNATURE) {
      eocd = offset;
      break;
    }
  }
  if (eocd < 0) throw new Error("Arquivo .xlsx inválido: fim do diretório central não encontrado.");

  const entryCount = buffer.readUInt16LE(eocd + 10);
  let cursor = buffer.readUInt32LE(eocd + 16);
  const entries = new Map();

  for (let index = 0; index < entryCount; index += 1) {
    if (buffer.readUInt32LE(cursor) !== 0x02014b50) {
      throw new Error("Arquivo .xlsx inválido: entrada do diretório central corrompida.");
    }
    const compressionMethod = buffer.readUInt16LE(cursor + 10);
    const compressedSize = buffer.readUInt32LE(cursor + 20);
    const nameLength = buffer.readUInt16LE(cursor + 28);
    const extraLength = buffer.readUInt16LE(cursor + 30);
    const commentLength = buffer.readUInt16LE(cursor + 32);
    const localOffset = buffer.readUInt32LE(cursor + 42);
    const name = buffer.toString("utf8", cursor + 46, cursor + 46 + nameLength);

    // O cabeçalho local repete nome e extra com tamanhos próprios; só ele diz onde os bytes começam.
    const localNameLength = buffer.readUInt16LE(localOffset + 26);
    const localExtraLength = buffer.readUInt16LE(localOffset + 28);
    const dataStart = localOffset + 30 + localNameLength + localExtraLength;
    const data = buffer.subarray(dataStart, dataStart + compressedSize);

    entries.set(name, compressionMethod === 0 ? data : inflateRawSync(data));
    cursor += 46 + nameLength + extraLength + commentLength;
  }

  return entries;
}

function decodeXmlText(value) {
  return value
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

/** Concatena todos os <t> de um fragmento — uma célula com formatação vira vários <r><t>. */
function textOf(fragment) {
  const parts = [...fragment.matchAll(/<t(?:\s[^>]*)?>([\s\S]*?)<\/t>/g)];
  return parts.map((match) => decodeXmlText(match[1])).join("");
}

function readSharedStrings(entries) {
  const xml = entries.get("xl/sharedStrings.xml");
  if (!xml) return [];
  return [...xml.toString("utf8").matchAll(/<si>([\s\S]*?)<\/si>/g)].map((match) =>
    textOf(match[1]),
  );
}

function columnIndex(cellRef) {
  const letters = /^([A-Z]+)/.exec(cellRef)?.[1] ?? "A";
  let index = 0;
  for (const letter of letters) index = index * 26 + (letter.charCodeAt(0) - 64);
  return index - 1;
}

/** Resolve o caminho de xl/worksheets/*.xml correspondente a uma aba pelo nome. */
function findSheetPath(entries, sheetName) {
  const workbook = entries.get("xl/workbook.xml")?.toString("utf8") ?? "";
  const sheetTag = [...workbook.matchAll(/<sheet\b[^>]*\/>/g)].find(
    (match) => decodeXmlText(/name="([^"]*)"/.exec(match[0])?.[1] ?? "") === sheetName,
  );
  if (!sheetTag) throw new Error(`Aba "${sheetName}" não encontrada na planilha.`);

  const relationshipId = /r:id="([^"]*)"/.exec(sheetTag[0])?.[1];
  const rels = entries.get("xl/_rels/workbook.xml.rels")?.toString("utf8") ?? "";
  const target = [...rels.matchAll(/<Relationship\b[^>]*\/>/g)]
    .map((match) => match[0])
    .find((tag) => new RegExp(`Id="${relationshipId}"`).test(tag));
  const path = /Target="([^"]*)"/.exec(target ?? "")?.[1];
  if (!path) throw new Error(`Aba "${sheetName}" sem destino de relacionamento no .xlsx.`);

  return path.startsWith("/") ? path.slice(1) : `xl/${path}`;
}

function readSheetRows(entries, sheetName) {
  const sharedStrings = readSharedStrings(entries);
  const xml = entries.get(findSheetPath(entries, sheetName))?.toString("utf8") ?? "";
  const rows = [];

  for (const rowMatch of xml.matchAll(/<row\b[^>]*>([\s\S]*?)<\/row>/g)) {
    const cells = new Map();
    for (const cellMatch of rowMatch[1].matchAll(/<c\b([^>]*)>([\s\S]*?)<\/c>/g)) {
      const attributes = cellMatch[1];
      const body = cellMatch[2];
      const reference = /r="([A-Z]+\d+)"/.exec(attributes)?.[1];
      if (!reference) continue;

      const type = /t="([^"]*)"/.exec(attributes)?.[1];
      let value;
      if (type === "s") {
        const sharedIndex = Number(/<v>([\s\S]*?)<\/v>/.exec(body)?.[1] ?? "-1");
        value = sharedStrings[sharedIndex] ?? "";
      } else if (type === "inlineStr") {
        value = textOf(body);
      } else {
        value = decodeXmlText(/<v>([\s\S]*?)<\/v>/.exec(body)?.[1] ?? "");
      }

      if (value.trim()) cells.set(columnIndex(reference), value.trim());
    }
    if (cells.size > 0) {
      const width = Math.max(...cells.keys()) + 1;
      rows.push(Array.from({ length: width }, (_, index) => cells.get(index) ?? ""));
    }
  }

  return rows;
}

// ---------------------------------------------------------------------------------------------
// Mapeamento planilha → PanelConfig
// ---------------------------------------------------------------------------------------------

/**
 * Correções aplicadas a células da planilha que chegaram truncadas ou malformadas. Cada entrada
 * precisa ser justificável — o objetivo é não publicar um painel que já se sabe quebrado, e ao
 * mesmo tempo deixar registrado o que foi alterado em relação à fonte.
 */
const URL_FIXES = new Map([
  [
    "Ocorrências por Mês (2023 - 2026)",
    {
      // A célula da planilha corta o token base64 no meio do tenant id ("...IiwidCI6IjkwZGQ1").
      // O sufixo abaixo restaura o tenant 90dd5b64-e710-4d3f-bbec-59427ccb45a9, o mesmo dos
      // demais painéis de Segurança/Trânsito da planilha, e o alinhamento base64 confere.
      // CONFERIR contra a URL original de Publicar na Web antes de considerar isto definitivo.
      from: "https://app.powerbi.com/view?r=eyJrIjoiMmFmODM3ZDUtZTAzZS00ZDU5LTk0MjQtMmUyN2M2YTAzMzA3IiwidCI6IjkwZGQ1",
      to: "https://app.powerbi.com/view?r=eyJrIjoiMmFmODM3ZDUtZTAzZS00ZDU5LTk0MjQtMmUyN2M2YTAzMzA3IiwidCI6IjkwZGQ1YjY0LWU3MTAtNGQzZi1iYmVjLTU5NDI3Y2NiNDVhOSJ9",
      note:
        "URL de embed reconstruída: a planilha de origem traz o token de Publicar na Web " +
        "truncado. Conferir no Power BI antes de divulgar este painel.",
    },
  ],
]);

/** Sistema de origem por host — usado em metadata.source e como tag de origem. */
const ORIGIN_BY_HOST = new Map([
  ["app.powerbi.com", { source: "Power BI — Prefeitura de Osasco", tag: "power bi" }],
  [
    "bi-gestaoeducacional.osasco.sp.gov.br",
    { source: "BI Gestão Educacional (GED) — Prefeitura de Osasco", tag: "ged" },
  ],
  ["bi156painel.osasco.sp.gov.br", { source: "Painel 156 — Prefeitura de Osasco", tag: "156" }],
  ["bi.osasco.sp.gov.br", { source: "BI corporativo — Prefeitura de Osasco", tag: "bi osasco" }],
  [
    "parcerias.osasco.sp.gov.br",
    { source: "Portal de Parcerias — Prefeitura de Osasco", tag: "parcerias" },
  ],
  [
    "protocolo.osasco.sp.gov.br",
    { source: "BI de Protocolo — Prefeitura de Osasco", tag: "protocolo" },
  ],
]);

/**
 * Classifica o mecanismo de embed pela forma da URL:
 * - app.powerbi.com/view?r=…      → Publicar na Web (público, sem login)
 * - app.powerbi.com/reportEmbed…  → Secure Embed (exige sessão Power BI do tenant)
 * - qualquer outro host https     → portal de BI próprio da prefeitura, iframe direto
 */
function classifyProvider(url) {
  const { hostname, pathname } = new URL(url);
  if (hostname !== "app.powerbi.com") return "iframe-externo";
  if (pathname === "/view") return "powerbi-public";
  if (pathname === "/reportEmbed") return "powerbi-secure";
  throw new Error(`URL do Power BI em formato não reconhecido: ${url}`);
}

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Ids são chave de rota (/paineis/:id) e precisam ser estáveis entre execuções: derivam só do
 *  título, com sufixo numérico apenas quando dois títulos colidem depois de normalizados. */
function uniqueId(title, taken) {
  const base = slugify(title) || "painel";
  if (!taken.has(base)) {
    taken.add(base);
    return base;
  }
  for (let suffix = 2; ; suffix += 1) {
    const candidate = `${base}-${suffix}`;
    if (!taken.has(candidate)) {
      taken.add(candidate);
      return candidate;
    }
  }
}

const IMPORT_NOTE =
  "Importado automaticamente da aba dash-panel de docs/catalogo_paineis_osasco.xlsx. " +
  "Título, tema e URL de embed vêm da planilha; descrição, responsável e tags são provisórios " +
  "e precisam de revisão editorial.";

function toPanelConfig(row, takenIds) {
  const [theme, title, rawUrl] = row;
  // Uma correção só vale se a célula ainda estiver exatamente como quando ela foi escrita —
  // se a planilha for corrigida na origem, o fix simplesmente deixa de se aplicar.
  const candidate = URL_FIXES.get(title);
  const fix = candidate?.from === rawUrl ? candidate : undefined;
  const url = fix ? fix.to : rawUrl;

  const provider = classifyProvider(url);
  const { hostname } = new URL(url);
  const origin = ORIGIN_BY_HOST.get(hostname) ?? { source: hostname, tag: hostname };
  const tags = [...new Set([slugify(theme).replace(/-/g, " "), origin.tag])].filter(Boolean);

  return {
    schemaVersion: 3,
    id: uniqueId(title, takenIds),
    title,
    description: `Painel publicado pela Prefeitura de Osasco no tema ${theme}.`,
    theme,
    tags,
    metadata: {
      source: origin.source,
      owner: `Prefeitura de Osasco — ${theme}`,
      methodologyNote: fix ? `${IMPORT_NOTE} ${fix.note}` : IMPORT_NOTE,
    },
    presentation: "default",
    embed: { provider, url },
  };
}

// ---------------------------------------------------------------------------------------------
// Geração do módulo TypeScript
// ---------------------------------------------------------------------------------------------

const HEADER = `// ARQUIVO GERADO — não editar à mão.
// Fonte: docs/catalogo_paineis_osasco.xlsx (aba "${SHEET_NAME}").
// Regerar com: npm run catalogo:import
//
// Para ajustar um painel individualmente sem perder a alteração na próxima importação, edite-o
// em /admin/paineis: o PanelStore grava a versão editada no localStorage e ela sobrepõe a
// estática por id.

import type { PanelConfig } from "../schemas/panel.schema";

export const catalogoOsascoPanels: PanelConfig[] = `;

function main() {
  const entries = readZipEntries(readFileSync(XLSX_PATH));
  const rows = readSheetRows(entries, SHEET_NAME);
  const [header, ...body] = rows;

  const expectedHeader = ["Tema (Categoria)", "Título do Painel", "Link de Embed"];
  if (expectedHeader.some((column, index) => header?.[index] !== column)) {
    throw new Error(
      `Cabeçalho inesperado na aba "${SHEET_NAME}": ${JSON.stringify(header)}. ` +
        `Esperado: ${JSON.stringify(expectedHeader)}.`,
    );
  }

  const takenIds = new Set();
  const panels = body
    .filter((row) => row[0] && row[1] && row[2])
    .map((row) => toPanelConfig(row, takenIds));

  if (panels.length === 0) throw new Error(`Nenhuma linha válida na aba "${SHEET_NAME}".`);

  writeFileSync(OUTPUT_PATH, `${HEADER}${JSON.stringify(panels, null, 2)};\n`, "utf8");

  // Chamar o bin do Prettier direto pelo Node (em vez de `npx`, que exigiria shell no Windows)
  // mantém a saída gerada idêntica à que `npm run format:check` espera.
  const prettier = spawnSync(
    process.execPath,
    [resolve(projectRoot, "node_modules/prettier/bin/prettier.cjs"), "--write", OUTPUT_PATH],
    { cwd: projectRoot, stdio: "inherit" },
  );
  if (prettier.status !== 0) {
    throw new Error("Falha ao formatar o arquivo gerado com o Prettier.");
  }

  const byProvider = panels.reduce((acc, panel) => {
    acc[panel.embed.provider] = (acc[panel.embed.provider] ?? 0) + 1;
    return acc;
  }, {});

  console.log(`${panels.length} painéis gerados em src/config/panels/catalogo-osasco.generated.ts`);
  for (const [provider, count] of Object.entries(byProvider).sort()) {
    console.log(`  ${provider.padEnd(16)} ${count}`);
  }
}

main();
