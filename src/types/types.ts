export interface Client {
   _id?: string;
   name: string;
   instagram_account: string;
   address: string;
   city: string;
   phone: number;
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
   client: Client;
   items: {
      item_id: string;
      color: string;
   }[];
   original_items: Item[];
}

export interface SalesDataTable {
   id: string;
   avatarItems: {
      id: number;
      image_src: string;
      name: string;
   }[];
   totalProducts: number;
   totalPrice: number;
   city: string;
   date: Date;
   nestedTableData: {
      nestedItems: {
         id: number;
         item_id: string;
         name: string;
         image_src: string;
         color: string;
         price: number;
      }[];
      nestedClient: Client;
   };
}
