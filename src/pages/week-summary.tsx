import { useEffect } from 'react'

import { updateSettingsInDb } from '@/utils/db.ts'

import { useDb } from '@/context/db.tsx'
import { MainNavBar } from '@/components/navigation/main-navbar.tsx'
import { SummaryBar } from '@/components/navigation/summary-bar.tsx'
import { SummaryNavbarItem } from '@/components/navigation/summary-bar.tsx'



type WeekSummaryProps = {
  summaryNavBarItem: SummaryNavbarItem
}

export function WeekSummary({ summaryNavBarItem }: WeekSummaryProps) {
  const { getDb } = useDb()
  useEffect(() => {
    async function updateLastVisited() {
      const db = await getDb()
      updateSettingsInDb(db, { lastvisited: 'week' })
    }
    void updateLastVisited()
  }, [getDb])


  return (
    <>
      <SummaryBar summaryNavBarItem={summaryNavBarItem} />
      <div className="text-black">Week Summary Page</div>
      <MainNavBar />
    </>
  )
}
