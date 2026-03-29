import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from './useCartStore';

export interface Order {
  id: string;
  items: Product[];
  total: number;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered';
  shippingAddress: {
    fullName: string;
    email: string;
    address: string;
    city: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
}

interface OrderStore {
  orders: Order[];
  addOrder: (order: Order) => void;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set) => ({
      orders: [],
      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
    }),
    {
      name: 'order-storage',
    }
  )
);
