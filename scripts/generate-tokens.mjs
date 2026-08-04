import { transform } from "esbuild";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("..", import.meta.url));
const tokensTsPath = `${projectRoot}src/styles/tokens.ts`;
const tokensCssPath = `${projectRoot}src/styles/tokens.css`;

const source = await readFile(tokensTsPath, "utf8");
const { code } = await transform(source, { loader: "ts", format: "esm" });
const moduleUrl = `data:text/javascript;base64,${Buffer.from(code).toString("base64")}`;
const { tokens } = await import(moduleUrl);

function toCssVars(obj, prefix, out) {
  for (const [key, value] of Object.entries(obj)) {
    const varName = `${prefix}-${key}`;
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      toCssVars(value, varName, out);
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => out.push(`  ${varName}-${index}: ${item};`));
    } else {
      out.push(`  ${varName}: ${value};`);
    }
  }
}

const base = [];
toCssVars(
  {
    spacing: tokens.spacing,
    typography: tokens.typography,
    radius: tokens.radius,
    shadows: tokens.shadows,
    breakpoints: tokens.breakpoints,
  },
  "--pg",
  base,
);

const chart = [];
toCssVars(
  {
    chart: {
      categorical: tokens.colors.chartCategorical,
      sequential: tokens.colors.chartSequential,
    },
  },
  "--pg",
  chart,
);

const light = [];
toCssVars(tokens.colors.light, "--pg-color", light);

const dark = [];
toCssVars(tokens.colors.dark, "--pg-color", dark);

const css = `/* GERADO AUTOMATICAMENTE por scripts/generate-tokens.mjs a partir de src/styles/tokens.ts */
/* Não editar à mão — rode \`npm run tokens:build\` após alterar tokens.ts */

:root {
${base.join("\n")}
${chart.join("\n")}
${light.join("\n")}
}

:root[data-theme="dark"] {
${dark.join("\n")}
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
${dark.join("\n")}
  }
}
`;

await writeFile(tokensCssPath, css, "utf8");
console.log(
  `tokens.css gerado (${light.length + dark.length + base.length + chart.length} propriedades)`,
);
