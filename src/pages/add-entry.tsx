import { useMemo, useState } from 'react'
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
import { useAsyncMemo } from '@/hooks/use-async-memo.ts'
import { useLocationState } from '@/hooks/use-location-state.ts'
import { DAY_SUMMARY_SESSIONSTORAGE_KEY, date2SessionStorageStr } from '@/utils/summary.ts'
import { db } from '@/db/index.ts'
import { useFavoriteMoods } from '@/db/actions.ts'
import { ExpandedMood, blobToUrl, createEntry, expandMood } from '@/db/utils.ts'

import { MainNavBar } from '@/components/navigation/main-navbar.tsx'
import { MoodSwatch } from '@/components/mood-swatch/mood-swatch.tsx'

import type { Mood } from '@/db/types.ts'

type State = {
  selectedMood: ExpandedMood
}

export function AddEntry() {
  const state = useLocationState(validateState)
  const navigate = useNavigate()

  const [mood, setMood] = useState<ExpandedMood | null>(() =>
    state === null ? null : state.selectedMood,
  )
  const moodImageUrl = useMemo(() => {
    if (mood === null) {
      return undefined
    }
    return blobToUrl(mood.imageBlob)
  }, [mood])

  const [description, setDescription] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)

  const [favoriteMoods] = useFavoriteMoods([] as Mood[])
  const visibleFavoriteMoods = useMemo(
    () => favoriteMoods.slice(-5),
    [favoriteMoods],
  )
  const expandedFavoriteMoods = useAsyncMemo(
    () => Promise.all(visibleFavoriteMoods.map(expandMood)),
    [visibleFavoriteMoods],
    [] as ExpandedMood[],
  )
  const expandedFavoriteMoodsWithImageUrls = useMemo(
    () =>
      expandedFavoriteMoods.map(
        (mood) => [mood, blobToUrl(mood.imageBlob)] as const,
      ),
    [expandedFavoriteMoods],
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

    const date = new Date()
    const entry = createEntry(mood.id, description, date)

    await db.entries.add(entry)
    setIsSubmitting(false)

    sessionStorage.setItem(DAY_SUMMARY_SESSIONSTORAGE_KEY, date2SessionStorageStr(date))
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
            {expandedFavoriteMoodsWithImageUrls.map(([m, imageUrl]) => (
              <MoodSwatch
                key={m.id}
                size="single-line-height"
                color={m.color}
                imgSrc={imageUrl}
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
              imgSrc={moodImageUrl}
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

function validateState(state: Record<string, unknown>): state is State {
  const { selectedMood } = state
  if (!selectedMood) {
    return false
  }
  if (typeof selectedMood !== 'object') {
    return false
  }

  const { id, color, imageBlob } = selectedMood as Record<string, unknown>
  if (typeof id !== 'string') {
    return false
  }
  if (typeof color !== 'string') {
    return false
  }
  if (!(imageBlob instanceof Blob)) {
    return false
  }

  return true
}
