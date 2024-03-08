import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import { DbProvider } from './context/db.tsx'
import { SpectrumProvider } from './context/spectrum.tsx'
import { AddEntry } from './pages/add-entry.tsx'
import { DaySummary } from './pages/day-summary.tsx'
import { WeekSummary } from './pages/week-summary.tsx'
import { MonthSummary } from './pages/month-summary.tsx'
import { UpdateMood } from './pages/update-mood.tsx'
import { Settings } from './pages/setting.tsx'
import { Summary } from './pages/summary.tsx'
import { DbTest } from './pages/db-test.tsx'
import { ResetIndexedDb } from './components/reset-db/reset-db.tsx'
import {
  ADD_ENTRY_ROUTE,
  DAY_SUMMARY_ROUTE,
  MONTH_SUMMARY_ROUTE,
  SETTINGS_ROUTE,
  SUMMARY_BASE_ROUTE,
  UPDATE_MOOD_ROUTE,
  WEEK_SUMMARY_ROUTE,
} from './routes.ts'

import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <SpectrumProvider>
        <DbProvider>
          <Routes>
            <Route path={ADD_ENTRY_ROUTE} element={<AddEntry />} />
            <Route path={SETTINGS_ROUTE} element={<Settings />} />
            <Route path={SUMMARY_BASE_ROUTE} element={<Summary />} />
            <Route
              path={DAY_SUMMARY_ROUTE}
              element={<DaySummary summaryNavBarItem={'Day'} />}
            />
            <Route
              path={WEEK_SUMMARY_ROUTE}
              element={<WeekSummary summaryNavBarItem={'Week'} />}
            />
            <Route
              path={MONTH_SUMMARY_ROUTE}
              element={<MonthSummary summaryNavBarItem={'Month'} />}
            />
            <Route path={UPDATE_MOOD_ROUTE} element={<UpdateMood />} />
            <Route path="/DbTest" element={<DbTest />} />
          </Routes>
        </DbProvider>
      </SpectrumProvider>
    </Router>
    <ResetIndexedDb />
  </React.StrictMode>,
)
