import { MainNavBar } from '@/components/navigation/main-navbar.tsx'
import { SummaryBar } from '@/components/navigation/summary-bar.tsx'
import { SummaryNavbarItem } from '@/components/navigation/summary-bar.tsx'

import { useEffect } from 'react'
import { updateLastVisited } from '@/utils/db.ts'
import { useDb } from '@/context/db.tsx'

type WeekSummaryProps = {
  summaryNavBarItem: SummaryNavbarItem
}

export function WeekSummary({ summaryNavBarItem }: WeekSummaryProps) {
  const { getDb } = useDb()
  useEffect(() => {
    updateLastVisited(getDb(), 'week')
  }, [])

  return (
    <>
      <SummaryBar summaryNavBarItem={summaryNavBarItem} />
      <div className="text-black">Week Summary Page</div>
      <MainNavBar />
    </>
  )
}
