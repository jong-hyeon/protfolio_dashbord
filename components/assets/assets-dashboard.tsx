"use client";

import { useEffect, useMemo, useState } from "react";

import { calculateTotalValue } from "@/features/assets/asset.calculations";
import { SupabaseAssetRepository } from "@/features/assets/supabase-asset.repository";
import type { Asset, CreateAssetInput } from "@/features/assets/asset.types";

import { AssetForm } from "./asset-form";
import { AssetTable } from "./asset-table";
import { PortfolioSummary } from "./portfolio-summary";
import { Card, CardContent } from "@/components/ui/card";

const repository = new SupabaseAssetRepository();

export function AssetsDashboard() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const totalValue = useMemo(() => calculateTotalValue(assets), [assets]);

  useEffect(() => { repository.list().then(setAssets).catch(() => setError("자산 목록을 불러오지 못했습니다.")).finally(() => setIsLoading(false)); }, []);

  async function addAsset(input: CreateAssetInput) {
    const asset = await repository.create(input);
    setAssets((current) => [asset, ...current]);
  }

  return (
    <div className="mt-8 space-y-8 lg:mt-10 lg:space-y-10">
      <PortfolioSummary totalValue={totalValue} />
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-4">
          <AssetForm onSubmit={addAsset} />
        </div>
        <section className="min-w-0 lg:col-span-8">
          <Card>
            <CardContent className="space-y-5 p-5 sm:p-6 lg:p-8">
              <div>
                <h2 className="text-lg font-semibold">자산 목록</h2>
                <p className="text-sm text-muted-foreground">총 {assets.length}개 자산</p>
              </div>
              {error ? <p className="text-sm text-destructive" role="alert">{error}</p> : isLoading ? <p className="text-sm text-muted-foreground">자산을 불러오는 중...</p> : <AssetTable assets={assets} />}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
