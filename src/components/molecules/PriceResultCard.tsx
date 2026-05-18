import { useEffect, useState } from 'react'
import { ExternalLink, Truck, CreditCard, Star, Heart } from 'lucide-react'
import { Badge } from '@/components/atoms/Badge'
import { PriceTag } from '@/components/atoms/PriceTag'
import { useFavoritesStore, type FavoriteItem } from '@/stores/favoritesStore'
import type { PriceResult } from '@/types'

interface PriceResultCardProps {
  result: PriceResult
  isBestPrice?: boolean
}

export function PriceResultCard({ result, isBestPrice }: PriceResultCardProps) {
  const [isFav, setIsFav] = useState(false)

  // Format installment display
  const hasInstallments = result.installments && result.installments > 1

  const addFavorite = useFavoritesStore((state) => state.addFavorite)
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite)
  const isFavorite = useFavoritesStore((state) => state.isFavorite)

  // Check favorite status on mount and when URL changes
  useEffect(() => {
    setIsFav(isFavorite(result.url))
  }, [result.url, isFavorite])

  const handleToggleFavorite = () => {
    const favoriteItem: FavoriteItem = {
      id: result.url,
      productName: result.productName,
      name: result.title,
      url: result.url,
      image: result.image || '',
      price: result.price,
      storeName: result.store,
      rating: result.rating,
      installments: result.installments,
    }

    if (isFav) {
      removeFavorite(result.url)
    } else {
      addFavorite(favoriteItem)
    }
    setIsFav(!isFav)
  }

  return (
    <div
      className={`p-4 border rounded-lg bg-card transition-all ${
        isBestPrice ? 'border-primary ring-2 ring-primary/20' : ''
      }`}
    >
      <div className="flex gap-4">
        {/* Product Image */}
        {result.productImage && (
          <div className="flex-shrink-0">
            <img
              src={result.productImage}
              alt={result.productName}
              className="w-20 h-20 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          {/* Product Name */}
          <h3 className="font-medium text-card-foreground text-sm line-clamp-2 mb-2">
            {result.productName}
          </h3>

          {/* Store Info */}
          <div className="flex items-center gap-2 mb-2">
            {result.storeIcon && (
              <img
                src={result.storeIcon}
                alt={result.storeName}
                className="w-4 h-4 rounded"
              />
            )}
            <span className="font-medium text-sm text-card-foreground">
              {result.storeName}
            </span>
            {isBestPrice && (
              <Badge variant="success">Mejor precio</Badge>
            )}
            <button
              onClick={handleToggleFavorite}
              className="ml-auto p-1 hover:bg-muted rounded transition-colors"
              title={isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            >
              <Heart
                className={`h-4 w-4 transition-colors ${
                  isFav ? 'fill-red-500 text-red-500' : 'text-muted-foreground hover:text-red-500'
                }`}
              />
            </button>
          </div>

          {/* Rating */}
          {result.rating && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-3 w-3 ${
                      star <= result.rating!
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              {result.reviews && (
                <span className="text-xs text-muted-foreground">
                  ({result.reviews})
                </span>
              )}
            </div>
          )}

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-2">
            {result.freeShipping && (
              <Badge variant="secondary">
                <Truck className="h-3 w-3 mr-1" />
                Envío gratis
              </Badge>
            )}
            {result.interestFree && (
              <Badge variant="secondary">
                <CreditCard className="h-3 w-3 mr-1" />
                Cuotas sin interés
              </Badge>
            )}
            {!result.inStock && (
              <Badge variant="destructive">Sin stock</Badge>
            )}
          </div>

          {/* Installment Info */}
          {hasInstallments && (
            <p className="text-sm text-muted-foreground">
              {result.installments} cuotas de{' '}
              {new Intl.NumberFormat('es-AR', {
                style: 'currency',
                currency: 'ARS',
                minimumFractionDigits: 0,
              }).format(result.installmentPrice || result.price / result.installments)}
            </p>
          )}
        </div>

        {/* Price & CTA */}
        <div className="flex-shrink-0 text-right">
          <PriceTag
            price={result.price}
            originalPrice={result.originalPrice}
            size="md"
          />
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 h-8 px-3 text-xs font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 mt-2"
          >
            Ver <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  )
}