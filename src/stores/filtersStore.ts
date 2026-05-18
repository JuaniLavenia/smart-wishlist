import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PriceFilters, SortOption } from '@/types'

interface FiltersState {
  filters: PriceFilters
  sortOption: SortOption
  setFreeShipping: (value: boolean) => void
  setInterestFree: (value: boolean) => void
  setPriceRange: (min?: number, max?: number) => void
  setSortOption: (option: SortOption) => void
  resetFilters: () => void
}

const defaultFilters: PriceFilters = {
  freeShipping: false,
  interestFree: false,
  minPrice: undefined,
  maxPrice: undefined,
}

export const useFiltersStore = create<FiltersState>()(
  persist(
    (set) => ({
      filters: { ...defaultFilters },
      sortOption: 'price-asc',

      setFreeShipping: (value: boolean) => {
        set((state) => ({
          filters: { ...state.filters, freeShipping: value },
        }))
      },

      setInterestFree: (value: boolean) => {
        set((state) => ({
          filters: { ...state.filters, interestFree: value },
        }))
      },

      setPriceRange: (min?: number, max?: number) => {
        set((state) => ({
          filters: { ...state.filters, minPrice: min, maxPrice: max },
        }))
      },

      setSortOption: (option: SortOption) => {
        set({ sortOption: option })
      },

      resetFilters: () => {
        set({ filters: { ...defaultFilters } })
      },
    }),
    {
      name: 'filters-storage',
    }
  )
)