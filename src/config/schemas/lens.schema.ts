import { z } from "zod";

export const SUPPORTED_LENS_SCHEMA_VERSION = 1;

/** Ids das lentes embutidas no código (src/config/lenses.ts) — uma lente cadastrada não pode reusá-los. */
const RESERVED_LENS_IDS = new Set(["tema", "secretaria", "ods"]);

export const lensConfigSchema = z.object({
  schemaVersion: z.literal(SUPPORTED_LENS_SCHEMA_VERSION),
  id: z
    .string()
    .min(1, "Campo obrigatório")
    .refine((id) => !RESERVED_LENS_IDS.has(id), {
      message: "Esse id já é usado por uma lente padrão do sistema.",
    }),
  label: z.string().min(1, "Campo obrigatório"),
  description: z.string().min(1, "Campo obrigatório"),
  /** Rótulo da opção "ver todos"; se vazio, a UI deriva um a partir de `label`. */
  allLabel: z.string().default(""),
  panelIds: z.array(z.string()).min(1, "Selecione pelo menos um painel"),
});

export type LensConfig = z.infer<typeof lensConfigSchema>;

export function parseLensConfig(input: unknown) {
  return lensConfigSchema.safeParse(input);
}
