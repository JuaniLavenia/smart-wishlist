import { FilterGroup } from '@/components/molecules/FilterGroup'
import { Button } from '@/components/atoms/Button'
import { X } from 'lucide-react'
import type { PriceFilters } from '@/types'

interface FilterPanelProps {
  filters: PriceFilters
  onFreeShippingChange: (value: boolean) => void
  onInterestFreeChange: (value: boolean) => void
  onReset: () => void
}

export function FilterPanel({
  filters,
  onFreeShippingChange,
  onInterestFreeChange,
  onReset,
}: FilterPanelProps) {
  const hasFilters = filters.freeShipping || filters.interestFree

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Filtros</h3>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={onReset} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4 mr-1" />
            Limpiar
          </Button>
        )}
      </div>

      <FilterGroup
        title="Condiciones"
        filters={[
          {
            id: 'freeShipping',
            label: 'Envío gratis',
            checked: filters.freeShipping,
            onChange: onFreeShippingChange,
          },
          {
            id: 'interestFree',
            label: 'Cuotas sin interés',
            checked: filters.interestFree,
            onChange: onInterestFreeChange,
          },
        ]}
      />
    </div>
  )
}