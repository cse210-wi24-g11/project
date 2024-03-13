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
import { db, useQuery } from '@/db/index.ts'
import { useFavoriteMoods } from '@/db/actions.ts'
import { ExpandedMood, blobToUrl, expandMood } from '@/db/utils.ts'
import { useAsyncMemo } from '@/hooks/use-async-memo.ts'
import { useLocationState } from '@/hooks/use-location-state.ts'

import { MainNavBar } from '@/components/navigation/main-navbar.tsx'
import { MoodSwatch } from '@/components/mood-swatch/mood-swatch.tsx'

import type { Entry, Mood } from '@/db/types.ts'
import { DisplayImageComponent } from '@/components/custom-mood/display-image'

export type Params = {
  entryId: Entry['id']
}

export type State = {
  selectedMood: ExpandedMood
}

export function EditEntry() {
  const { entryId } = useParams()
  const state = useLocationState(validateState)
  const navigate = useNavigate()

  const [entry] = useQuery(
    async (db) => {
      const entry = await db.entries.get(entryId!)

      return entry ?? null
    },
    [entryId],
    null,
  )
  const [entryMood] = useQuery(
    async (db) => {
      if (entry === null) {
        return null
      }
      const mood = await db.moods.get(entry.moodId)
      if (!mood) {
        return null
      }
      return await expandMood(mood)
    },
    [entry],
    null,
  )
  const [description, setDescription] = useState('')
  useEffect(() => {
    if (!entry) {
      return
    }

    setDescription((desc) => {
      if (desc) {
        return desc
      }
      return entry?.description ?? ''
    })
    // should only default the description to the entry's original description. but the entry shouldn't change across renders
  }, [entry])

  const selectedMood = useMemo(() => state?.selectedMood ?? null, [state])

  const [mood, setMood] = useState<ExpandedMood | null>(() =>
    state === null ? null : selectedMood,
  )
  const moodImageUrl = useMemo(() => {
    if (mood === null) {
      return undefined
    }
    return blobToUrl(mood.imageBlob)
  }, [mood])
  useEffect(() => {
    // if we're coming from a selected mood, we don't want to override that with the entry's mood once resolved
    if (state === null) {
      setMood(entryMood)
    }
    // should only default the description to the entry's original description. but the entry shouldn't change across renders
  }, [entryMood, state])

  const [isSubmitting, setIsSubmitting] = useState(false)

  const [favoriteMoods] = useFavoriteMoods([] as Mood[])
  const visibleFavoriteMoods = useMemo(
    () => favoriteMoods.slice(-5),
    [favoriteMoods],
  )
  const expandedFavoriteMoods = useAsyncMemo(
    () => Promise.all(visibleFavoriteMoods.map(expandMood)),
    [favoriteMoods],
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
        returnTo: EDIT_ENTRY_ROUTE(entryId!),
      },
    })
  }

  async function updateMoodEntry() {
    // sanity check
    if (entryId == null || mood === null) {
      return
    }

    setIsSubmitting(true)
    await db.entries.update(entryId, { moodId: mood.id, description })
    setIsSubmitting(false)

    navigate(DAY_SUMMARY_ROUTE)
  }

  return (
    <>
      <main className="max-w-120 flex w-full grow flex-col items-center gap-4 pt-4">
        Edit entry
        <div
          className="m-4 h-max w-max rounded-lg"
          style={{ border: `20px solid ${mood?.color}` }}
        >
          <DisplayImageComponent uploadedImage={moodImageUrl as string} />
        </div>
        <div className="flex w-full grow flex-col items-center justify-center gap-4">
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
            <TextField
              label="entry"
              value={description}
              onChange={setDescription}
            />
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
