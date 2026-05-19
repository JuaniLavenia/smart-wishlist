import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpDown, Database, Globe, RefreshCw } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { PriceResultsList } from '@/components/organisms/PriceResultsList'
import { FilterPanel } from '@/components/organisms/FilterPanel'
import { useWishlistStore } from '@/stores/wishlistStore'
import { useFiltersStore } from '@/stores/filtersStore'
import { usePriceSearch } from '@/hooks/usePriceSearch'
import { useFilteredResults } from '@/hooks/useFilteredResults'
import { Button } from '@/components/atoms/Button'
import { Badge } from '@/components/atoms/Badge'

const REFRESH_COOLDOWN_SECONDS = 30

export function PriceResultsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const product = useWishlistStore((state) => state.getProduct(id!))

  const {
    filters,
    sortOption,
    setFreeShipping,
    setInterestFree,
    resetFilters,
    setSortOption,
  } = useFiltersStore()

  const { data, isLoading, error, refetch, isFetching } = usePriceSearch(product?.name || '', !!product)
  const filteredResults = useFilteredResults(data?.results || [], filters, sortOption)

  // Refresh button cooldown
  const [cooldown, setCooldown] = useState(0)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  const handleRefreshClick = () => {
    setShowConfirm(true)
  }

  const handleRefreshConfirm = useCallback(async () => {
    if (cooldown > 0) return

    // Invalidate query cache and refetch
    await queryClient.invalidateQueries({ queryKey: ['priceSearch', product?.name] })
    await refetch()
    setShowConfirm(false)
    setCooldown(REFRESH_COOLDOWN_SECONDS)
  }, [cooldown, queryClient, product?.name, refetch])

  if (!product) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">Producto no encontrado</p>
        <Link to="/">
          <Button variant="outline">Volver a mi wishlist</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="hover:bg-secondary">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">{product.name}</h1>
          <p className="text-muted-foreground mt-1">
            Comparando precios en diferentes tiendas
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefreshClick}
          disabled={cooldown > 0 || isFetching}
          className="gap-1.5"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          {cooldown > 0 ? `${cooldown}s` : 'Refrescar'}
        </Button>
      </div>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="bg-card border border-border/60 rounded-xl p-4 shadow-lg">
          <p className="text-sm mb-3">
            ¿Refrescar resultados? Esto hará una nueva llamada a la API.
          </p>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleRefreshConfirm}>
              Confirmar
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowConfirm(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 space-y-6">
          <div className="bg-card rounded-xl border border-border/60 shadow-sm p-5">
            <FilterPanel
              filters={filters}
              onFreeShippingChange={setFreeShipping}
              onInterestFreeChange={setInterestFree}
              onReset={resetFilters}
            />
          </div>

          <div className="p-5 border border-border/60 rounded-xl bg-card shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-foreground">Ordenar por</span>
            </div>
            <div className="space-y-2">
              {[
                { value: 'price-asc', label: 'Menor precio' },
                { value: 'price-desc', label: 'Mayor precio' },
                { value: 'relevance', label: 'Relevancia' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSortOption(option.value as typeof sortOption)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    sortOption === option.value
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">
              Resultados ({filteredResults.length})
            </h2>
            {data?.source && (
              <Badge variant={data.source === 'api' ? 'default' : 'secondary'}>
                {data.source === 'api' ? (
                  <>
                    <Globe className="h-3 w-3 mr-1" />
                    API Real
                  </>
                ) : (
                  <>
                    <Database className="h-3 w-3 mr-1" />
                    Demo
                  </>
                )}
              </Badge>
            )}
          </div>

          <PriceResultsList
            results={filteredResults}
            isLoading={isLoading}
            error={error?.message}
          />
        </div>
      </div>
    </div>
  )
}