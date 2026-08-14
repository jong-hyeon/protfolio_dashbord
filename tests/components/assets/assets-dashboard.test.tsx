import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { AssetTable } from "@/components/assets/asset-table";

afterEach(cleanup);

describe("AssetTable", () => {
  it("preserves every asset column in a scrollable minimum-width table", () => {
    const asset = {
      id: "asset-1",
      userId: "user-1",
      name: "S&P 500 ETF",
      accountType: "isa",
      assetClass: "us_stock",
      quantity: 2,
      currentPrice: 50000,
      createdAt: "2026-08-14T00:00:00.000Z",
      updatedAt: "2026-08-14T00:00:00.000Z",
    } as const;

    render(<AssetTable assets={[asset]} />);

    expect(screen.getByTestId("asset-table-scroll").className).toContain("overflow-x-auto");
    expect(screen.getByRole("table").className).toContain("min-w-[760px]");
  });
});
