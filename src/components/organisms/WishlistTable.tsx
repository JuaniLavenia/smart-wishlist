import { useNavigate } from 'react-router-dom'
import { ProductCard } from '@/components/molecules/ProductCard'
import { EmptyState } from '@/components/molecules/EmptyState'
import type { Product } from '@/types'

interface WishlistTableProps {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (id: string) => void
}

export function WishlistTable({ products, onEdit, onDelete }: WishlistTableProps) {
  const navigate = useNavigate()

  if (products.length === 0) {
    return (
      <EmptyState
        title="No hay productos"
        description="Agrega productos a tu lista de deseados para comenzar a buscar precios."
      />
    )
  }

  return (
    <div className="space-y-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
          onSearch={(p) => navigate(`/wishlist/${p.id}`)}
        />
      ))}
    </div>
  )
}