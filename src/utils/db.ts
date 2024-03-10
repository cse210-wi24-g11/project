// db.ts
import { getDateAbbr } from '@/components/SummaryHelper.ts'

const DB_NAME = 'user_db'

export type DbStore = 'mood' | 'moodCollection' | 'entry' | 'settings'

type MoodId = string

export type DbRecord<T extends DbStore> = {
  mood: {
    id: MoodId
    color: string
    imagePath: string
  }
  moodCollection: {
    favorites: MoodId[]
    general: MoodId[]
    archived: MoodId[]
  }
  entry: {
    id: string
    moodId: MoodId
    description: string
    timestamp: Date
  }
  settings: {
    defaultView: 'day' | 'week' | 'month'
    remindMe?: 'daily' | 'weekdays' | 'weekends' | 'none'
    reminderTimes?: '9am' | '3pm' | '6pm' | 'none'
  }
}[T]

const MOOD_COLLECTION_KEY = 'allMoods'
const SETTINGS_KEY = 'settings'

/*
 ** open the indexedDB database
 ** returns a promise that resolves to the database object
 ** or rejects with an error message
 */
export function openDb() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)

    request.onupgradeneeded = function () {
      const db = request.result
      /* create object stores (can be deemed as tables) for different data instances */
      const moodStore = db.createObjectStore('mood', { keyPath: 'id' })
      const moodCollectionStore = db.createObjectStore('moodCollection', {
        keyPath: null,
      })
      db.createObjectStore('entry', { keyPath: 'id' })
      db.createObjectStore('settings', { keyPath: null })
      const dateCollection = db.createObjectStore('dateCollection', {
        keyPath: null,
      })

      /* add default data to the mood store */
      const colors = ['blue', 'green', 'yellow', 'orange', 'red']
      for (let i = 1; i <= 5; i++) {
        moodStore.add({ id: `${i}`, color: colors[i - 1], image: new Blob() })
      }

      /* initialize mood collection with empty arrays */
      moodCollectionStore.add(
        { favorites: [], general: [], archived: [] },
        MOOD_COLLECTION_KEY,
      )

      /* add entry in date collection for tests in day summary page */
      const today = new Date()
      const todayStr = getDateAbbr(today)
      const tmp1: DbRecord<'entry'>[] = [
        {
          id: '1',
          moodId: '1',
          description: `this is a test entry for ${todayStr}. test test test test test test test test test test test `,
          timestamp: today,
        },
        {
          id: '2',
          moodId: '2',
          description: `this is a test entry for ${todayStr}.test test test test test test test test test test test test test test test test test test test test `,
          timestamp: today,
        },
      ] // TODO: change data type
      // console.log('db create date collection:', tmp1);
      dateCollection.add(tmp1, getEntryDateKey(today))

      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      console.log('yesterday:', yesterday)
      const tmp2: DbRecord<'entry'>[] = Array.from(
        { length: 10 },
        (_, index) => ({
          id: (index + 100 * yesterday.getDate()).toString(),
          moodId: '3',
          description: 'Test for ' + getEntryDateKey(yesterday),
          timestamp: yesterday,
        }),
      )
      dateCollection.add(tmp2, getEntryDateKey(yesterday))
    }

    request.onsuccess = function () {
      resolve(request.result)
    }

    request.onerror = function () {
      reject('Error opening db')
    }
  })
}

function put<T, U extends IDBValidKey | undefined>(
  store: IDBObjectStore,
  value: T,
  key?: U,
): Promise<U> {
  return toPromise(store.put(value, key))
}

function toPromise<T>(req: IDBRequest): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    req.onsuccess = () => {
      resolve(req.result as T)
    }
    req.onerror = () => {
      reject()
    }
  })
}

/**
 * add a mood entry to the database
 */
export async function putEntry(
  db: IDBDatabase,
  entry: DbRecord<'entry'>,
): Promise<void> {
  const transaction = db.transaction(['entry', 'dateCollection'], 'readwrite')
  const entryStore = transaction.objectStore('entry')
  const dateCollectionStore = transaction.objectStore('dateCollection')

  const entryDateKey = getEntryDateKey(entry.timestamp)

  // update the entries on the same date as this entry we're putting
  const entriesOnSameDate =
    (await toPromise<DbRecord<'entry'>[] | undefined>(
      dateCollectionStore.get(entryDateKey),
    )) ?? []
  entriesOnSameDate.push(entry)

  await Promise.all([
    // TODO: what key to use for this, if any? is it not necessary because keypath is the id?
    put(entryStore, entry),
    put(dateCollectionStore, entriesOnSameDate, entryDateKey),
  ])
}

export async function getFavoriteMoods(
  db: IDBDatabase,
): Promise<DbRecord<'mood'>[]> {
  const transaction = db.transaction(['mood', 'moodCollection'], 'readonly')
  const moodStore = transaction.objectStore('mood')
  const moodCollectionStore = transaction.objectStore('moodCollection')
  const moodCollection = await toPromise<DbRecord<'moodCollection'>>(
    moodCollectionStore.get(MOOD_COLLECTION_KEY),
  )
  const favoriteMoodIds = moodCollection.favorites
  console.log({ favoriteMoodIds })
  const favoriteMoods = await toPromise<DbRecord<'mood'>[]>(
    moodStore.get(favoriteMoodIds),
  )
  return favoriteMoods
}

export async function getEntriesOfDate(
  db: IDBDatabase,
  date: Date,
): Promise<DbRecord<'entry'>[] | undefined> {
  const dayKey = getEntryDateKey(date)
  const objectStore = db
    .transaction('dateCollection', 'readonly')
    .objectStore('dateCollection')
  return await toPromise<DbRecord<'entry'>[]>(objectStore.get(dayKey))
}

export async function getMoodById(
  db: IDBDatabase,
  moodId: string,
): Promise<DbRecord<'mood'> | undefined> {
  const objectStore = db.transaction('mood', 'readonly').objectStore('mood')
  return await toPromise<DbRecord<'mood'>>(objectStore.get(moodId))
}

const DEFAULT_SETTINGS: DbRecord<'settings'> = {
  // id: 'settings',
  defaultView: 'month',
  remindMe: 'none',
  reminderTimes: 'none',
}

/**
 * gets the settings, populating the database with the default settings if they do not exist
 */
export async function getSettings(
  db: IDBDatabase,
): Promise<DbRecord<'settings'>> {
  const transaction = db.transaction(['settings'], 'readwrite')
  const store = transaction.objectStore('settings')
  const request = store.get(SETTINGS_KEY)
  const settings = await toPromise<DbRecord<'settings'> | undefined>(request)
  if (!settings) {
    await put(store, DEFAULT_SETTINGS, SETTINGS_KEY)
    return DEFAULT_SETTINGS
  }
  return settings
}

export function getEntryDateKey(date: Date): string {
  return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`
}
