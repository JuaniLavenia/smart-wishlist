// Product in wishlist
export interface Product {
  id: string
  name: string
  createdAt: number
  updatedAt: number
}

// Store configuration
export interface Store {
  id: string
  name: string
  logo: string
  enabled: boolean
}

// Price result from search
export interface PriceResult {
  id: string
  storeId: string
  storeName: string
  storeIcon?: string
  productName: string
  productImage?: string
  price: number
  originalPrice?: number
  url: string
  freeShipping: boolean
  interestFree: boolean
  installments?: number
  installmentPrice?: number
  rating?: number
  reviews?: number
  inStock: boolean
}

// Filters for price search
export interface PriceFilters {
  freeShipping: boolean
  interestFree: boolean
  minPrice?: number
  maxPrice?: number
}

// Sort options
export type SortOption = 'price-asc' | 'price-desc' | 'relevance'

// Search result response
export interface SearchResponse {
  query: string
  results: PriceResult[]
  count: number
}