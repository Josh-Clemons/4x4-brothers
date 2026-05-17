import { useState } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ReportModal from './components/ReportModal'
import { Outlet } from 'react-router-dom'
import './styles/theme.css'
import './styles/pages.css'

export default function App() {
  const [reportOpen, setReportOpen] = useState(false)

  return (
    <div className="app-shell">
      <Navbar onOpenReport={() => setReportOpen(true)} />
      <Outlet />
      <Footer onOpenReport={() => setReportOpen(true)} />
      <ReportModal open={reportOpen} onClose={() => setReportOpen(false)} />
    </div>
  )
}
