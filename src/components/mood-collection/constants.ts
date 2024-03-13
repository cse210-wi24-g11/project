import { MoodCollectionCategory } from '@/db/types.ts'

export const CATEGORIES_WITH_LABELS: Array<{
  category: MoodCollectionCategory
  label: string
}> = [
  { category: 'favorites', label: 'Favorites' },
  { category: 'general', label: 'General' },
  { category: 'archived', label: 'Archived' },
]
export const CATEGORIES = CATEGORIES_WITH_LABELS.map((x) => x.category)

export const sectionsContainerStyles = 'w-full inline-grid grid-flow-row gap-4'
export const sectionStyles = 'w-full'
