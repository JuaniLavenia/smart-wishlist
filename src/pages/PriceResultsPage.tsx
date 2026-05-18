import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpDown, Database, Globe } from 'lucide-react'
import { PriceResultsList } from '@/components/organisms/PriceResultsList'
import { FilterPanel } from '@/components/organisms/FilterPanel'
import { useWishlistStore } from '@/stores/wishlistStore'
import { useFiltersStore } from '@/stores/filtersStore'
import { usePriceSearch } from '@/hooks/usePriceSearch'
import { useFilteredResults } from '@/hooks/useFilteredResults'
import { Button } from '@/components/atoms/Button'
import { Badge } from '@/components/atoms/Badge'

export function PriceResultsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const product = useWishlistStore((state) => state.getProduct(id!))

  const {
    filters,
    sortOption,
    setFreeShipping,
    setInterestFree,
    resetFilters,
    setSortOption,
  } = useFiltersStore()

  const { data, isLoading, error } = usePriceSearch(product?.name || '', !!product)
  const filteredResults = useFilteredResults(data?.results || [], filters, sortOption)

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
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">{product.name}</h1>
          <p className="text-muted-foreground mt-1">
            Comparando precios en diferentes tiendas
          </p>
        </div>
      </div>

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