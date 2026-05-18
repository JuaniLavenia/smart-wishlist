import { Inbox } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  title: string
  description?: string
  className?: string
}

export function EmptyState({ title, description, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-8 text-center', className)}>
      <div className="flex items-center justify-center w-20 h-20 bg-secondary rounded-2xl mb-6">
        <Inbox className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-3">{title}</h3>
      {description && (
        <p className="text-base text-muted-foreground max-w-md leading-relaxed">{description}</p>
      )}
    </div>
  )
}