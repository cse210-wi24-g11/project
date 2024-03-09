import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import { ResetIndexedDb } from './components/reset-db/reset-db.tsx'
import { SpectrumProvider } from './context/spectrum.tsx'
import { AddEntry } from './pages/add-entry.tsx'
import { EditEntry } from './pages/edit-entry.tsx'
import { Settings } from './pages/setting.tsx'
import { Summary } from './pages/summary.tsx'
import { DaySummary } from './pages/day-summary.tsx'
import { WeekSummary } from './pages/week-summary.tsx'
import { EditMood } from './pages/edit-mood.tsx'
import { CustomMood } from './pages/custom-mood.tsx'
import { DbTest } from './pages/db-test.tsx'
import { MoodCollection } from './pages/mood-collection.tsx'
import {
  ADD_ENTRY_ROUTE,
  DAY_SUMMARY_ROUTE,
  EDIT_ENTRY_ROUTE,
  SETTINGS_ROUTE,
  SUMMARY_BASE_ROUTE,
  EDIT_MOOD_ROUTE,
  WEEK_SUMMARY_ROUTE,
  CUSTOM_MOOD_ROUTE,
  MOOD_COLLECTION_ROUTE,
} from './routes.ts'

import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <SpectrumProvider>
        <Routes>
          <Route path={ADD_ENTRY_ROUTE} element={<AddEntry />} />
          <Route
            path={EDIT_ENTRY_ROUTE(':entryId')}
            element={<EditEntry />}
          />
          <Route path={SETTINGS_ROUTE} element={<Settings />} />
          <Route path={SUMMARY_BASE_ROUTE} element={<Summary />} />
          <Route path={MOOD_COLLECTION_ROUTE} element={<MoodCollection />} />
          <Route path={DAY_SUMMARY_ROUTE} element={<DaySummary />} />
          <Route path={WEEK_SUMMARY_ROUTE} element={<WeekSummary />} />
          <Route path={`${EDIT_MOOD_ROUTE}/:moodId`} element={<EditMood />} />
          <Route path={CUSTOM_MOOD_ROUTE} element={<CustomMood />} />
          <Route path="/DbTest" element={<DbTest />} />
        </Routes>
      </SpectrumProvider>
    </Router>
    <ResetIndexedDb />
  </React.StrictMode>,
)
