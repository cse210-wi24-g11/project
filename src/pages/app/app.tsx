import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import { MainNavBar } from '@/components/navigation/mainNavBar.tsx'

import DaySummary from '../DaySummary.tsx'
import UpdateMood from '../UpdateMood.tsx'

import './app.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/DaySummary" element={<DaySummary />} />
        <Route path="/UpdateMood" element={<UpdateMood />} />
      </Routes>
      <MainNavBar />
    </Router>
  )
}

export default App
