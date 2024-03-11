import { SummaryMoodRecord } from '@/components/SummaryHelper.ts'

import MoodListItem from '@/components/MoodItem/MoodItem.tsx'

interface MoodEntryListProps {
  records: SummaryMoodRecord[]
  onClickRecord: (record: SummaryMoodRecord) => void
}

function MoodEntryList({ records, onClickRecord }: MoodEntryListProps) {
  return (
    <div>
      {records.length == 0 ? (
        <p className="mt-20 text-4xl text-gray-400">No Data</p>
      ) : (
        <ul className="left-8 right-8 mt-0 scroll-auto">
          {/*<ul className="left-0 mt-0 w-full bg-white scroll-auto">*/}
          {records.map((item) => (
            <li className="left-0 right-0 my-4" key={item.id}>
              <MoodListItem
                imageUrl={item.imagePath}
                title={item.title}
                date={item.day}
                color={item.color}
                recordId={item.id.toString()} // TODO: type of id?
                onClick={() => {
                  onClickRecord(item)
                }}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default MoodEntryList