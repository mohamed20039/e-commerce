import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface Product {
  id: string;
  imageUrl: string;
  productDescription: string;
  productName: string;
  productPrice: number;
  quantity: number;
}

type UseCart = {
  Products: Product[];
  addProduct: (product: Product) => void;
  removeProduct: (product: Product) => void;
  removeAllProducts: () => void;
  totalPrice: number;
  totalItems: number;
  tax: number;
  addQuantity: (product: Product) => void;
  decrementQuantity: (product: Product) => void;
  shippingPrice: number;
  setShippingPrice: (price: number) => void;
  calculateTax: (totalPrice: number) => void; // Renamed to calculate the tax based on the total price
};

export const useCart = create<UseCart>()(
  persist(
    (set, get) => ({
      Products: [],
      totalPrice: 0,
      totalItems: 0,
      shippingPrice: 0,
      tax: 0,

      addProduct: (product: Product) => {
        const cart = get().Products;
        const cartItem = cart.find((item) => item.id === product.id);
        if (cartItem) {
          set((state) => {
            const updatedCart = state.Products.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
            return {
              Products: updatedCart,
              totalItems: state.totalItems + 1,
              totalPrice: state.totalPrice + product.productPrice,
            };
          });
        } else {
          set((state) => ({
            Products: [...cart, { ...product, quantity: 1 }],
            totalItems: state.totalItems + 1,
            totalPrice: state.totalPrice + product.productPrice,
          }));
        }
        get().calculateTax(get().totalPrice);
      },

      removeProduct: (product: Product) => {
        set((state) => {
          const cartItem = state.Products.find(
            (item) => item.id === product.id
          );
          if (cartItem) {
            return {
              Products: state.Products.filter((item) => item.id !== product.id),
              totalItems: state.totalItems - cartItem.quantity,
              totalPrice:
                state.totalPrice - cartItem.productPrice * cartItem.quantity,
            };
          }
          return state;
        });
        get().calculateTax(get().totalPrice); // Recalculate tax whenever a product is removed
      },

      removeAllProducts: () => {
        set(() => ({
          Products: [],
          totalPrice: 0,
          totalItems: 0,
          shippingPrice: 0,
          tax: 0, // Reset tax
        }));
      },

      addQuantity: (product) => {
        set((state) => {
          const cart = get().Products;
          const cartItem = cart.find((item) => item.id === product.id);
          if (cartItem) {
            const updatedCart = cart.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
            return {
              Products: updatedCart,
              totalPrice: state.totalPrice + product.productPrice,
              totalItems: state.totalItems + 1,
            };
          }
          return state;
        });
        get().calculateTax(get().totalPrice); // Recalculate tax whenever quantity is added
      },

      decrementQuantity: (product) => {
        set((state) => {
          const cart = get().Products;
          const cartItem = cart.find((item) => item.id === product.id);
          if (cartItem) {
            if (cartItem.quantity === 1) {
              return {
                Products: state.Products.filter(
                  (item) => item.id !== product.id
                ),
                totalItems: state.totalItems - 1,
                totalPrice: state.totalPrice - product.productPrice,
              };
            } else {
              const updatedCart = cart.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity - 1 }
                  : item
              );
              return {
                Products: updatedCart,
                totalPrice: state.totalPrice - product.productPrice,
                totalItems: state.totalItems - 1,
              };
            }
          }
          return state;
        });
        get().calculateTax(get().totalPrice); // Recalculate tax whenever quantity is decremented
      },

      setShippingPrice: (price: number) => {
        set(() => ({
          shippingPrice: price,
        }));
      },

      calculateTax: (totalPrice) => {
        set(() => ({
          tax: totalPrice * 0.05, // Calculate tax based on total price
        }));
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
