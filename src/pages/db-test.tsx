// import { useEffect } from 'react'

import { useQuery } from '@/db/index.ts'
import { useMoodCollection, useSettings } from '@/db/actions.ts'

import type { Entry, Mood } from '@/db/types.ts'

export function DbTest() {
  const [settings] = useSettings(null)
  const [moods] = useQuery((db) => db.moods.toArray(), [], [] as Mood[])
  const [moodCollection] = useMoodCollection(null)
  const [entries] = useQuery((db) => db.entries.toArray(), [], [] as Entry[])

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
        <hr />
        <h2>entries</h2>
        <pre>{JSON.stringify(entries, null, 2) ?? 'undefined'}</pre>
      </div>
    </div>
  )
}
