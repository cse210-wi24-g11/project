import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { defaultTheme, Provider } from '@adobe/react-spectrum'

import { DbProvider } from './context/db.tsx'
import { DaySummary } from './pages/day-summary.tsx'
import { UpdateMood } from './pages/update-mood.tsx'

import './index.css'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider
      // force light mode. dark mode is stretch goal
      colorScheme="light"
      // we'll just use the default theme for now, can customize later
      theme={defaultTheme}
    >
      <DbProvider>
        <Router>
          <Routes>
            <Route path="/DaySummary" element={<DaySummary />} />
            <Route path="/UpdateMood" element={<UpdateMood />} />
          </Routes>
        </Router>
      </DbProvider>
    </Provider>
  </React.StrictMode>,
)
