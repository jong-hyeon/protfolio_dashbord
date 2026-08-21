import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SignupForm } from "@/components/auth/signup-form";

const { signUp } = vi.hoisted(() => ({ signUp: vi.fn() }));

vi.mock("next/link", () => ({
  default: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({ auth: { signUp } }),
}));

afterEach(() => {
  cleanup();
  signUp.mockReset();
});

describe("SignupForm", () => {
  it("submits valid details and shows a confirmation message", async () => {
    signUp.mockResolvedValue({ error: null });
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(screen.getByLabelText("이메일"), "test@example.com");
    await user.type(screen.getByLabelText("비밀번호"), "password123");
    await user.click(screen.getByRole("button", { name: "회원가입" }));

    expect((await screen.findByRole("status")).textContent).toContain(
      "가입 확인 이메일을 보냈습니다. 받은 편지함을 확인해 주세요.",
    );
  });

  it("shows an actionable message when the Supabase request cannot be fetched", async () => {
    signUp.mockRejectedValue(new TypeError("Failed to fetch"));
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(screen.getByLabelText("이메일"), "test@example.com");
    await user.type(screen.getByLabelText("비밀번호"), "password123");
    await user.click(screen.getByRole("button", { name: "회원가입" }));

    expect((await screen.findByRole("alert")).textContent).toContain(
      "인증 서버에 연결할 수 없습니다",
    );
  });
});
