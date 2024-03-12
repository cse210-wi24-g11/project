import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Text } from '@adobe/react-spectrum'

import { CUSTOM_MOOD_ROUTE, Route } from '@/routes.ts'
import { useQuery } from '@/db/index.ts'
import { getExpandedMoodCollection } from '@/db/actions.ts'
import { ExpandedMood } from '@/db/utils.ts'
import { useLocationState } from '@/hooks/use-location-state.ts'

import { MoodSwatch } from '@/components/mood-swatch/mood-swatch.tsx'
import { MainNavBar } from '@/components/navigation/main-navbar.tsx'

import type { MoodCollection, MoodCollectionCategory } from '@/db/types.ts'

type State = {
  returnTo?: Route
}

export function MoodCollection() {
  const state = useLocationState(validateState)
  const navigate = useNavigate()

  const [expandedMoodCollection] = useQuery(
    getExpandedMoodCollection,
    [],
    { general: [], favorites: [], archived: [] } as Record<MoodCollectionCategory, ExpandedMood[]>
  )

  const addCustomMood = () => {
    navigate(CUSTOM_MOOD_ROUTE)
  }

  const onClickMood = useMemo(() => {
    if (!state?.returnTo) { return undefined }
    
    function onClick(mood: ExpandedMood) {
      console.log(state!.returnTo, mood)
      navigate(state!.returnTo as Route, { state: { selectedMood: mood } })
    }
    return onClick
  }, [state, navigate])

  return (
    <>
      <div>
        <Button variant="primary" onPress={addCustomMood}>
          <Text>Add New Mood</Text>
        </Button>
        <h1>Favorites</h1>
        <MoodSection moods={expandedMoodCollection.favorites} onClickMood={onClickMood} />
        <h1>General</h1>
        <MoodSection moods={expandedMoodCollection.general} onClickMood={onClickMood} />
        <h1>Archived</h1>
        <MoodSection moods={expandedMoodCollection.archived} onClickMood={onClickMood} />
      </div>
      <MainNavBar />
    </>
  )
}

//favorite section
type MoodSectionProps = {
  moods: ExpandedMood[]
  onClickMood?: (mood: ExpandedMood) => unknown
}

function MoodSection({ moods, onClickMood }: MoodSectionProps) {
  const getOnClick = useMemo(() => {
    if (!onClickMood) { return undefined }
    return (mood: ExpandedMood) => () => onClickMood(mood)
  }, [onClickMood])

  return (
    <div className={'grid grid-cols-5 gap-2'}>
      {moods.map((mood, i) => (
        <MoodSwatch
          key={i}
          color={mood.color}
          imgSrc={mood.imageUrl}
          onClick={getOnClick?.(mood)}
          size="single-line-height"
        />
      ))}
    </div>
  )
}

function validateState(state: Record<string, unknown>): state is State {
  const { returnTo } = state
  if (!returnTo) { return false }
  if (typeof returnTo !== 'string') { return false }
  return true
}