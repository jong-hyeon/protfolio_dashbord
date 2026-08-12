"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export function SignupForm() {
  const [message, setMessage] = useState<string>();
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true); setError(undefined); setMessage(undefined);
    const formData = new FormData(event.currentTarget);
    const { error: signUpError } = await createClient().auth.signUp({
      email: String(formData.get("email")), password: String(formData.get("password")),
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    });
    setIsSubmitting(false);
    if (signUpError) return setError(signUpError.message);
    setMessage("가입 확인 이메일을 보냈습니다. 받은 편지함을 확인해 주세요.");
  }

  return <form className="space-y-5" onSubmit={handleSubmit}>
    <div className="space-y-2"><Label htmlFor="email">이메일</Label><Input id="email" name="email" type="email" required /></div>
    <div className="space-y-2"><Label htmlFor="password">비밀번호</Label><Input id="password" name="password" type="password" minLength={6} required /></div>
    {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
    {message && <p className="text-sm text-emerald-700" role="status">{message}</p>}
    <Button className="w-full" disabled={isSubmitting}>{isSubmitting ? "가입 중..." : "회원가입"}</Button>
    <p className="text-center text-sm text-muted-foreground">이미 계정이 있나요? <Link className="font-medium text-foreground underline" href="/login">로그인</Link></p>
  </form>;
}
