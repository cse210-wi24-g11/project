import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@react-spectrum/button'
import { TextField } from '@react-spectrum/textfield'
import Send from '@spectrum-icons/workflow/Send'
import More from '@spectrum-icons/workflow/More'

import {
  ADD_ENTRY_ROUTE,
  DAY_SUMMARY_ROUTE,
  MOOD_COLLECTION_ROUTE,
} from '@/routes.ts'
import { useLocationState } from '@/hooks/use-location-state.ts'
import { DbRecord, getFavoriteMoods, putEntry } from '@/utils/db.ts'

import { useDb } from '@/context/db.tsx'
import { MainNavBar } from '@/components/navigation/main-navbar.tsx'
import { MoodSwatch } from '@/components/mood-swatch/mood-swatch.tsx'

const MOCK_FAVORITES = [
  { id: 'sdfa;sdf', color: '#ff0000', imagePath: '/vite.svg ' },
]

type State = {
  selectedMood: DbRecord<'mood'>
}

export function AddEntry() {
  const state = useLocationState(validateState)
  const navigate = useNavigate()
  const { getDb } = useDb()

  const [mood, setMood] = useState<DbRecord<'mood'> | null>(() =>
    state === null ? null : state.selectedMood,
  )
  const [description, setDescription] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)

  const [favoriteMoods, setFavoriteMoods] = useState<DbRecord<'mood'>[]>([])
  useEffect(() => {
    async function loadFavoriteMoods() {
      const db = await getDb()
      const favoriteMoods = await getFavoriteMoods(db)
      const newFavoriteMoods = favoriteMoods?.length
        ? favoriteMoods.slice(-5)
        : MOCK_FAVORITES
      setFavoriteMoods(newFavoriteMoods)
    }

    void loadFavoriteMoods()
  }, [getDb])

  function pickFromMoodCollection() {
    navigate(MOOD_COLLECTION_ROUTE, {
      state: {
        returnTo: ADD_ENTRY_ROUTE,
      },
    })
  }

  async function addMoodEntry() {
    // sanity check
    if (mood === null) {
      return
    }

    setIsSubmitting(true)

    const entry: DbRecord<'entry'> = {
      id: window.crypto.randomUUID(),
      moodId: mood.id,
      description,
      timestamp: new Date(),
    }

    const db = await getDb()
    await putEntry(db, entry)
    setIsSubmitting(false)

    navigate(DAY_SUMMARY_ROUTE)
  }

  return (
    <>
      <main className="max-w-120 flex w-full grow flex-col items-center gap-4 pt-4">
        Add entry
        <div className="flex w-full grow flex-col items-center justify-center gap-4">
          {/* day overview (TODO) */}

          {/* favorite moods */}
          <div className="flex gap-4">
            {favoriteMoods.map((m) => (
              <MoodSwatch
                key={m.id}
                size="single-line-height"
                color={m.color}
                imgSrc={m.imagePath}
                onClick={() => {
                  setMood(m)
                }}
              />
            ))}
            {/* select from mood collection */}
            <Button
              variant="primary"
              aria-label="view full mood collection"
              onPress={pickFromMoodCollection}
            >
              <More />
            </Button>
          </div>

          {/* submission row */}
          <div className="mt-single-line-height flex h-single-line-height items-end gap-4">
            <MoodSwatch
              size="single-line-height"
              color={mood?.color}
              imgSrc={mood?.imagePath}
              onClick={
                mood
                  ? () => {
                      setMood(null)
                    }
                  : undefined
              }
            />
            <TextField label="entry" onChange={setDescription} />
            <Button
              variant="primary"
              aria-label="submit"
              isDisabled={mood === null}
              isPending={isSubmitting}
              onPress={() => {
                void addMoodEntry()
              }}
            >
              <Send />
            </Button>
          </div>
        </div>
      </main>
      <MainNavBar />
    </>
  )
}

function validateState(state: unknown): state is State {
  if (!state) {
    return false
  }
  if (typeof state !== 'object') {
    return false
  }

  const { selectedMood } = state as Record<string, unknown>
  if (!selectedMood) {
    return false
  }
  if (typeof selectedMood !== 'object') {
    return false
  }

  const { id, color, imagePath } = selectedMood as Record<string, unknown>
  if (typeof id !== 'string') {
    return false
  }
  if (typeof color !== 'string') {
    return false
  }
  if (typeof imagePath !== 'string') {
    return false
  }

  return true
}
