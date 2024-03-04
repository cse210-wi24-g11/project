import { useEffect, useState } from "react"

const DB_NAME = 'user_db'

/**
 * Button that, when clicked, resets the indexeddb database.
 * this button is only visible when holding down the `Alt` key
 */
export function ResetIndexedDb() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (import.meta.env.DEV) {
      const down = (e: KeyboardEvent) => {
        if (e.key === 'Alt') {
          setVisible(true)
        }
      }
      const up = (e: KeyboardEvent) => {
        if (e.key === 'Alt') {
          setVisible(false)
        }
      }

      window.addEventListener('keydown', down)
      window.addEventListener('keyup', up)

      return () => {
        window.removeEventListener('keydown', down)
        window.removeEventListener('keyup', up)
      }
    }
  }, [])

  if (!import.meta.env.DEV) { return null }

  function onClick() {
    indexedDB.deleteDatabase(DB_NAME)
  }

  return (
    <button onClick={onClick} className={`fixed top-4 right-4 z-50 ${!visible && 'hidden'}`}>
      reset db
    </button>
  )
}