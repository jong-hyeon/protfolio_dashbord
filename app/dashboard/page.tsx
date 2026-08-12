import { redirect } from "next/navigation";

import { LogoutButton } from "@/components/auth/logout-button";
import { AssetsDashboard } from "@/components/assets/assets-dashboard";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return <main className="mx-auto min-h-screen max-w-6xl p-6"><header className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">개인 투자 포트폴리오</p><h1 className="text-2xl font-semibold">대시보드</h1></div><LogoutButton /></header><AssetsDashboard /></main>;
}
