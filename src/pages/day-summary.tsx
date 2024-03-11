import { NavLink } from 'react-router-dom'
import { useEffect } from 'react'

import { updateSettingsInDb } from '@/utils/db.ts'

import { useDb } from '@/context/db.tsx'
import { MainNavBar } from '@/components/navigation/main-navbar.tsx'
import { SummaryBar } from '@/components/navigation/summary-bar.tsx'
import { SummaryNavbarItem } from '@/components/navigation/summary-bar.tsx'

type DaySummaryBarProps = {
  summaryNavBarItem: SummaryNavbarItem
}

export function DaySummary({ summaryNavBarItem }: DaySummaryBarProps) {
  const { getDb } = useDb()
  useEffect(() => {
    async function updateLastVisited() {
      const db = await getDb()
      updateSettingsInDb(db, { lastvisited: 'day' })
    }
    void updateLastVisited()
  }, [getDb])

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
        <NavLink className="mt-5 w-80 bg-white" to="/UpdateMood">
          <div className="rounded-md border px-1 py-2">
            <div className="fßex items-center justify-start">
              <div className="mr-2 h-10 w-10 rounded-md border border-gray-200">
                {/* insert mood source (img?) here */}
                <div></div>
              </div>
              <p className="text-black">time: content</p>
            </div>
          </div>
        </NavLink>
      </div>
      <MainNavBar />
    </>
  )
}
