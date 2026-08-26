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
    <main className="min-h-screen bg-stark-cream">
      <header className="bg-stark-navy text-white">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 py-8 sm:flex-row sm:items-end sm:justify-between sm:px-6 lg:px-10 lg:py-10">
          <div>
            <p className="font-mono text-xs font-medium tracking-[0.18em] text-stark-yellow uppercase">개인 투자 포트폴리오</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl"><span className="relative inline-block"><span className="relative z-10">대시보드</span><span aria-hidden="true" className="absolute inset-x-0 bottom-1 z-0 h-3 bg-stark-yellow" /></span></h1>
          </div>
          <LogoutButton />
        </div>
      </header>
      <div className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 lg:px-10 lg:py-10"><AssetsDashboard /></div>
    </main>
  );
}
