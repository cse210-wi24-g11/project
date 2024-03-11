import { useState } from 'react'
import { NavLink } from 'react-router-dom'

import { useQuery } from '@/db/index.ts'
import { getResolvedEntriesForDate } from '@/db/actions.ts'
import { type ExpandedEntry } from '@/db/utils.ts'

import { MainNavBar } from '@/components/navigation/main-navbar.tsx'
import { SummaryBar } from '@/components/navigation/summary-bar.tsx'
import { SummaryNavbarItem } from '@/components/navigation/summary-bar.tsx'

type DaySummaryBarProps = {
  summaryNavBarItem: SummaryNavbarItem
}

export function DaySummary({ summaryNavBarItem }: DaySummaryBarProps) {
  const [today] = useState(() => new Date())
  const [todayEntries] = useQuery(
    () => getResolvedEntriesForDate(today),
    [today],
    [] as ExpandedEntry[],
  )

  console.log({ todayEntries })

  return (
    <>
      <SummaryBar summaryNavBarItem={summaryNavBarItem} />
      <div className="flex flex-col items-center">
        <div>
          <p className="text-black">Your day so far</p>
          <div className="mt-2 h-60 w-60 rounded-md border border-gray-200">
            {/* insert mood source (img?) here */}
            <div></div>
          </div>
        </div>

        {todayEntries.map((entry) => (
          <NavLink
            key={entry.id}
            className="mt-5 w-80 bg-white"
            to="/UpdateMood"
          >
            <div className="rounded-md border px-1 py-2">
              <div className="flex items-center justify-start">
                <div className="mr-2 h-10 w-10 rounded-md border border-gray-200">
                  <img src={entry.mood.imagePath} />
                  <div></div>
                </div>
                <p className="text-black">
                  {formatDate(entry.timestamp)}: {entry.description}
                </p>
              </div>
            </div>
          </NavLink>
        ))}
      </div>
      <MainNavBar />
    </>
  )
}

function formatDate(date: Date) {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
}
