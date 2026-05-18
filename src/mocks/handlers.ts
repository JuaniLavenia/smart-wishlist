import { http, HttpResponse, delay } from 'msw'
import { mockStores, generateMockPrices } from './stores'

export const handlers = [
  // Get all stores
  http.get('/api/stores', async () => {
    await delay(300)
    return HttpResponse.json(mockStores)
  }),

  // Search prices
  http.post('/api/search', async ({ request }) => {
    const body = await request.json() as { query: string }
    const { query } = body

    // Simulate network latency (800-1500ms)
    await delay(800 + Math.random() * 700)

    if (!query || query.trim().length === 0) {
      return HttpResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    const results = generateMockPrices(query)

    // Filter out disabled stores
    const enabledResults = results.filter((r) => {
      const store = mockStores.find((s) => s.id === r.storeId)
      return store?.enabled ?? false
    })

    return HttpResponse.json({
      query,
      results: enabledResults,
      count: enabledResults.length,
    })
  }),
]