import { create } from "zustand";
import { CartSummaryDto } from "@/types";

interface CartState {
  summary: CartSummaryDto | null;
  itemCount: number;
  setSummary: (summary: CartSummaryDto | null) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()((set) => ({
  summary: null,
  itemCount: 0,
  setSummary: (summary) =>
    set({
      summary,
      itemCount: summary?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0,
    }),
  clear: () => set({ summary: null, itemCount: 0 }),
}));
