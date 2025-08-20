import { User, cartItem } from "@/types/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface OptionProps {
  id: number;
  quantity: number;
}

type Store = {
  cart: Array<cartItem>;
  user: User | null;
  token: string | null;
  DeliveryFees: number;
  transactionRef: string | null;
  isFirstOrder: boolean;
};

type Actions = {
  addToCart: (item: cartItem) => void;
  editCart: (item: cartItem) => void;
  removeFromCart: (itemId: number) => void;
  emptyCart: () => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  totalPrice: () => number;
  setFees: (fees?: number) => void;
  setTransaction: (refString: string | null) => void;
};

const initialState: Store = {
  cart: [],
  user: null,
  token: null,
  DeliveryFees: 0,
  transactionRef: "",
  isFirstOrder: true,
};

const useStore = create<Store & Actions>()(
  persist(
    (set, get) => ({
      ...initialState,
      addToCart: (item) => set({ cart: [item, ...get().cart] }),
      editCart: (item) =>
        set({
          cart: get().cart.map((cartItem) =>
            cartItem.itemId === item.itemId ? item : cartItem
          ),
        }),
      removeFromCart: (itemId) =>
        set({
          cart: get().cart.filter((element) => element.itemId != itemId),
        }),
      emptyCart: () => set({ cart: [] }),
      login: (user, token) =>
        set({ user: user, token: token, isFirstOrder: user.isFirstOrder }),
      logout: () => set(initialState),
      totalPrice: () => {
        let value = get().cart.reduce((accumulator, item) => {
          const price = item.price * item.qte;
          return accumulator + price;
        }, 0);
        return value;
      },
      setFees: (fees) => {
        if (!fees) {
          set({ DeliveryFees: 0 });
        } else {
          if (!get().isFirstOrder) {
            set({ DeliveryFees: fees });
          }
        }
      },
      setTransaction: (refString) => set({ transactionRef: refString }),
    }),
    { name: "cartStore" }
  )
);

export default useStore;
