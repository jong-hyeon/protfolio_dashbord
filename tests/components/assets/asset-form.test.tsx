import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AssetForm } from "@/components/assets/asset-form";

afterEach(cleanup);

describe("AssetForm", () => {
  it("disables browser autocomplete for the asset name field", () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<AssetForm onSubmit={onSubmit} />);

    const nameInput = screen.getByLabelText("자산 이름");

    expect(nameInput.getAttribute("name")).toBe("assetName");
    expect(nameInput.getAttribute("autocomplete")).toBe("off");
    expect(nameInput.closest("form")?.getAttribute("autocomplete")).toBe("off");
  });

  it("submits a complete asset", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<AssetForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("자산 이름"), "S&P 500 ETF");
    await user.type(screen.getByLabelText("수량"), "2");
    await user.type(screen.getByLabelText("현재가 (원)"), "50000");
    await user.click(screen.getByRole("button", { name: "자산 추가" }));

    expect(onSubmit).toHaveBeenCalledWith({
      name: "S&P 500 ETF",
      accountType: "isa",
      assetClass: "us_stock",
      quantity: 2,
      currentPrice: 50000,
    });
  });
});
