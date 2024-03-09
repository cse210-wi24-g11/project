import Dexie, { Table } from 'dexie'
import { useLiveQuery } from 'dexie-react-hooks'

import { DB_NAME, SETTINGS_KEY } from './constants.ts'
import { DEFAULT_SETTINGS } from './defaults.ts'

import type { Mood, Entry, MoodCollectionItem, Settings } from './types.ts'

class DexieDb extends Dexie {
  moods!: Table<Mood, Mood['id']>
  entries!: Table<Entry, Entry['id']>
  moodCollection!: Table<MoodCollectionItem, MoodCollectionItem['moodId']>
  settings!: Table<Settings, typeof SETTINGS_KEY>

  constructor() {
    super(DB_NAME)
    this.version(1).stores({
      moods: 'id', // primary key and indexed props
      entries: 'id, moodId, date',
      moodCollection: 'moodId, category',
      settings: '',
    })

    // set initial data
    this.on('populate', async (tx) => {
      console.log('populating')
      await tx.table('settings').add(DEFAULT_SETTINGS, SETTINGS_KEY)

      // TODO: update/fix default moods & favorites
      const MOCK_FAVORITES: Mood[] = [
        {
          id: globalThis.crypto.randomUUID(),
          color: '#ff0000',
          imagePath: '/vite.svg',
        },
      ]
      await tx.table('moods').bulkAdd(MOCK_FAVORITES)
      await tx
        .table('moodCollection')
        .bulkAdd(
          MOCK_FAVORITES.map(({ id }) => ({
            moodId: id,
            category: 'favorites',
          })),
        )
    })
  }
}

export const db = new DexieDb()

type UseQueryResult<T, I> =
  | [data: I, isLoading: true]
  | [data: T, isLoading: false]

/**
 * provides observable data from the indexeddb database
 * that automatically updates and triggers a re-render when the observed data changes.
 *
 * takes in 3 parameters: an asynchronous callback querying the database; stateful dependencies; and the initial value, before the callback resolves.
 *
 * returns a 2-tuple of the data and whether the data is still loading.
 *
 * @warning
 * the callback function should only use asynchronous operations from dexie apis:
 * see https://dexie.org/docs/dexie-react-hooks/useLiveQuery()#rules-for-the-querier-function
 *
 * @example
 * ```ts
 * function MyComponent({ date }) {
 *   const [todayEntries, isLoadingTodayEntries] = useQuery(
 *     async (db) => db.entries.where('date').equals(dateToKey(date)).toArray(),
 *     [date],
 *     [] as Entry[], // we have to assert the type here because `[]` gets inferred as `never[]`
 *   )
 * }
 * ```
 */
export function useQuery<T, I = undefined>(
  querier: (db: DexieDb) => Promise<T>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deps: any[],
  initial?: I,
): UseQueryResult<T, I> {
  return useLiveQuery(() => querier(db).then((x) => [x, false]), deps, [
    initial as I,
    true,
  ])
}
