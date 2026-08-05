import type { CollectionConfig } from "../schemas/collection.schema";
import { visaoExecutiva } from "./visao-executiva.collection";
import { acompanhamentoMensal } from "./acompanhamento-mensal.collection";

export const collectionRegistry: CollectionConfig[] = [visaoExecutiva, acompanhamentoMensal];

export function findCollectionConfig(collectionId: string): CollectionConfig | undefined {
  return collectionRegistry.find((collection) => collection.id === collectionId);
}
