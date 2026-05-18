import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'

export interface FavoriteItem {
  id: string
  name: string
  image?: string
  url: string
  storeName: string
  price?: number
  createdAt: number
}

interface FavoritesState {
  items: FavoriteItem[]
  lastAdded: FavoriteItem | null
  addFavorite: (item: Omit<FavoriteItem, 'id' | 'createdAt'>) => void
  removeFavorite: (id: string) => void
  isFavorite: (url: string) => boolean
  getByProductName: (productName: string) => FavoriteItem[]
  clearLastAdded: () => void
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],
      lastAdded: null,

      addFavorite: (item) => {
        // Check if already exists by URL
        if (get().isFavorite(item.url)) return

        const newItem: FavoriteItem = {
          ...item,
          id: uuidv4(),
          createdAt: Date.now(),
        }
        set((state) => ({
          items: [newItem, ...state.items],
          lastAdded: newItem,
        }))
      },

      removeFavorite: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }))
      },

      isFavorite: (url) => {
        return get().items.some((item) => item.url === url)
      },

      getByProductName: (productName) => {
        const normalized = productName.toLowerCase().trim()
        return get().items.filter((item) => {
          const itemName = item.name.toLowerCase().trim()
          // Match if product name is contained in favorite name or vice versa
          return (
            itemName.includes(normalized) ||
            normalized.includes(itemName.split(' ')[0]) // Also match first word
          )
        })
      },

      clearLastAdded: () => {
        set({ lastAdded: null })
      },
    }),
    {
      name: 'favorites-storage',
    }
  )
)