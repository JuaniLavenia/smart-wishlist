import { Link } from 'react-router-dom'
import { AlertTriangle, AlertCircle, Settings } from 'lucide-react'
import { useUsageStore } from '@/stores/usageStore'
import { cn } from '@/lib/utils'

const MONTHLY_LIMIT = 250
const WARNING_THRESHOLD = 200

export function UsageWarning() {
  const { getUsage, isAtLimit, isAtWarning } = useUsageStore()
  const { count, percentage, remaining } = getUsage()

  // Don't show anything if under warning threshold
  if (count < WARNING_THRESHOLD) {
    return null
  }

  // At limit (100%+) - show red error
  if (isAtLimit()) {
    return (
      <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
        <AlertCircle className="h-5 w-5 flex-shrink-0" />
        <div className="text-sm">
          <span className="font-medium">Límite alcanzado</span>
          <span className="ml-2">({count}/{MONTHLY_LIMIT} búsquedas)</span>
          <p className="text-xs mt-1 opacity-80">
            Has usado todas tus búsquedas gratuitas del mes. Los resultados mostrarán datos mock.
          </p>
          <Link to="/settings" className="text-xs mt-2 inline-flex items-center gap-1 hover:underline">
            <Settings className="h-3 w-3" /> Ajustar contador
          </Link>
        </div>
      </div>
    )
  }

  // At warning (80%+) - show yellow warning
  if (isAtWarning()) {
    return (
      <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700">
        <AlertTriangle className="h-5 w-5 flex-shrink-0" />
        <div className="text-sm">
          <span className="font-medium">Casi al límite</span>
          <span className="ml-2">({count}/{MONTHLY_LIMIT} - {percentage}%)</span>
          <p className="text-xs mt-1 opacity-80">
            Te quedan {remaining} búsquedas gratuitas este mes.
          </p>
          <Link to="/settings" className="text-xs mt-2 inline-flex items-center gap-1 hover:underline">
            <Settings className="h-3 w-3" /> Ajustar contador
          </Link>
        </div>
      </div>
    )
  }

  return null
}

// Compact version for header
export function UsageBadge() {
  const { getUsage, isAtWarning, isAtLimit } = useUsageStore()
  const { count } = getUsage()

  if (count === 0) return null

  const isWarning = isAtWarning()
  const isError = isAtLimit()

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-1 rounded text-xs font-medium',
        isError && 'bg-red-100 text-red-700',
        isWarning && !isError && 'bg-amber-100 text-amber-700',
        !isWarning && !isError && 'bg-gray-100 text-gray-600'
      )}
    >
      {count}/{MONTHLY_LIMIT}
    </span>
  )
}