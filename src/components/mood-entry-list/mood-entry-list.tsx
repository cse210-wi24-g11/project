import { ExpandedEntry } from '@/db/utils.ts'

import { MoodListItem } from '@/components/mood-entry-list/mood-entry.tsx'

interface MoodEntryListProps {
  entries: ExpandedEntry[]
  onClickEntry: (entry: ExpandedEntry) => void
}

export function MoodEntryList({ entries, onClickEntry }: MoodEntryListProps) {
  if (entries.length === 0) {
    return <p className="mt-20 text-4xl text-gray-400">No Data</p>
  }
  return (
    <div>
      <ul className="left-8 right-8 mt-0 scroll-auto">
        {/*<ul className="left-0 mt-0 w-full bg-white scroll-auto">*/}
        {entries.map((entry) => (
          <li className="left-0 right-0 my-4" key={entry.id}>
            <MoodListItem entry={entry} onClick={() => onClickEntry(entry)} />
          </li>
        ))}
      </ul>
    </div>
  )
}
