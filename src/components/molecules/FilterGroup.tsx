import { Filter } from 'lucide-react'
import { Switch } from '@/components/atoms/Toggle'
import { cn } from '@/lib/utils'

interface FilterGroupProps {
  title: string
  filters: {
    id: string
    label: string
    checked: boolean
    onChange: (checked: boolean) => void
  }[]
  className?: string
}

export function FilterGroup({ title, filters, className }: FilterGroupProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-2 text-sm font-medium">
        <Filter className="h-4 w-4" />
        {title}
      </div>
      <div className="space-y-3">
        {filters.map((filter) => (
          <div key={filter.id} className="flex items-center justify-between">
            <label
              htmlFor={filter.id}
              className="text-sm text-foreground cursor-pointer"
            >
              {filter.label}
            </label>
            <Switch
              id={filter.id}
              checked={filter.checked}
              onCheckedChange={filter.onChange}
            />
          </div>
        ))}
      </div>
    </div>
  )
}