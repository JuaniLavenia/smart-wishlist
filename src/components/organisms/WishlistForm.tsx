import { useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { Plus } from 'lucide-react'

interface WishlistFormProps {
  onSubmit: (name: string) => void
  initialValue?: string
  isEditing?: boolean
  onCancel?: () => void
}

export function WishlistForm({ onSubmit, initialValue = '', isEditing = false, onCancel }: WishlistFormProps) {
  // Use internal state only when not editing
  const [internalValue, setInternalValue] = useState('')
  const value = isEditing ? initialValue : internalValue

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditing) {
      setInternalValue(e.target.value)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim()) {
      onSubmit(value.trim())
      if (!isEditing) setInternalValue('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <Input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Ej: iPhone 15 Pro Max, Heladera Samsung..."
        className="flex-1"
      />
      <Button type="submit" className="px-6">
        <Plus className="h-4 w-4 mr-2" />
        {isEditing ? 'Actualizar' : 'Agregar'}
      </Button>
      {isEditing && onCancel && (
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
      )}
    </form>
  )
}