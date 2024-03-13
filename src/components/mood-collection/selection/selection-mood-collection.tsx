import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { useQuery } from '@/db/index.ts'
import { getFullyExpandedMoodCollection } from '@/db/actions.ts'
import { MoodCollectionCategory } from '@/db/types.ts'
import { ExpandedMood, blobToUrl } from '@/db/utils.ts'
import { Route } from '@/routes.ts'

import { MoodCollectionMoodSwatch } from '../mood-swatch.tsx'
import {
  CATEGORIES_WITH_LABELS,
  sectionStyles,
  sectionsContainerStyles,
} from '../constants.ts'
import { Container } from '../container.tsx'

type SelectionMoodCollectionProps = {
  returnTo: Route
}

export function SelectionMoodCollection({
  returnTo,
}: SelectionMoodCollectionProps) {
  const navigate = useNavigate()

  const [moodCollection] = useQuery(getFullyExpandedMoodCollection, [], {
    general: [],
    favorites: [],
    archived: [],
  } as Record<MoodCollectionCategory, ExpandedMood[]>)

  function onClickMood(mood: ExpandedMood) {
    navigate(returnTo as Route, { state: { selectedMood: mood } })
  }

  return (
    <div className={sectionsContainerStyles}>
      {CATEGORIES_WITH_LABELS.map(({ category, label }) => (
        <MoodSection
          key={category}
          moods={moodCollection[category]}
          category={category}
          label={label}
          onClickMood={onClickMood}
        />
      ))}
    </div>
  )
}

type MoodSectionProps = {
  moods: ExpandedMood[]
  category: MoodCollectionCategory
  label: string
  onClickMood?: (mood: ExpandedMood) => unknown
}

function MoodSection({
  moods,
  category,
  label,
  onClickMood,
}: MoodSectionProps) {
  const getOnClick = useMemo(() => {
    if (!onClickMood) {
      return undefined
    }
    return (mood: ExpandedMood) => () => onClickMood(mood)
  }, [onClickMood])

  return (
    <section key={category} className={sectionStyles}>
      <h1>{label}</h1>
      <Container>
        {moods.map((mood, i) => (
          <MoodCollectionMoodSwatch
            key={i}
            color={mood.color}
            imgSrc={blobToUrl(mood.imageBlob)}
            onClick={getOnClick?.(mood)}
          />
        ))}
      </Container>
    </section>
  )
}
