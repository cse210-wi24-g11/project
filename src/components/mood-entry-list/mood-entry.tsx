import { useMemo } from 'react'
import { rgb } from 'd3'

import { ExpandedEntry, blobToUrl } from '@/db/utils.ts'
import { displayTime, displayMonthDay } from '@/utils/summary.ts'

import type { Entry } from '@/db/types.ts'

interface MoodListItemProps {
  entry: ExpandedEntry
  onClick: (entryId: Entry['id']) => void
}

export function MoodListItem({ entry, onClick }: MoodListItemProps) {
  const entryMoodImageUrl = useMemo(
    () => blobToUrl(entry.mood.imageBlob),
    [entry],
  )

  const colorStr = useMemo(() => toCssStr(entry.mood.color), [entry.mood.color])

  return (
    <div
      className="h-30 left-0 right-0 flex flex-row items-start rounded-md border bg-white"
      onClick={() => onClick(entry.id)}
    >
      <img className="rounded-l-md" src={entryMoodImageUrl} />
      <div className="grid-flow-col">
        <div className="ml-4 mt-2 flex content-center items-center rounded-md">
          <div
            style={{
              backgroundColor: colorStr,
              width: '14px',
              height: '14px',
              borderRadius: '7px',
            }}
          />
          <p className="ml-2 font-mono text-base font-bold">
            {displayMonthDay(entry.timestamp)}
          </p>
          <p className="ml-2 font-mono text-base font-medium">
            {displayTime(entry.timestamp)}
          </p>
        </div>
        <p className="mb-1 ml-4 mr-4 mt-1 line-clamp-2 text-left text-base">
          {entry.description}
        </p>
      </div>
    </div>
  )
}

function toCssStr(color: string): string {
  // TODO: is this even necessary? since from what d3.rgb docs suggest,
  // it only works on valid css strings either way
  return rgb(color).toString()
}
