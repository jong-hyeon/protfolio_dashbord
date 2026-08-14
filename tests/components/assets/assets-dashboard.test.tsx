import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { AssetTable } from "@/components/assets/asset-table";

afterEach(cleanup);

describe("AssetTable", () => {
  it("preserves every asset column in the table component's scroll container", () => {
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

    expect(screen.getByTestId("asset-table-scroll").className).not.toContain("overflow-x-auto");
    expect(document.querySelector('[data-slot="table-container"]')?.className).toContain("overflow-x-auto");
    expect(screen.getByRole("table").className).toContain("min-w-[760px]");
    expect(screen.getAllByRole("columnheader")).toHaveLength(6);
    expect(screen.getByRole("columnheader", { name: "자산" })).toBeTruthy();
    expect(screen.getByRole("columnheader", { name: "계좌" })).toBeTruthy();
    expect(screen.getByRole("columnheader", { name: "자산군" })).toBeTruthy();
    expect(screen.getByRole("columnheader", { name: "수량" })).toBeTruthy();
    expect(screen.getByRole("columnheader", { name: "현재가" })).toBeTruthy();
    expect(screen.getByRole("columnheader", { name: "평가금액" })).toBeTruthy();
  });
});
