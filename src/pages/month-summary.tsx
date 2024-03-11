import { useEffect } from 'react'

import { updateSettingsInDb } from '@/utils/db.ts'

import { useDb } from '@/context/db.tsx'
import { MainNavBar } from '@/components/navigation/main-navbar.tsx'
import { SummaryBar } from '@/components/navigation/summary-bar.tsx'
import { SummaryNavbarItem } from '@/components/navigation/summary-bar.tsx'



type MonthSummaryProps = {
  summaryNavBarItem: SummaryNavbarItem
}

export function MonthSummary({ summaryNavBarItem }: MonthSummaryProps) {
  const { getDb } = useDb()
  useEffect(() => {
    async function updateLastVisited() {
      const db = await getDb()
      updateSettingsInDb(db, { lastvisited: 'month' })
    }
    void updateLastVisited()
  }, [getDb])


  return (
    <>
      <SummaryBar summaryNavBarItem={summaryNavBarItem} />
      <div className="text-black">Month Summary Page</div>
      <MainNavBar />
    </>
  )
}
