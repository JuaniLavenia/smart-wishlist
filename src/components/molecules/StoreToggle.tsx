import { Store } from 'lucide-react'
import { Switch } from '@/components/atoms/Toggle'

interface StoreToggleProps {
  storeId: string
  storeName: string
  enabled: boolean
  onToggle: (id: string) => void
}

export function StoreToggle({ storeId, storeName, enabled, onToggle }: StoreToggleProps) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg bg-card">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 bg-secondary rounded">
          <Store className="h-4 w-4 text-muted-foreground" />
        </div>
        <span className="font-medium text-card-foreground">{storeName}</span>
      </div>
      <Switch checked={enabled} onCheckedChange={() => onToggle(storeId)} />
    </div>
  )
}