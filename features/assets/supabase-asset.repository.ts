import { createClient } from "@/lib/supabase/client";

import type { Asset, CreateAssetInput } from "./asset.types";
import type { AssetRepository } from "./asset.repository";

function toAsset(row: { id: string; user_id: string; name: string; account_type: Asset["accountType"]; asset_class: Asset["assetClass"]; quantity: number; current_price: number; created_at: string; updated_at: string }): Asset {
  return { id: row.id, userId: row.user_id, name: row.name, accountType: row.account_type, assetClass: row.asset_class, quantity: Number(row.quantity), currentPrice: Number(row.current_price), createdAt: row.created_at, updatedAt: row.updated_at };
}

export class SupabaseAssetRepository implements AssetRepository {
  async list(): Promise<Asset[]> {
    const { data, error } = await createClient().from("assets").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(toAsset);
  }

  async create(input: CreateAssetInput): Promise<Asset> {
    const supabase = createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error("로그인 정보를 확인할 수 없습니다.");
    const { data, error } = await supabase.from("assets").insert({ user_id: user.id, name: input.name, account_type: input.accountType, asset_class: input.assetClass, quantity: input.quantity, current_price: input.currentPrice }).select().single();
    if (error) throw error;
    return toAsset(data);
  }
}
