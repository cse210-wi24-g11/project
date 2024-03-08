import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import { openDb } from '../utils/db.ts'

type Undefinable<T> = T | undefined

type Db = IDBDatabase | null

type DbCtx = {
  getDb: () => Promise<IDBDatabase>
  ready: boolean
}

const IndexeddbContext = createContext<Undefinable<DbCtx>>(undefined)

/**
 * returns an object with three values, `getDb`, `ready`, and `db`.
 * - `getDb` is a Promise that resolves to the database.
 * - `ready` is a boolean indicating whether the database is open and ready for use.
 * - `db` is the actual database, or `null` if it isn't opened yet
 *
 * generally the idea here is to await `getDb()`.
 *
 * `ready` can be used if you want to conditionally do something based on whether or not the db is open.
 *
 * `db` should generally be avoided, as `getDb` is better to ensure the database is actually available (and if it isn't, just use `ready`),
 * but is here for legacy reasons for now.
 * it will be removed later.
 *
 * @example
 * ```tsx
 * const { getDb, ready } = useDb()
 *
 * /// getting the db to do stuff
 * useEffect(() => {
 *   // wrap logic in `async` so we can use async/await syntax
 *   async function effect() {
 *     const db = await getDb()
 *     do_stuff_with(db)
 *   }
 *
 *   // we need the `void` here to make eslint happy
 *   void effect()
 * }, [getDb])
 *
 * /// conditionally doing things based on whether db is ready
 * <button disabled={!ready} />
 * ```
 */
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

  const [ready, setReady] = useState(false)

  const getDb = useCallback(async () => {
    if (db === null) {
      const db = await openDb()
      setDb(db)
      return db
    }
    return db
  }, [db])

  useEffect(() => {
    openDb()
      .then((db) => {
        // create a global reference to the database
        // this will allow us to access the database from anywhere in the app
        // without having to pass the database object around
        setDb(db)
        setReady(true)
        console.log('launch: database opened successfully')
      })
      .catch((error) => {
        console.error('Failed to open database:', error)
      })
  }, [])

  return (
    <IndexeddbContext.Provider value={{ getDb, ready }}>
      {children}
    </IndexeddbContext.Provider>
  )
}
