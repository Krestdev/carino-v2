import { cartItem, ReceiptProps, User } from "@/types/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface OptionProps {
  id: number;
  quantity: number;
}

type Store = {
  cart: Array<cartItem>;
  user: User | null;
  token: string | null;
  transactionRef: string | null;
  receiptData: ReceiptProps | null;
  isFirstOrder: boolean;
};

type Actions = {
  addToCart: (item: cartItem) => void;
  editCart: (item: cartItem) => void;
  removeFromCart: (itemId: number) => void;
  emptyCart: () => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  setToken: (token: string) => void;
  totalPrice: () => number;
  setTransaction: (refString: string | null) => void;
  setReceiptData: (data?: ReceiptProps) => void;
};

const initialState: Store = {
  cart: [],
  user: null,
  token: null,
  receiptData: null,
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
          cart: get().cart.filter((element) => element.itemId !== itemId),
        }),
      emptyCart: () => set({ cart: [] }),
      login: (user, token) =>
        set({ user: user, token: token, isFirstOrder: user.isFirstOrder }),
      logout: () => set(initialState),
      setToken: (token) => set({ token }),
      totalPrice: () =>
        get().cart.reduce(
          (accumulator, item) => accumulator + item.price * item.qte,
          0
        ),
      setTransaction: (refString) => set({ transactionRef: refString }),
      setReceiptData: (data) =>
        data ? set({ receiptData: data }) : set({ receiptData: null }),
    }),
    {
      name: "cartStore", // clé dans le storage
      storage: createJSONStorage(() => localStorage), // utilise localStorage
      partialize: (state) => ({
        // tu peux choisir ce qui est persisté
        cart: state.cart,
        user: state.user,
        token: state.token,
        isFirstOrder: state.isFirstOrder,
      }),
    }
  )
);

export default useStore;
