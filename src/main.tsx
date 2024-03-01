import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom'

import { DbProvider } from './context/db.tsx'
import { ThemeProvider } from './context/theme.tsx'
import { DaySummary } from './pages/day-summary.tsx'
import { UpdateMood } from './pages/update-mood.tsx'

import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <ThemeProvider>
        <DbProvider>
          <Routes>
            <Route path="/DaySummary" element={<DaySummary />} />
            <Route path="/UpdateMood" element={<UpdateMood />} />
          </Routes>
        </DbProvider>
      </ThemeProvider>
    </Router>
  </React.StrictMode>,
)
