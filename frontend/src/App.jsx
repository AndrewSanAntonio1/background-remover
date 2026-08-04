import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import NotFoundPage from './pages/NotFoundPage'
import RemoveBackgroundPage from './pages/RemoveBackgroundPage'
import './App.css'

/**
 * Restores scroll position on navigation, but defers to hash links so
 * "/#features" still lands on the right section.
 */
function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const target = document.querySelector(hash)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])

  return null
}

export default function App() {
  return (
    <div className="app">
      <ScrollManager />
      <Navbar />

      <main id="main" className="app__main">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/remove-background" element={<RemoveBackgroundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}
