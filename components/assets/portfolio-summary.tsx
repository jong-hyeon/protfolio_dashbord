import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatKrw } from "@/features/assets/asset.calculations";

export function PortfolioSummary({ totalValue }: { totalValue: number }) {
  return <Card><CardHeader className="p-5 sm:p-6 lg:p-8"><CardDescription>총 평가금액</CardDescription><CardTitle className="text-3xl tracking-tight sm:text-4xl">{formatKrw(totalValue)}</CardTitle></CardHeader><CardContent className="p-5 pt-0 text-sm text-muted-foreground sm:p-6 sm:pt-0 lg:px-8 lg:pb-8">수량 × 현재가 기준</CardContent></Card>;
}
