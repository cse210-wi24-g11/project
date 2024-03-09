// import { useEffect } from 'react'

// import { useDb } from '@/context/db.tsx'
import { useQuery } from '@/db/index.ts'
import { SETTINGS_KEY } from '@/db/constants.ts'

import type { Mood, MoodCollectionItem } from '@/db/types.ts'

export function DbTest() {
  const [settings] = useQuery((db) => db.settings.get(SETTINGS_KEY), [])
  const [moods] = useQuery((db) => db.moods.toArray(), [], [] as Mood[])
  const [moodCollection] = useQuery(
    (db) => db.moodCollection.toArray(),
    [],
    [] as MoodCollectionItem[],
  )

  return (
    <div className="flex flex-col place-content-center p-8">
      <div className="text-black">DB Test Page</div>
      <div className="text-left">
        <h2>settings</h2>
        <pre>{JSON.stringify(settings, null, 2) ?? 'undefined'}</pre>
        <hr />
        <h2>moods</h2>
        <pre>{JSON.stringify(moods, null, 2) ?? 'undefined'}</pre>
        <hr />
        <h2>collection</h2>
        <pre>{JSON.stringify(moodCollection, null, 2) ?? 'undefined'}</pre>
      </div>
    </div>
  )
}
