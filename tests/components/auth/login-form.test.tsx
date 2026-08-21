import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { LoginForm } from "@/components/auth/login-form";

const { replace, refresh, signInWithPassword } = vi.hoisted(() => ({
  replace: vi.fn(),
  refresh: vi.fn(),
  signInWithPassword: vi.fn(),
}));

vi.mock("next/link", () => ({
  default: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace, refresh }),
}));

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({ auth: { signInWithPassword } }),
}));

afterEach(() => {
  cleanup();
  replace.mockReset();
  refresh.mockReset();
  signInWithPassword.mockReset();
});

describe("LoginForm", () => {
  it("shows an actionable message when the Supabase request cannot be fetched", async () => {
    signInWithPassword.mockRejectedValue(new TypeError("Failed to fetch"));
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText("이메일"), "test@example.com");
    await user.type(screen.getByLabelText("비밀번호"), "password123");
    await user.click(screen.getByRole("button", { name: "로그인" }));

    expect((await screen.findByRole("alert")).textContent).toContain(
      "Supabase 프로젝트 활성 상태",
    );
  });
});
