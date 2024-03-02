import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

import { openDb } from '../utils/db.ts'

type Undefinable<T> = T | undefined

type Db = globalThis.IDBDatabase | null

const IndexeddbContext = createContext<Undefinable<Db>>(undefined)

// disable linting here for react fast refresh - we won't really be changing the provider anyway,
// so no fast refresh here really shouldn't be an issue.
// and we want to keep them in the same file so that `IndexeddbContext` can only be accessed via our exported functions here
// eslint-disable-next-line react-refresh/only-export-components
export function useDb() {
  const data = useContext(IndexeddbContext)
  if (data === undefined) {
    throw new Error('useDb must be used in a DbProvider')
  }
  return data
}

// eslint-disable-next-line @typescript-eslint/ban-types
type DbProviderProps = PropsWithChildren<{}>

export function DbProvider({ children }: DbProviderProps) {
  const [db, setDb] = useState<Db>(null)

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
        console.error('Failed to open database:', error)
      })
  }, [])

  return (
    <IndexeddbContext.Provider value={db}>{children}</IndexeddbContext.Provider>
  )
}
