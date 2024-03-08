import { getDateAbbr, SummaryMoodRecord } from '@/components/SummaryHelper.ts'
import MoodListItem from '@/components/MoodItem/MoodItem.tsx'
import { useState } from 'react'

interface MoodEntryListProps {
  records: SummaryMoodRecord[]
  onClickRecord: (record: SummaryMoodRecord) => void
}

const MoodEntryList = ({ records, onClickRecord }: MoodEntryListProps) => {
  const [listItems, setListItems] = useState<SummaryMoodRecord[]>([])

  return (
    <ul className="left-8 right-8 mt-0 scroll-auto bg-white">
      {listItems.map((item, index) => (
        <li className="left-0 right-0 my-4" key={item.id}>
          <MoodListItem
            imageUrl={'TODO'} // TODO: fix
            title={item.title}
            date={item.day}
            color={item.color}
            recordId={item.id.toString()} // TODO: type of id?
            onClick={(recordId: string) => {
              onClickRecord(item)
            }}
          />
        </li>
      ))}
    </ul>
  )
}

export default MoodEntryList
