export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  pricePerUnit: number;
  length: number;
  width: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Sale {
  id: string;
  items: CartItem[];
  total: number;
  timestamp: number;
  payment: {
    amountPaid: number;
    change: number;
  };
  notes: string;
  customerName: string;
}

export interface ShopInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
}
