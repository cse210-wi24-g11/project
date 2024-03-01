import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import { DaySummary } from './pages/day-summary.tsx'
import { UpdateMood } from './pages/update-mood.tsx'
import { openDb } from './utils/db.ts'

export function App() {
  const [db, setDb] = useState<IDBDatabase | null>(null)

  useEffect(() => {
    openDb()
      .then((db) => {
        // create a global reference to the database
        // this will allow us to access the database from anywhere in the app
        // without having to pass the database object around
        setDb(db)
        console.log('launch: database opened successfully')
      })
      .catch((error) => {
        console.error('error: failed to open database:', error)
      })
  }, [])
  
  return (
    <Router>
      <Routes>
        <Route path="/DaySummary" element={<DaySummary db={db} />} />
        <Route path="/UpdateMood" element={<UpdateMood />} />
      </Routes>
    </Router>
  )
}

export default App
