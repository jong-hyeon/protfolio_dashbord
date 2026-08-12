export const accountTypes = ["isa", "brokerage", "cash"] as const;
export const assetClasses = ["us_stock", "kr_stock", "bond", "gold", "cash"] as const;

export type AccountType = (typeof accountTypes)[number];
export type AssetClass = (typeof assetClasses)[number];

export type Asset = {
  id: string;
  userId: string;
  name: string;
  accountType: AccountType;
  assetClass: AssetClass;
  quantity: number;
  currentPrice: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateAssetInput = Omit<Asset, "id" | "userId" | "createdAt" | "updatedAt">;
