// db.ts
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
      db.createObjectStore('dateCollection', { keyPath: null })

      /* add default data to the mood store */
      const colors = ['blue', 'green', 'yellow', 'orange', 'red']
      const defaultMoodIDs = ['1', '2', '3', '4', '5']
      for (let i = 1; i <= 5; i++) {
        moodStore.add({ id: i, color: colors[i - 1], image: new Blob() })
      }
      moodCollectionStore.add({ moods: defaultMoodIDs }, 'favorite')
      moodCollectionStore.add({ moods: [] }, 'general')
      moodCollectionStore.add({ moods: [] }, 'archived')
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

function getEntryDateKey(date: Date): string {
  return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`
}
