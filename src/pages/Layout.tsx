import { Outlet, Link, useLocation } from 'react-router-dom'
import { Settings, List, Sun, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { UsageBadge, UsageWarning } from '@/components/UsageWarning'
import { FavoriteToast } from '@/components/FavoriteToast'
import { useTheme } from '@/hooks/useTheme'

// Custom Logo - Estilizado
function Logo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="flex-shrink-0">
      <rect width="32" height="32" rx="8" fill="#1B4D3E" />
      <path
        d="M16 8.5C12.5 8.5 10 11.5 10 14.5C10 18 13 22 16 22C19 22 22 18 22 14.5C22 11.5 19.5 8.5 16 8.5Z"
        fill="white"
        fillOpacity="0.9"
      />
      <path
        d="M16 10C14.5 10 13 11.5 13 13.5C13 16 16 19 16 19C16 19 19 16 19 13.5C19 11.5 17.5 10 16 10Z"
        fill="#1B4D3E"
      />
    </svg>
  )
}

export function Layout() {
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()

  const navItems = [
    { path: '/', label: 'Mi Lista', icon: List },
    { path: '/settings', label: 'Ajustes', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <Logo />
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold tracking-tight text-foreground">
                  Smart Wishlist
                </span>
                <UsageBadge />
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                title={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
              >
                {theme === 'light' ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </button>

              <nav className="flex items-center gap-1 ml-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                      location.pathname === item.path
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <UsageWarning />
        <div className="mt-6">
          <Outlet />
        </div>
      </main>

      <FavoriteToast />
    </div>
  )
}