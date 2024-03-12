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
    defaultView: 'lastVisited' | 'day' | 'week' | 'month'
    lastVisited?: 'day' | 'week' | 'month'
    remindMe?: 'daily' | 'weekdays' | 'weekends' | 'none'
    reminderTimes?: '9am' | '3pm' | '6pm' | 'none'
  }
}[T]

//const MOOD_COLLECTION_KEY = 'allMoods'
const SETTINGS_KEY = 'settings'
/*
 ** open the indexedDB database
 ** returns a promise that resolves to the database object
 ** or rejects with an error message
 */
export function openDb() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)

    request.onupgradeneeded = async function () {
      const db = request.result
      /* create object stores (can be deemed as tables) for different data instances */
      const moodStore = db.createObjectStore('mood', { keyPath: 'id' })
      const moodCollectionStore = db.createObjectStore('moodCollection', {
        keyPath: null,
      })
      db.createObjectStore('entry', { keyPath: 'id' })
      db.createObjectStore('settings', { keyPath: null })
      db.createObjectStore('dateCollection', { keyPath: null })
      
      async function createBlobFromPath(filePath: string): Promise<Blob | undefined> {
        try {
          // Fetch the file using the file path
          const response = await fetch(filePath);
      
          // Check if the request was successful
          if (!response.ok) {
            throw new Error(`Failed to fetch file: ${response.statusText}`);
          }
      
          // Convert the response to a Blob
          const blob = await response.blob();
          
          return blob;
        } catch (error) {
          console.error('Error converting file to Blob:', error);
        }
      }
     
      /* add default data to the mood store */
      const colors = ['#f2cc59', '#fc805e', '#df5c50', '#b499e4', '#85aedd']
      const imagePaths = ['/src/assets/default-moods/happy.PNG',
      '/src/assets/default-moods/overwhelmed.PNG',
      '/src/assets/default-moods/angry.PNG',
      '/src/assets/default-moods/meh.png','/src/assets/sad.PNG'];
      const defaultMoodIds = ['happy', 'overwhelmed','angry','meh','sad']
      let imageBlobs: Blob[] = []
      //Julia: tried this and didn't work either 
      
      try {
        // Use Promise.all to wait for all promises to resolve
        const resolvedBlobs = await Promise.all(defaultMoodIds.map(async (moodId, index) => {
          try {
            const blob = await createBlobFromPath(imagePaths[index]);
            if (blob) {
              return blob;
            } else {
              console.error('Failed to convert file to Blob.');
              return undefined;
            }
          } catch (error) {
            console.error('Error converting file to Blob:', error);
            return undefined;
          }
        }));

        // Filter out undefined values
        imageBlobs = resolvedBlobs.filter(blob => blob !== undefined) as Blob[];
      }
      catch (error){
        console.error('Error converting file to Blob:', error);
      }
     
      for (let i = 0; i < 5; i++){
      db.transaction('mood', 'readwrite')
            .objectStore('mood')
            .put({id: defaultMoodIds [i] ,color: colors[i], image:imageBlobs[i] })
      }

      db.transaction('moodCollection', 'readwrite')
            .objectStore('moodCollection')
            .put({ moods: defaultMoodIds }, 'favorite')
     db.transaction('moodCollection', 'readwrite')
            .objectStore('moodCollection')
            .put({ moods: [] }, 'general')
    db.transaction('moodCollection', 'readwrite')
            .objectStore('moodCollection')
            .put({ moods: [] }, 'archived')
 
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

export function getFavoriteMoods(
  db: IDBDatabase,
) /*: Promise<DbRecord<'mood'>[]>*/ {
  const favoritesRequest = db
    .transaction('moodCollection', 'readwrite')
    .objectStore('moodCollection')
    .get('favorite')
  favoritesRequest.onsuccess = function (event) {
    const request = event.target as IDBRequest
    let favoriteIdData: { moods: string[] }

    if (request.result) {
      // If the favorite record exists, use it
      favoriteIdData = request.result as { moods: string[] }
    } else {
      // If the favorite record doesn't exist, create a new one
      favoriteIdData = { moods: [] }
    }

    return favoriteIdData.moods
  }
  /*
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
  return favoriteMoods*/
}

const DEFAULT_SETTINGS: DbRecord<'settings'> = {
  // id: 'settings',
  defaultView: 'lastVisited',
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

export function updateSettingsInDb(
  db: IDBDatabase,
  settings: Partial<DbRecord<'settings'>>,
) {
  const transaction = db.transaction(['settings'], 'readwrite')
  const store = transaction.objectStore('settings')
  const request = store.get('settings')

  request.onsuccess = () => {
    // avoid undefined/any
    const data = (request.result || {}) as DbRecord<'settings'>
    const updatedData: DbRecord<'settings'> = { ...data, ...settings }
    store.put(updatedData, 'settings')
  }

  request.onerror = (e: Event) => {
    const error = (e.target as IDBRequest).error
    console.error('Error accessing settings:', error?.message)
  }
}

function getEntryDateKey(date: Date): string {
  return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`
}
