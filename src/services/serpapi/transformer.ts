/**
 * Transform SerpApi response to PriceResult[]
 * Leverages all real data from SerpApi: prices, installments, ratings, images
 */

import type { PriceResult } from '@/types'
import type { SerpApiResponse, SerpApiShoppingResult } from './client'

/**
 * Map SerpApi result to our PriceResult format
 */
function mapResult(result: SerpApiShoppingResult, index: number): PriceResult {
  // Generate store ID from source name
  const storeId = result.source
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 30)

  // Determine if has interest-free installments
  const hasInstallments = !!result.installment?.period
  const installmentMonths = result.installment?.period
  const installmentPrice = result.installment?.extracted_price

  return {
    id: `serpapi-${Date.now()}-${index}`,
    storeId,
    storeName: result.source,
    storeIcon: result.source_icon,
    productName: result.title,
    productImage: result.thumbnail,
    price: result.extracted_price,
    originalPrice: result.extracted_old_price || undefined,
    url: result.product_link || result.link,
    freeShipping: false, // Not available in basic SerpApi results
    interestFree: hasInstallments && installmentMonths !== undefined && installmentMonths > 1,
    installments: installmentMonths,
    installmentPrice,
    rating: result.rating,
    reviews: result.reviews,
    inStock: true,
  }
}

export function transformResults(response: SerpApiResponse): PriceResult[] {
  if (!response.shopping_results || response.shopping_results.length === 0) {
    return []
  }

  return response.shopping_results.map(mapResult)
}

/**
 * Get formatted price string for display
 */
export function formatPriceARS(price: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(price)
}

/**
 * Check if a result has good installment terms
 */
export function hasGoodInstallments(result: SerpApiShoppingResult): boolean {
  if (!result.installment) return false
  const months = result.installment.period || 0
  return months >= 3
}