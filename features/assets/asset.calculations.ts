type PricedAsset = {
  quantity: number;
  currentPrice: number;
};

export function calculateAssetValue(asset: PricedAsset): number {
  return asset.quantity * asset.currentPrice;
}

export function calculateTotalValue(assets: PricedAsset[]): number {
  return assets.reduce(
    (total, asset) => total + calculateAssetValue(asset),
    0,
  );
}

export function formatKrw(value: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(value);
}
