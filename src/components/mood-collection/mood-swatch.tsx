/**
 * the particular mood swatch used in the mood collection page
 */

import {
  MoodSwatch,
  MoodSwatchProps,
} from '@/components/mood-swatch/mood-swatch.tsx'

type MoodCollectionMoodSwatchProps = Omit<MoodSwatchProps, 'size'>

export function MoodCollectionMoodSwatch(props: MoodCollectionMoodSwatchProps) {
  return <MoodSwatch size={{ width: 'min(100%, 4rem)' }} {...props} />
}
