import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const MONTHLY_LIMIT = 250
const WARNING_THRESHOLD = 200 // 80%

interface UsageState {
  count: number
  month: string // "YYYY-MM" format

  // Actions
  increment: () => void
  setCount: (count: number) => void // Manual override from SerpApi dashboard
  getUsage: () => { count: number; month: string; remaining: number; percentage: number }
  isAtLimit: () => boolean
  isAtWarning: () => boolean
  resetIfNewMonth: () => void
}

function getCurrentMonth(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export const useUsageStore = create<UsageState>()(
  persist(
    (set, get) => ({
      count: 0,
      month: getCurrentMonth(),

      increment: () => {
        const state = get()
        // Reset if new month
        state.resetIfNewMonth()

        set((state) => ({
          count: state.count + 1,
          month: getCurrentMonth(),
        }))
      },

      setCount: (count: number) => {
        set({ count, month: getCurrentMonth() })
      },

      getUsage: () => {
        const state = get()
        state.resetIfNewMonth() // Ensure we're up to date

        const currentMonth = getCurrentMonth()
        const currentState = state.month === currentMonth ? state : { count: 0, month: currentMonth }

        return {
          count: currentState.count,
          month: currentState.month,
          remaining: Math.max(0, MONTHLY_LIMIT - currentState.count),
          percentage: Math.round((currentState.count / MONTHLY_LIMIT) * 100),
        }
      },

      isAtLimit: () => {
        const { count } = get()
        return count >= MONTHLY_LIMIT
      },

      isAtWarning: () => {
        const { count } = get()
        return count >= WARNING_THRESHOLD && count < MONTHLY_LIMIT
      },

      resetIfNewMonth: () => {
        const { month, count } = get()
        const currentMonth = getCurrentMonth()

        if (month !== currentMonth && count > 0) {
          // New month - reset count but keep month updated
          set({ count: 0, month: currentMonth })
        }
      },
    }),
    {
      name: 'serpapi-usage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)