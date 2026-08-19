export interface ProductOut {
  id: number;
  img_id: number;
  name: string;
  price: number;
  category_id: number;
  category_name: string;
  condition: "new" | "used";
  img: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  category_id: number;
  condition: "new" | "used";
}

export interface ProductImage {
  id: number;
  product_id: number;
  path: string;
  position: number;
}

export interface ProductCreate {
  name: string;
  price: number;
  category_id: number;
  condition: "new" | "used";
}
