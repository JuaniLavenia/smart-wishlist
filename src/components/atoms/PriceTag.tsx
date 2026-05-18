import { cn } from '@/lib/utils'

interface PriceTagProps {
  price: number
  originalPrice?: number
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-lg',
  lg: 'text-2xl',
}

export function PriceTag({ price, originalPrice, className, size = 'md' }: PriceTagProps) {
  const formattedPrice = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(price)

  const formattedOriginal = originalPrice
    ? new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0,
      }).format(originalPrice)
    : null

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className={cn('font-bold text-primary', sizeClasses[size])}>
        {formattedPrice}
      </span>
      {formattedOriginal && (
        <span className="text-sm text-muted-foreground line-through">
          {formattedOriginal}
        </span>
      )}
    </div>
  )
}