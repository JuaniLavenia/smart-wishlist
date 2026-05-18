import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import type { Product } from '@/types'

interface WishlistState {
  products: Product[]
  addProduct: (name: string) => void
  updateProduct: (id: string, name: string) => void
  deleteProduct: (id: string) => void
  getProduct: (id: string) => Product | undefined
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      products: [],

      addProduct: (name: string) => {
        const newProduct: Product = {
          id: uuidv4(),
          name: name.trim(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }
        set((state) => ({
          products: [...state.products, newProduct],
        }))
      },

      updateProduct: (id: string, name: string) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id
              ? { ...p, name: name.trim(), updatedAt: Date.now() }
              : p
          ),
        }))
      },

      deleteProduct: (id: string) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }))
      },

      getProduct: (id: string) => {
        return get().products.find((p) => p.id === id)
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
)