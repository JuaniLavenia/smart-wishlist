import { useMemo } from 'react'
import type { PriceResult, PriceFilters, SortOption } from '@/types'

export function useFilteredResults(
  results: PriceResult[],
  filters: PriceFilters,
  sortOption: SortOption
): PriceResult[] {
  return useMemo(() => {
    let filtered = [...results]

    // Apply filters
    if (filters.freeShipping) {
      filtered = filtered.filter((r) => r.freeShipping)
    }

    if (filters.interestFree) {
      filtered = filtered.filter((r) => r.interestFree)
    }

    if (filters.minPrice !== undefined) {
      filtered = filtered.filter((r) => r.price >= filters.minPrice!)
    }

    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter((r) => r.price <= filters.maxPrice!)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortOption) {
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'relevance':
        default:
          return 0
      }
    })

    return filtered
  }, [results, filters, sortOption])
}