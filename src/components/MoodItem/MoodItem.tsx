import { RGBColor } from 'd3'

import { getDateAbbr, getTimeAbbr } from '@/utils/summary.ts'

interface MoodListItemProps {
  imageUrl: string
  title: string
  date: Date
  color: RGBColor
  recordId: string
  onClick: (recordId: string) => void
}

export function MoodListItem(props: MoodListItemProps) {
  const { imageUrl, title, date, color, recordId, onClick } = props

  const colorTagName = (color: RGBColor) => {
    return `rgb(${color.r}, ${color.g}, ${color.b})`
  }

  return (
    <div
      className="h-30 left-0 right-0 flex flex-row items-start rounded-md border bg-white"
      onClick={() => onClick(recordId)}
    >
      <img className="rounded-l-md w-32 h-24 object-cover" src={imageUrl} />
      <div className="grid-flow-col">
        <div className="ml-4 mt-2 flex content-center items-center rounded-md">
          <div
            style={{
              backgroundColor: colorTagName(color),
              width: '14px',
              height: '14px',
              borderRadius: '7px',
            }}
          />
          <p className="ml-2 font-mono text-base font-bold">
            {getDateAbbr(date)}
          </p>
          <p className="ml-2 font-mono text-base font-medium">
            {getTimeAbbr(date)}
          </p>
        </div>
        <p className="mb-1 ml-4 mr-4 mt-1 line-clamp-2 text-left text-base">
          {title}
        </p>
      </div>
    </div>
  )
}
