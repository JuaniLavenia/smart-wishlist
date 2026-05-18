import { StoreToggle } from '@/components/molecules/StoreToggle'
import type { Store } from '@/types'

interface StoreWhitelistProps {
  stores: Store[]
  onToggle: (id: string) => void
}

export function StoreWhitelist({ stores, onToggle }: StoreWhitelistProps) {
  return (
    <div className="space-y-2">
      {stores.map((store) => (
        <StoreToggle
          key={store.id}
          storeId={store.id}
          storeName={store.name}
          enabled={store.enabled}
          onToggle={onToggle}
        />
      ))}
    </div>
  )
}