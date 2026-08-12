import { z } from "zod";

import { accountTypes, assetClasses } from "./asset.types";

export const assetInputSchema = z.object({
  name: z.string().trim().min(1, "자산 이름을 입력해 주세요."),
  accountType: z.enum(accountTypes),
  assetClass: z.enum(assetClasses),
  quantity: z.number().finite().positive("수량은 0보다 커야 합니다."),
  currentPrice: z.number().finite().positive("현재가는 0보다 커야 합니다."),
});
