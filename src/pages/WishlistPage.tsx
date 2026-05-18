import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ExternalLink, Trash2, Star } from 'lucide-react'
import { WishlistForm } from '@/components/organisms/WishlistForm'
import { useWishlistStore } from '@/stores/wishlistStore'
import { useFavoritesStore } from '@/stores/favoritesStore'
import { EmptyState } from '@/components/molecules/EmptyState'
import { Button } from '@/components/atoms/Button'
import type { Product } from '@/types'

export function WishlistPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useWishlistStore()
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite)
  const getByProductName = useFavoritesStore((state) => state.getByProductName)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const navigate = useNavigate()

  const handleAdd = (name: string) => {
    addProduct(name)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
  }

  const handleUpdate = (name: string) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, name)
      setEditingProduct(null)
    }
  }

  const handleDelete = (id: string) => {
    deleteProduct(id)
  }

  const handleProductClick = (product: Product) => {
    // Toggle selected
    if (selectedProduct?.id === product.id) {
      setSelectedProduct(null)
    } else {
      setSelectedProduct(product)
    }
  }

  // Get favorites for selected product using the store function
  const selectedFavorites = selectedProduct
    ? getByProductName(selectedProduct.name)
    : []

  // Get favorites count for each product
  const getFavoritesCount = (productName: string) => {
    return getByProductName(productName).length
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-foreground tracking-tight">Mi Wishlist</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Agregá productos y encontrá los mejores precios.
        </p>
      </div>

      {/* Add Product Form */}
      <div className="bg-card p-6 rounded-xl border border-border/60 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-foreground">Agregar producto</h2>
        {editingProduct ? (
          <WishlistForm
            initialValue={editingProduct.name}
            isEditing
            onSubmit={handleUpdate}
            onCancel={() => setEditingProduct(null)}
          />
        ) : (
          <WishlistForm onSubmit={handleAdd} />
        )}
      </div>

      {/* Products List */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-5 text-foreground">
          Mis productos ({products.length})
        </h2>

        {products.length === 0 ? (
          <EmptyState
            title="No hay productos"
            description="Agrega productos a tu lista de deseados para comenzar."
          />
        ) : (
          <div className="space-y-3">
            {products.map((product) => {
              const favCount = getFavoritesCount(product.name)
              const isSelected = selectedProduct?.id === product.id

              return (
                <div key={product.id} className="space-y-2">
                  {/* Product Row - Clickable */}
                  <div
                    className={`flex items-center justify-between p-4 border rounded-lg bg-card cursor-pointer transition-all hover:shadow-md ${
                      isSelected ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => handleProductClick(product)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-card-foreground truncate">
                          {product.name}
                        </h3>
                        {favCount > 0 && (
                          <span className="flex items-center gap-1 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                            <Star className="h-3 w-3" />
                            {favCount}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground" suppressHydrationWarning>
                        Creado: {new Date(product.createdAt).toLocaleDateString('es-AR')}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/wishlist/${product.id}`)
                        }}
                      >
                        <Search className="h-4 w-4 mr-1" />
                        Buscar precios
                      </Button>
                      {favCount > 0 && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleProductClick(product)
                          }}
                        >
                          Ver favoritos ({favCount})
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEdit(product)
                        }}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(product.id)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Expanded Favorites Section */}
                  {isSelected && (
                    <div className="ml-4 p-4 bg-muted/30 rounded-lg border">
                      {selectedFavorites.length > 0 ? (
                        <div>
                          <h4 className="text-sm font-medium mb-3">
                            Favoritos guardados para "{selectedProduct.name}"
                          </h4>
                          <div className="space-y-2">
                            {selectedFavorites.map((fav) => (
                              <div
                                key={fav.id}
                                className="flex items-center gap-3 p-2 bg-card rounded-lg border"
                              >
                                {fav.image && (
                                  <img
                                    src={fav.image}
                                    alt={fav.name}
                                    className="w-12 h-12 object-cover rounded"
                                  />
                                )}
                                <div className="flex-1 min-w-0">
                                  <a
                                    href={fav.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-medium text-foreground hover:text-primary flex items-center gap-1"
                                  >
                                    {fav.name}
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                  <p className="text-xs text-muted-foreground">
                                    {fav.storeName}
                                    {fav.price && ` • $${fav.price.toLocaleString('es-AR')}`}
                                  </p>
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => removeFavorite(fav.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-sm text-muted-foreground mb-3">
                            No tenés favoritos guardados para este producto
                          </p>
                          <Button
                            size="sm"
                            onClick={() => navigate(`/wishlist/${selectedProduct.id}`)}
                          >
                            <Search className="h-4 w-4 mr-1" />
                            Buscar precios
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}