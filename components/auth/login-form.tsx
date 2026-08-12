"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(undefined);
    const formData = new FormData(event.currentTarget);
    const { error: signInError } = await createClient().auth.signInWithPassword({
      email: String(formData.get("email")),
      password: String(formData.get("password")),
    });
    setIsSubmitting(false);
    if (signInError) return setError(signInError.message);
    router.replace("/dashboard");
    router.refresh();
  }

  return <form className="space-y-5" onSubmit={handleSubmit}>
    <div className="space-y-2"><Label htmlFor="email">이메일</Label><Input id="email" name="email" type="email" required /></div>
    <div className="space-y-2"><Label htmlFor="password">비밀번호</Label><Input id="password" name="password" type="password" minLength={6} required /></div>
    {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
    <Button className="w-full" disabled={isSubmitting}>{isSubmitting ? "로그인 중..." : "로그인"}</Button>
    <p className="text-center text-sm text-muted-foreground">계정이 없나요? <Link className="font-medium text-foreground underline" href="/signup">회원가입</Link></p>
  </form>;
}
