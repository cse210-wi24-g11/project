import { MainNavBar } from '@/components/navigation/main-navbar.tsx'
import { SummaryBar } from '@/components/navigation/summary-bar.tsx'
import { SummaryNavbarItem } from '@/components/navigation/summary-bar.tsx'

type MonthSummaryProps = {
  summaryNavBarItem: SummaryNavbarItem
}

export function MonthSummary({ summaryNavBarItem }: MonthSummaryProps) {
  return (
    <>
      <SummaryBar summaryNavBarItem={summaryNavBarItem} />
      <div className="text-black">Month Summary Page</div>
      <MainNavBar />
    </>
  )
}
