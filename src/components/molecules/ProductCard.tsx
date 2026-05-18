import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  onEdit: (product: Product) => void
  onDelete: (id: string) => void
  onSearch: (product: Product) => void
}

export function ProductCard({ product, onEdit, onDelete, onSearch }: ProductCardProps) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-card hover:shadow-md transition-shadow">
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-card-foreground truncate">{product.name}</h3>
        <p className="text-sm text-muted-foreground" suppressHydrationWarning>
          Creado: {new Date(product.createdAt).toLocaleDateString('es-AR')}
        </p>
      </div>
      <div className="flex items-center gap-2 ml-4">
        <Button size="sm" variant="secondary" onClick={() => onSearch(product)}>
          Buscar precios
        </Button>
        <Button size="sm" variant="outline" onClick={() => onEdit(product)}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="destructive" onClick={() => onDelete(product.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}