import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@react-spectrum/button'
import { TextField } from '@react-spectrum/textfield'
import Edit from '@spectrum-icons/workflow/Edit'
import More from '@spectrum-icons/workflow/More'

import {
  DAY_SUMMARY_ROUTE,
  EDIT_ENTRY_ROUTE,
  MOOD_COLLECTION_ROUTE,
} from '@/routes.ts'
import { useLocationState } from '@/hooks/use-location-state.ts'
import {
  DbRecord,
  getEntry,
  getFavoriteMoods,
  getMoodById,
  updateEntry,
} from '@/utils/db.ts'

import { useDb } from '@/context/db.tsx'
import { MainNavBar } from '@/components/navigation/main-navbar.tsx'
import { MoodSwatch } from '@/components/mood-swatch/mood-swatch.tsx'

const MOCK_FAVORITES = [
  { id: 'sdfa;sdf', color: '#ff0000', imagePath: '/vite.svg ' },
]

export type Params = {
  entryId: DbRecord<'entry'>['id']
}

export type State = {
  selectedMood: DbRecord<'mood'>
}

export function EditEntry() {
  const { entryId } = useParams()
  const state = useLocationState(validateState)
  const navigate = useNavigate()
  const { getDb } = useDb()

  const selectedMood = useMemo(() => state?.selectedMood ?? null, [state])

  const [mood, setMood] = useState<DbRecord<'mood'> | null>(() =>
    state === null ? null : selectedMood,
  )
  const [description, setDescription] = useState('')

  const [entryMood, setEntryMood] = useState<DbRecord<'mood'> | null>(null)
  useEffect(() => {
    async function loadEntry() {
      const db = await getDb()
      const entry = await getEntry(db, entryId!)

      if (!entry) {
        // @ts-expect-error -1 is a valid argument, representing going back. see https://reactrouter.com/en/main/hooks/use-navigate
        navigate(-1, { replace: true })
        return
      }

      const entryMood = await getMoodById(db, entry.moodId)

      if (!entryMood) {
        // @ts-expect-error -1 is a valid argument, representing going back. see https://reactrouter.com/en/main/hooks/use-navigate
        navigate(-1, { replace: true })
        return
      }

      setEntryMood(entryMood)

      // if there's a selected mood, we prefer that as the initial value
      // over whatever mood was initially associated with the entry
      if (!selectedMood) {
        setMood(entryMood)
      }

      setDescription(entry.description)
    }
    void loadEntry()
  }, [entryId, getDb, navigate, selectedMood])

  const [isSubmitting, setIsSubmitting] = useState(false)

  const [favoriteMoods, setFavoriteMoods] = useState<DbRecord<'mood'>[]>([])
  useEffect(() => {
    async function loadFavoriteMoods() {
      const db = await getDb()
      const favoriteMoods = await getFavoriteMoods(db)
      const newFavoriteMoods = favoriteMoods?.length
        ? favoriteMoods.slice(-5)
        : []
      setFavoriteMoods(newFavoriteMoods)
    }
    void loadFavoriteMoods()
  }, [getDb])

  function pickFromMoodCollection() {
    navigate(MOOD_COLLECTION_ROUTE, {
      state: {
        returnTo: EDIT_ENTRY_ROUTE(entryId!),
      },
    })
  }

  async function updateMoodEntry() {
    // sanity check
    if (mood === null) {
      return
    }

    setIsSubmitting(true)

    const db = await getDb()
    await updateEntry(db, entryId!, { moodId: mood.id, description })
    setIsSubmitting(false)

    navigate(DAY_SUMMARY_ROUTE)
  }

  return (
    <>
      <main className="max-w-120 flex w-full grow flex-col items-center gap-4 pt-4">
        Edit entry
        <div className="flex w-full grow flex-col items-center justify-center gap-4">
          {/* favorite moods */}
          <div className="flex gap-4">
            {favoriteMoods.map((m) => (
              <MoodSwatch
                key={m.id}
                size="single-line-height"
                color={m.color}
                imgSrc={URL.createObjectURL(m.image)}
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
              imgSrc={
                mood && mood.image ? URL.createObjectURL(mood.image) : undefined
              }
              onClick={
                mood
                  ? () => {
                      setMood(entryMood)
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
                void updateMoodEntry()
              }}
            >
              <Edit />
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
