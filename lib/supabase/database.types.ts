export type AccountType = "isa" | "brokerage" | "cash";
export type AssetClass = "us_stock" | "kr_stock" | "bond" | "gold" | "cash";

export type Database = {
  public: {
    Tables: {
      assets: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          account_type: AccountType;
          asset_class: AssetClass;
          quantity: number;
          current_price: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          account_type: AccountType;
          asset_class: AssetClass;
          quantity: number;
          current_price: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          account_type?: AccountType;
          asset_class?: AssetClass;
          quantity?: number;
          current_price?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      account_type: AccountType;
      asset_class: AssetClass;
    };
    CompositeTypes: Record<string, never>;
  };
};
