import { Route, Routes } from 'react-router'
import { Layout } from './components/Layout'
import { AboutPage } from './pages/AboutPage'
import { AnimalDetailPage } from './pages/AnimalDetailPage'
import { CatalogPage } from './pages/CatalogPage'
import { EcoregionsPage } from './pages/EcoregionsPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="especies" element={<CatalogPage />} />
        <Route path="especies/:id" element={<AnimalDetailPage />} />
        <Route path="ecorregiones" element={<EcoregionsPage />} />
        <Route path="acerca" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
