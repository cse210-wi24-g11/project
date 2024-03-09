import { useState } from 'react'
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
import { db, useQuery } from '@/db/index.ts'
import { serializeDateForEntry } from '@/db/utils.ts'

import { MainNavBar } from '@/components/navigation/main-navbar.tsx'
import { MoodSwatch } from '@/components/mood-swatch/mood-swatch.tsx'

import type { Entry, Mood } from '@/db/types.ts'

type State = {
  selectedMood: Mood
}

export function AddEntry() {
  const state = useLocationState(validateState)
  const navigate = useNavigate()

  const [mood, setMood] = useState<Mood | null>(() =>
    state === null ? null : state.selectedMood,
  )
  const [description, setDescription] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)

  const [favoriteMoods] = useQuery(
    async () => {
      const favoriteMoodCollectionRecords = await db.moodCollection
        .where('category')
        .equals('favorites')
        .toArray()
      const favoriteMoods = await db.moods.bulkGet(
        favoriteMoodCollectionRecords.map((record) => record.moodId),
      )
      const validFavoriteMoods = favoriteMoods.filter(Boolean) as Mood[]
      // TODO: remove this when default favorite moods are properly set up
      return validFavoriteMoods.length > 0 ? validFavoriteMoods : []
    },
    [],
    [] as Mood[],
  )

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

    const now = new Date()

    const entry: Entry = {
      id: window.crypto.randomUUID(),
      moodId: mood.id,
      description,
      date: serializeDateForEntry(now),
      timestamp: now.getTime(),
    }

    await db.entries.add(entry)
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
