import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatKrw } from "@/features/assets/asset.calculations";

export function PortfolioSummary({ totalValue }: { totalValue: number }) {
  return <Card><CardHeader><CardDescription>총 평가금액</CardDescription><CardTitle className="text-3xl">{formatKrw(totalValue)}</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">수량 × 현재가 기준</CardContent></Card>;
}
