import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom'
import { Provider, defaultTheme } from '@adobe/react-spectrum'

import { DbProvider } from './context/db.tsx'
import { DaySummary } from './pages/day-summary.tsx'
import { UpdateMood } from './pages/update-mood.tsx'

export function App() {
  const navigate = useNavigate()

  return (
    <Provider
      // force light mode. dark mode is stretch goal
      colorScheme="light"
      // we'll just use the default theme for now, can customize later
      theme={defaultTheme}
      router={{ navigate }}
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
  )
}