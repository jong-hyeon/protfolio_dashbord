import { describe, expect, it } from "vitest";

import { assetInputSchema } from "@/features/assets/asset.validation";

const validInput = {
  name: "S&P 500 ETF",
  accountType: "isa",
  assetClass: "us_stock",
  quantity: 2,
  currentPrice: 50000,
};

describe("asset input validation", () => {
  it("rejects blank names and non-positive values", () => {
    expect(
      assetInputSchema.safeParse({ ...validInput, name: " ", quantity: 0 }),
    ).toMatchObject({ success: false });
  });

  it("accepts a complete asset with positive values", () => {
    expect(assetInputSchema.safeParse(validInput)).toMatchObject({ success: true });
  });
});
