"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CreateAssetInput } from "@/features/assets/asset.types";
import { assetInputSchema } from "@/features/assets/asset.validation";

type AssetFormProps = { onSubmit: (input: CreateAssetInput) => Promise<void> };

export function AssetForm({ onSubmit }: AssetFormProps) {
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(undefined);
    const form = event.currentTarget;
    const result = assetInputSchema.safeParse({ name: String(new FormData(form).get("name")), accountType: String(new FormData(form).get("accountType")), assetClass: String(new FormData(form).get("assetClass")), quantity: Number(new FormData(form).get("quantity")), currentPrice: Number(new FormData(form).get("currentPrice")) });
    if (!result.success) return setError(result.error.issues[0]?.message ?? "입력값을 확인해 주세요.");
    setIsSubmitting(true);
    try { await onSubmit(result.data); form.reset(); }
    catch (submissionError) { setError(submissionError instanceof Error ? submissionError.message : "자산을 저장하지 못했습니다."); }
    finally { setIsSubmitting(false); }
  }

  return <Card><CardHeader className="p-5 pb-4 sm:p-6 sm:pb-4"><CardTitle className="text-xl">자산 추가</CardTitle><CardDescription>수량과 현재가를 입력하면 평가금액을 계산합니다.</CardDescription></CardHeader><CardContent className="p-5 pt-0 sm:p-6 sm:pt-0"><form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
    <div className="space-y-2 md:col-span-2"><Label htmlFor="name">자산 이름</Label><Input id="name" name="name" placeholder="예: S&P 500 ETF" required /></div>
    <div className="space-y-2"><Label htmlFor="accountType">계좌</Label><select className="h-9 w-full rounded-md border bg-transparent px-3 text-sm" defaultValue="isa" id="accountType" name="accountType"><option value="isa">ISA</option><option value="brokerage">일반계좌</option><option value="cash">현금</option></select></div>
    <div className="space-y-2"><Label htmlFor="assetClass">자산군</Label><select className="h-9 w-full rounded-md border bg-transparent px-3 text-sm" defaultValue="us_stock" id="assetClass" name="assetClass"><option value="us_stock">미국주식</option><option value="kr_stock">국내주식</option><option value="bond">채권</option><option value="gold">금</option><option value="cash">현금</option></select></div>
    <div className="space-y-2"><Label htmlFor="quantity">수량</Label><Input id="quantity" name="quantity" type="number" min="0.0001" step="any" required /></div>
    <div className="space-y-2"><Label htmlFor="currentPrice">현재가 (원)</Label><Input id="currentPrice" name="currentPrice" type="number" min="1" step="1" required /></div>
    {error && <p className="text-sm text-destructive md:col-span-2" role="alert">{error}</p>}
    <Button type="submit" className="md:col-span-2" disabled={isSubmitting}>{isSubmitting ? "저장 중..." : "자산 추가"}</Button>
  </form></CardContent></Card>;
}
