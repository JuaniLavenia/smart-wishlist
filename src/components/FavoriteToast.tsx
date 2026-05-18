import { useEffect, useState } from 'react'
import { Heart, X } from 'lucide-react'
import { useFavoritesStore } from '@/stores/favoritesStore'

export function FavoriteToast() {
  const { lastAdded, clearLastAdded } = useFavoritesStore()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (lastAdded) {
      setVisible(true)
      const timer = setTimeout(() => {
        setVisible(false)
        clearLastAdded()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [lastAdded, clearLastAdded])

  if (!visible || !lastAdded) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-4 bg-card border border-border/60 rounded-xl shadow-xl p-4 min-w-[320px]">
        <div className="flex items-center justify-center w-11 h-11 bg-success/10 rounded-xl">
          <Heart className="h-5 w-5 text-success fill-success" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground">Agregado a favoritos</p>
          <p className="text-sm text-muted-foreground truncate">
            {lastAdded.name}
          </p>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  )
}