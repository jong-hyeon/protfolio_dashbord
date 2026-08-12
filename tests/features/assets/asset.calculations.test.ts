import { describe, expect, it } from "vitest";

import { calculateAssetValue, calculateTotalValue } from "@/features/assets/asset.calculations";

describe("asset calculations", () => {
  it("calculates an asset value from quantity and current price", () => {
    expect(calculateAssetValue({ quantity: 2.5, currentPrice: 50000 })).toBe(125000);
  });

  it("sums calculated values for all assets", () => {
    expect(
      calculateTotalValue([
        { quantity: 2, currentPrice: 50000 },
        { quantity: 3, currentPrice: 10000 },
      ]),
    ).toBe(130000);
  });
});
