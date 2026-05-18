import { PriceResultCard } from '@/components/molecules/PriceResultCard'
import { EmptyState } from '@/components/molecules/EmptyState'
import { Spinner } from '@/components/atoms/Spinner'
import type { PriceResult } from '@/types'

interface PriceResultsListProps {
  results: PriceResult[]
  isLoading?: boolean
  error?: string | null
}

export function PriceResultsList({ results, isLoading, error }: PriceResultsListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner size="lg" />
        <span className="ml-3 text-muted-foreground">Buscando precios...</span>
      </div>
    )
  }

  if (error) {
    return (
      <EmptyState
        title="Error en la búsqueda"
        description={error}
      />
    )
  }

  if (results.length === 0) {
    return (
      <EmptyState
        title="Sin resultados"
        description="No se encontraron precios para este producto."
      />
    )
  }

  // Find best price
  const minPrice = Math.min(...results.map((r) => r.price))

  return (
    <div className="space-y-3">
      {results.map((result) => (
        <PriceResultCard
          key={result.id}
          result={result}
          isBestPrice={result.price === minPrice}
        />
      ))}
    </div>
  )
}