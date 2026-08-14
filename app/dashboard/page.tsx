import { redirect } from "next/navigation";

import { LogoutButton } from "@/components/auth/logout-button";
import { AssetsDashboard } from "@/components/assets/assets-dashboard";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <main className="mx-auto min-h-screen w-full max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">개인 투자 포트폴리오</p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">대시보드</h1>
        </div>
        <LogoutButton />
      </header>
      <AssetsDashboard />
    </main>
  );
}
