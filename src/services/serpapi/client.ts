/**
 * SerpApi Google Shopping Client
 * Uses Vite proxy to avoid CORS issues
 * API Docs: https://serpapi.com/google-shopping-api
 */

export interface SerpApiShoppingResult {
  position: number
  title: string
  price: string
  extracted_price: number
  source: string
  source_icon?: string
  link: string
  product_link?: string
  thumbnail?: string
  rating?: number
  reviews?: number
  extracted_old_price?: number
  installment?: {
    period?: number
    extracted_price?: number
  }
}

export interface SerpApiResponse {
  shopping_results: SerpApiShoppingResult[]
  search_metadata: {
    status: string
  }
}

export class SerpApiError extends Error {
  statusCode?: number

  constructor(message: string, statusCode?: number) {
    super(message)
    this.name = 'SerpApiError'
    this.statusCode = statusCode
  }
}

interface SearchOptions {
  apiKey: string
  query: string
  location?: string
}

/**
 * Search Google Shopping via Vite proxy (avoids CORS)
 * Endpoint: /api/serpapi?api_key=XXX&q=query&...
 */
export async function searchGoogleShopping({
  apiKey,
  query,
  location = 'Argentina',
}: SearchOptions): Promise<SerpApiResponse> {
  if (!apiKey || apiKey === 'your_api_key_here' || apiKey === '') {
    throw new SerpApiError('API key not configured. Please add VITE_SERPAPI_API_KEY to your .env file.')
  }

  // Build params for SerpApi (not for proxy)
  const params = new URLSearchParams({
    api_key: apiKey,
    engine: 'google_shopping',
    q: query,
    gl: 'ar',
    hl: 'es',
    location,
  })

  // Use Vite proxy endpoint - avoids CORS
  const url = `/api/serpapi?${params.toString()}`

  try {
    const response = await fetch(url)

    // Handle specific error codes
    if (response.status === 401 || response.status === 403) {
      throw new SerpApiError('Invalid API key. Please check your SerpApi key.', response.status)
    }

    if (response.status === 429) {
      throw new SerpApiError('Rate limit exceeded. Please wait and try again.', response.status)
    }

    if (response.status >= 500) {
      throw new SerpApiError(`Server error: ${response.status}`, response.status)
    }

    if (!response.ok) {
      throw new SerpApiError(`API error: ${response.status}`, response.status)
    }

    const data = await response.json()

    // Check for SerpApi error responses
    if (data.error) {
      throw new SerpApiError(data.error)
    }

    return data as SerpApiResponse
  } catch (error) {
    if (error instanceof SerpApiError) {
      throw error
    }
    // Network/CORS errors
    throw new SerpApiError(`Network error: ${(error as Error).message}`)
  }
}