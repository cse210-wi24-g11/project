import { useNavigate, useLocation } from 'react-router-dom'
import { Button, Text } from '@adobe/react-spectrum'

import { CUSTOM_MOOD_ROUTE } from '@/routes.ts'
import { useQuery } from '@/db/index.ts'
import { getExpandedMoodCollection } from '@/db/actions.ts'
import { ExpandedMood } from '@/db/utils.ts'

import { MoodSwatch } from '@/components/mood-swatch/mood-swatch.tsx'
import { MainNavBar } from '@/components/navigation/main-navbar.tsx'

import type { MoodCollection, MoodCollectionCategory } from '@/db/types.ts'

//favorite section
export type MoodSectionProps = {
  moods: ExpandedMood[]
  onSelectMood: (mood: ExpandedMood) => unknown
}

export function MoodSection({ moods, onSelectMood }: MoodSectionProps) {
  return (
    <div className={'grid grid-cols-5 gap-2'}>
      {moods.map((mood, i) => (
        <MoodSwatch
          key={i}
          color={mood.color}
          imgSrc={mood.imageUrl}
          size="single-line-height"
          onClick={() => onSelectMood(mood)}
        />
      ))}
    </div>
  )
}

export function MoodCollection() {
  const navigate = useNavigate()
  const location = useLocation()
  const returnTo = (location.state as { returnTo?: string })?.returnTo

  const [expandedMoodCollection] = useQuery(
    getExpandedMoodCollection,
    [],
    { general: [], favorites: [], archived: [] } as Record<MoodCollectionCategory, ExpandedMood[]>
  )

  const handleSelectMood = (selectedMood: ExpandedMood) => {
    if (returnTo) {
      navigate(returnTo, { state: { selectedMood: selectedMood.id } })
    } else {
      console.log('No returnTo path specified.')
    }
  }

  const addCustomMood = () => {
    navigate(CUSTOM_MOOD_ROUTE)
  }

  return (
    <>
      <div>
        <Button variant="primary" onPress={addCustomMood}>
          <Text>Add New Mood</Text>
        </Button>
        <h1>Favorites</h1>
        <MoodSection moods={expandedMoodCollection.favorites} onSelectMood={handleSelectMood} />
        <h1>General</h1>
        <MoodSection moods={expandedMoodCollection.general} onSelectMood={handleSelectMood} />
        <h1>Archived</h1>
        <MoodSection moods={expandedMoodCollection.archived} onSelectMood={handleSelectMood} />
      </div>
      <MainNavBar />
    </>
  )
}
