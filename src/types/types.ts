export interface Client {
   _id?: string;
   name: string;
   instagram_account: string;
   address: string;
   city: string;
   phone: number;
   country: string;
   created_at?: Date;
   updated_at?: Date;
}

export interface Item {
   _id?: string;
   name: string;
   price: number;
   image: string;
   available_colors: string[];
   created_at?: Date;
   updated_at?: Date;
}

export interface Sale {
   _id?: string;
   client_id: string;
   items: {
      item_id: string;
      color: string;
   }[];
   created_at?: Date;
   updated_at?: Date;
}

export interface SaleWithClientAndItemData {
   _id: string;
   client_id: string;
   client: Client & {
      created_at: Date;
   };
   items: {
      item_id: string;
      color: string;
   };
   original_items: Item[] & {
      created_at: Date;
   };
}
