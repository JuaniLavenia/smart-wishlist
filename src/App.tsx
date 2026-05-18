import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/pages/Layout'
import { WishlistPage } from '@/pages/WishlistPage'
import { PriceResultsPage } from '@/pages/PriceResultsPage'
import { SettingsPage } from '@/pages/SettingsPage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<WishlistPage />} />
        <Route path="/wishlist/:id" element={<PriceResultsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  )
}

export default App