import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import { DbProvider } from './context/db.tsx'
import { ThemeProvider } from './context/theme.tsx'
import { DaySummary } from './pages/day-summary.tsx'
import { WeekSummary } from './pages/week-summary.tsx'
import { MonthSummary } from './pages/month-summary.tsx'
import { UpdateMood } from './pages/update-mood.tsx'
import { Settings } from './pages/setting.tsx'
import { CustomMood } from './pages/custom-mood.tsx'
import { DbTest } from './pages/db-test.tsx'
import { ResetIndexedDb } from './components/reset-db/reset-db.tsx'

import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <ThemeProvider>
        <DbProvider>
          <Routes>
            <Route
              path="/DaySummary"
              element={<DaySummary summaryNavBarItem={'Day'} />}
            />
            <Route path="/UpdateMood" element={<UpdateMood />} />
            <Route
              path="/WeekSummary"
              element={<WeekSummary summaryNavBarItem={'Week'} />}
            />
            <Route
              path="/MonthSummary"
              element={<MonthSummary summaryNavBarItem={'Month'} />}
            />
            <Route path="/CustomMood" element={<CustomMood />} />
            <Route path="/Settings" element={<Settings />} />
            <Route path="/DbTest" element={<DbTest />} />
          </Routes>
        </DbProvider>
      </ThemeProvider>
    </Router>
    <ResetIndexedDb />
  </React.StrictMode>,
)
