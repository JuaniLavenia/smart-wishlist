import { useQuery } from '@tanstack/react-query'
import type { PriceResult } from '@/types'
import { searchGoogleShopping, transformResults } from '@/services/serpapi'
import { useUsageStore } from '@/stores/usageStore'
import { useStoresStore } from '@/stores/storesStore'
import { generateMockPrices } from '@/mocks/stores'

interface SearchResponse {
  query: string
  results: PriceResult[]
  count: number
  source: 'api' | 'mock'
}

// Fallback to mock when API is not available
async function searchPricesMock(query: string): Promise<SearchResponse> {
  // Simulate network delay like real API
  await new Promise((resolve) => setTimeout(resolve, 800))

  const results = generateMockPrices(query)

  // Filter mock results by enabled stores
  const enabledStoreIds = useStoresStore.getState().stores
    .filter((s) => s.enabled)
    .map((s) => s.id)

  const filteredResults = results.filter((r) => enabledStoreIds.includes(r.storeId))

  return {
    query,
    results: filteredResults,
    count: filteredResults.length,
    source: 'mock',
  }
}

async function searchPricesWithLimitCheck(query: string): Promise<SearchResponse> {
  const apiKey = import.meta.env.VITE_SERPAPI_API_KEY
  const { isAtLimit, increment } = useUsageStore.getState()
  const enabledStores = useStoresStore.getState().stores.filter((s) => s.enabled)

  // Check if at our limit before making request
  if (isAtLimit()) {
    console.warn('Smart Wishlist limit (250) reached - using mock data')
    return searchPricesMock(query)
  }

  // If no API key configured, use mock
  if (!apiKey || apiKey === 'your_api_key_here' || apiKey === '') {
    console.info('SerpApi API key not configured - using mock data')
    return searchPricesMock(query)
  }

  try {
    const response = await searchGoogleShopping({
      apiKey,
      query,
      location: 'Argentina',
    })

    const results = transformResults(response)

    // Filter results to only include enabled stores
    // Normalize strings: remove accents and convert to lowercase for comparison
    const normalizeString = (str: string): string => {
      return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^a-z0-9]/g, '') // Remove special chars
    }

    const filteredResults = results.filter((r) => {
      const resultNormalized = normalizeString(r.storeName)

      return enabledStores.some((enabled) => {
        const enabledNormalized = normalizeString(enabled.name)

        // Direct match after normalization
        if (resultNormalized === enabledNormalized) return true

        // Contains match - check if one contains the other
        if (resultNormalized.includes(enabledNormalized) || enabledNormalized.includes(resultNormalized)) return true

        // Partial match - first significant word
        const enabledFirstWord = enabledNormalized.split(' ')[0]
        if (enabledFirstWord && resultNormalized.includes(enabledFirstWord)) return true

        return false
      })
    })

    // Only increment after successful API call
    increment()

    console.info(`Using real SerpApi data! (${filteredResults.length}/${results.length} results after store filter)`)

    return {
      query,
      results: filteredResults,
      count: filteredResults.length,
      source: 'api',
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    // Check if it's a rate limit (429)
    if (errorMessage.includes('Rate limit') || errorMessage.includes('429')) {
      console.warn('SerpApi rate limit (429) - using mock data')
    } else {
      console.error('SerpApi error, using mock fallback:', errorMessage)
    }

    // Don't increment on error
    return searchPricesMock(query)
  }
}

export function usePriceSearch(query: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['priceSearch', query],
    queryFn: () => searchPricesWithLimitCheck(query),
    enabled: enabled && query.length > 0,
    staleTime: 1000 * 60 * 60 * 24 * 30, // 30 days - cached indefinitely
    retry: 0, // No retries to avoid extra API calls
  })
}