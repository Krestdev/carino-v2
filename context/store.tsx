// @/context/store.js
import { ApplyPromotions } from "@/components/universal/promotions";
import { AuthUser, cartItem, ReceiptProps, User } from "@/types/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface OptionProps {
  id: number;
  quantity: number;
}

type Store = {
  cart: Array<cartItem>;
  user: AuthUser | null;
  token: string | null;
  DeliveryFees: number;
  transactionRef: string | null;
  receiptData: ReceiptProps | null;
  isFirstOrder: boolean;
  isHydrated: boolean;
  openLogSign: boolean;
  isAuthenticated: boolean;
};

type Actions = {
  addToCart: (item: cartItem, qte?: number) => void;
  editCart: (item: cartItem) => void;
  removeFromCart: (item_id: number) => void;
  updateQuantity: (item_id: number, quantity: number) => void;
  emptyCart: () => void;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
  setFees: (fees?: number) => void;
  setTransaction: (refString: string | null) => void;
  setReceiptData: (data?: ReceiptProps) => void;
  setIsHydrated: (v: boolean) => void;
  cartWithPromo: () => Array<cartItem>;
  setOpenLogSign: (v: boolean) => void;
  updateCartItem: (item_id: number, item: cartItem) => void;
  getToken: () => string | null;
  isTokenValid: () => boolean;
};

const initialState: Store = {
  cart: [],
  user: null,
  token: null,
  receiptData: null,
  DeliveryFees: 0,
  transactionRef: "",
  isFirstOrder: true,
  isHydrated: false,
  openLogSign: false,
  isAuthenticated: false,
};

const useStore = create<Store & Actions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setOpenLogSign: (v) => set({ openLogSign: v }),

      addToCart: (item: cartItem) =>
        set((state) => {
          const existingIndex = state.cart.findIndex(
            (cartItem) =>
              cartItem.item_id === item.item_id &&
              JSON.stringify(cartItem.options) === JSON.stringify(item.options)
          );

          if (existingIndex !== -1) {
            const updatedCart = [...state.cart];
            updatedCart[existingIndex] = {
              ...updatedCart[existingIndex],
              quantity: updatedCart[existingIndex].quantity + item.quantity,
            };
            return { cart: updatedCart };
          } else {
            return { cart: [item, ...state.cart] };
          }
        }),

      editCart: (item) =>
        set({
          cart: get().cart.map((cartItem) =>
            cartItem.item_id === item.item_id ? item : cartItem
          ),
        }),

      updateCartItem: (item_id, item) =>
        set({
          cart: get().cart.map((cartItem) =>
            cartItem.item_id === item_id ? item : cartItem
          ),
        }),

      removeFromCart: (item_id) =>
        set({
          cart: get().cart.filter((element) => element.item_id != item_id),
        }),

      updateQuantity: (item_id, quantity) =>
        set({
          cart: get().cart.map((cartItem) =>
            cartItem.item_id === item_id ? { ...cartItem, quantity: quantity } : cartItem
          ),
        }),

      emptyCart: () => set({ cart: [] }),

      // Login amélioré avec stockage explicite
      login: (user, token) => {
        // Stockage dans l'état
        set({
          user,
          token,
          isFirstOrder: user.isFirstOrder,
          isAuthenticated: true
        });

        // Stockage explicite dans localStorage (redondant avec persist mais plus fiable)
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', token);
        }
      },

      // Logout amélioré avec nettoyage complet
      logout: () => {
        // Nettoyage explicite du localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
        }
        // Reset complet de l'état
        set(initialState);
      },

      // Getter pour le token
      getToken: () => {
        // Essayer d'abord l'état, puis le localStorage comme fallback
        const stateToken = get().token;
        if (stateToken) return stateToken;

        if (typeof window !== 'undefined') {
          return localStorage.getItem('auth_token');
        }
        return null;
      },

      // Vérification de la validité du token
      isTokenValid: () => {
        const token = get().getToken();
        if (!token) return false;

        try {
          // Décoder le JWT (sans vérifier la signature)
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const payload = JSON.parse(window.atob(base64));

          // Vérifier l'expiration
          if (payload.exp) {
            return payload.exp * 1000 > Date.now();
          }
          return true;
        } catch (error) {
          console.error('Erreur lors de la vérification du token:', error);
          return false;
        }
      },

      setToken: (token: string) => set({ token }),

      setFees: (fees) => {
        if (!fees) {
          set({ DeliveryFees: 0 });
        } else {
          if (!get().isFirstOrder) {
            set({ DeliveryFees: fees });
          }
        }
      },

      setIsHydrated: (v) => set({ isHydrated: v }),

      cartWithPromo: () => {
        const baseCart = get().cart;
        return ApplyPromotions(baseCart);
      },

      setTransaction: (refString) => set({ transactionRef: refString }),

      setReceiptData: (data) =>
        data ? set({ receiptData: data }) : set({ receiptData: null }),
    }),
    {
      name: "cartStore",
      partialize: (state) => ({
        // Persister uniquement ces champs
        cart: state.cart,
        user: state.user,
        token: state.token,
        isFirstOrder: state.isFirstOrder,
        isAuthenticated: state.isAuthenticated,
        DeliveryFees: state.DeliveryFees,
        transactionRef: state.transactionRef,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("Erreur rehydrate cartStore", error);
          return;
        }
        if (state) {
          state.isHydrated = true;

          // Vérifier si le token est toujours valide après réhydratation
          if (state.token && typeof window !== 'undefined') {
            try {
              const base64Url = state.token.split('.')[1];
              const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
              const payload = JSON.parse(window.atob(base64));

              if (payload.exp && payload.exp * 1000 < Date.now()) {
                // Token expiré, déconnexion automatique
                console.log('Token expiré, déconnexion...');
                state.token = null;
                state.user = null;
                state.isAuthenticated = false;
                localStorage.removeItem('auth_token');
              }
            } catch (error) {
              console.error('Erreur vérification token:', error);
            }
          }
        }
      },
    }
  )
);

export default useStore;