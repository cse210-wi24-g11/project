import { MainNavBar } from '@/components/navigation/main-navbar.tsx'
import { SummaryBar } from '@/components/navigation/summary-bar.tsx'
import { SummaryNavbarItem } from '@/components/navigation/summary-bar.tsx'

import { useEffect } from 'react'
import { updateLastVisited } from '@/utils/db.ts'
import { useDb } from '@/context/db.tsx'

type MonthSummaryProps = {
  summaryNavBarItem: SummaryNavbarItem
}

export function MonthSummary({ summaryNavBarItem }: MonthSummaryProps) {
  const { getDb } = useDb()
  useEffect(() => {
    updateLastVisited(getDb(), 'month')
  }, [])

  return (
    <>
      <SummaryBar summaryNavBarItem={summaryNavBarItem} />
      <div className="text-black">Month Summary Page</div>
      <MainNavBar />
    </>
  )
}
