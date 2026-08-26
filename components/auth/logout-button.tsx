"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  return <Button className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white" variant="outline" onClick={async () => { await createClient().auth.signOut(); router.replace("/login"); router.refresh(); }}>로그아웃</Button>;
}
