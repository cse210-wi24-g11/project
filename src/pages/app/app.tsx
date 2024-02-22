import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import { DaySummary } from '../day-summary.tsx'
import { UpdateMood } from '../update-mood.tsx'

import './app.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/DaySummary" element={<DaySummary />} />
        <Route path="/UpdateMood" element={<UpdateMood />} />
      </Routes>
    </Router>
  )
}

export default App
