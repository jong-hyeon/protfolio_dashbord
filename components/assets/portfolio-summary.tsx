import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatKrw } from "@/features/assets/asset.calculations";

export function PortfolioSummary({ totalValue }: { totalValue: number }) {
  return <Card className="border-t-4 border-t-stark-violet"><CardHeader className="p-5 sm:p-6 lg:p-8"><CardDescription className="font-mono text-xs font-medium tracking-[0.16em] text-stark-violet uppercase">총 평가금액</CardDescription><CardTitle className="text-4xl font-black tracking-tight text-stark-navy sm:text-5xl">{formatKrw(totalValue)}</CardTitle></CardHeader><CardContent className="p-5 pt-0 text-sm text-muted-foreground sm:p-6 sm:pt-0 lg:px-8 lg:pb-8">수량 × 현재가 기준</CardContent></Card>;
}
