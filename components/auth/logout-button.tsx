"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  return <Button variant="outline" onClick={async () => { await createClient().auth.signOut(); router.replace("/login"); router.refresh(); }}>로그아웃</Button>;
}
