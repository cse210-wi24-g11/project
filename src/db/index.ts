import Dexie, { Table } from 'dexie'
import { useLiveQuery } from 'dexie-react-hooks'

import { DB_NAME, FIRST_RUN_KEY, SETTINGS_KEY } from './constants.ts'
import {
  DEFAULT_ARCHIVED_MOODS,
  DEFAULT_FAVORITE_MOODS,
  DEFAULT_GENERAL_MOODS,
  DEFAULT_MOOD_COLLECTION,
  DEFAULT_SETTINGS,
  DefaultMoodTemplate,
} from './defaults.ts'
import { urlToBase64 } from './utils.ts'

import type {
  Mood,
  Entry,
  Settings,
  MoodCollectionCategory,
  MoodId,
} from './types.ts'

class DexieDb extends Dexie {
  moods!: Table<Mood, Mood['id']>
  entries!: Table<Entry, Entry['id']>
  moodCollection!: Table<MoodId[], MoodCollectionCategory>
  settings!: Table<Settings, typeof SETTINGS_KEY>
  FIRST_RUN!: Table<boolean, typeof FIRST_RUN_KEY>

  constructor() {
    super(DB_NAME)
    this.version(1).stores({
      moods: 'id', // primary key and indexed props
      entries: 'id, moodId, date',
      moodCollection: '',
      settings: '',
      FIRST_RUN: '',
    })

    this.on('populate', async (tx) => {
      await tx.table('FIRST_RUN').add(true, FIRST_RUN_KEY)
    })

    // set initial data
    // note: we have to use onready, not onpopulate, because we're using other async apis.
    //  see https://dexie.org/docs/Dexie/Dexie.on.populate#limitations
    // @ts-expect-error dunno why but it doesn't like the 'ready' event type
    this.on('ready', async (db: DexieDb) => {
      const isFirstRun = await db.FIRST_RUN.get(FIRST_RUN_KEY)
      if (!isFirstRun) {
        console.log('not first run')
        return
      }

      console.log('populating')

      await db.settings.add(DEFAULT_SETTINGS, SETTINGS_KEY)

      // TODO: update/fix default moods & favorites
      async function resolveDefaultMoods(moods: DefaultMoodTemplate[]) {
        return Promise.all(
          moods.map(async ({ image, ...rest }) => ({
            ...rest,
            image: await urlToBase64(image),
          })),
        )
      }

      const FAVORITE_MOODS = await resolveDefaultMoods(DEFAULT_FAVORITE_MOODS)
      await db.moods.bulkAdd(FAVORITE_MOODS)
      await db.moodCollection.add(
        DEFAULT_MOOD_COLLECTION['favorites'],
        'favorites',
      )

      const GENERAL_MOODS = await resolveDefaultMoods(DEFAULT_GENERAL_MOODS)
      await db.moods.bulkAdd(GENERAL_MOODS)
      await db.moodCollection.add(DEFAULT_MOOD_COLLECTION['general'], 'general')

      const ARCHIVED_MOODS = await resolveDefaultMoods(DEFAULT_ARCHIVED_MOODS)
      await db.moods.bulkAdd(ARCHIVED_MOODS)
      await db.moodCollection.add(
        DEFAULT_MOOD_COLLECTION['archived'],
        'archived',
      )

      // on('ready') event will fire when database is open but
      // before any other queued operations start executing.
      // By returning a Promise from this event,
      // the framework will wait until promise completes before
      // resuming any queued database operations.
      return db.FIRST_RUN.put(false, FIRST_RUN_KEY)
    })
  }
}

export const db = new DexieDb()

type UseQueryResult<T, I> =
  | [data: I, isLoading: true]
  | [data: T, isLoading: false]

export type Querier<T> = (db: DexieDb) => Promise<T>

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
  querier: Querier<T>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deps: any[],
  initial?: I,
): UseQueryResult<T, I> {
  return useLiveQuery(() => querier(db).then((x) => [x, false]), deps, [
    initial as I,
    true,
  ])
}
