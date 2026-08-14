import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { calculateAssetValue, formatKrw } from "@/features/assets/asset.calculations";
import type { Asset } from "@/features/assets/asset.types";

const accountLabels = { isa: "ISA", brokerage: "일반계좌", cash: "현금" };
const classLabels = { us_stock: "미국주식", kr_stock: "국내주식", bond: "채권", gold: "금", cash: "현금" };

export function AssetTable({ assets }: { assets: Asset[] }) {
  if (!assets.length) return <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">아직 자산이 없습니다. 위 폼에서 첫 자산을 추가해 보세요.</p>;
  return <div data-testid="asset-table-scroll" className="overflow-x-auto rounded-xl border"><Table className="min-w-[760px]"><TableHeader><TableRow><TableHead>자산</TableHead><TableHead>계좌</TableHead><TableHead>자산군</TableHead><TableHead className="text-right">수량</TableHead><TableHead className="text-right">현재가</TableHead><TableHead className="text-right">평가금액</TableHead></TableRow></TableHeader><TableBody>{assets.map((asset) => <TableRow key={asset.id}><TableCell className="font-medium">{asset.name}</TableCell><TableCell>{accountLabels[asset.accountType]}</TableCell><TableCell>{classLabels[asset.assetClass]}</TableCell><TableCell className="text-right">{asset.quantity.toLocaleString("ko-KR")}</TableCell><TableCell className="text-right">{formatKrw(asset.currentPrice)}</TableCell><TableCell className="text-right font-medium">{formatKrw(calculateAssetValue(asset))}</TableCell></TableRow>)}</TableBody></Table></div>;
}
