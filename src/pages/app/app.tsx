import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import { DaySummary } from '../day-summary.tsx'
import { UpdateMood } from '../update-mood.tsx'
import { openDB } from '../../utils/db.ts'

import './app.css'

function App() {
  const [db, setDb] = useState<IDBDatabase | null>(null)
  useEffect(() => {
    openDB()
      .then((db) => {
        // create a global reference to the database
        // this will allow us to access the database from anywhere in the app
        // without having to pass the database object around
        setDb(db)
        console.log('launch: database opened successfully')
      })
      .catch((error) => {
        console.error('Failed to open database:', error)
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
