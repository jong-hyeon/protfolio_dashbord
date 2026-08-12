import type { Asset, CreateAssetInput } from "./asset.types";

export interface AssetRepository {
  list(): Promise<Asset[]>;
  create(input: CreateAssetInput): Promise<Asset>;
}
