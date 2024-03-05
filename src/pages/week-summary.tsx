import { MainNavBar } from '@/components/navigation/main-navbar.tsx'
import { SummaryBar } from '@/components/navigation/summary-bar.tsx'
import { SummaryNavbarItem } from '@/components/navigation/summary-bar.tsx'

type WeekSummaryProps = {
  summaryNavBarItem: SummaryNavbarItem
}

export function WeekSummary({ summaryNavBarItem }: WeekSummaryProps) {
  return (
    <>
      <SummaryBar summaryNavBarItem={summaryNavBarItem} />
      <div className="text-black">Week Summary Page</div>
      <MainNavBar />
    </>
  )
}
