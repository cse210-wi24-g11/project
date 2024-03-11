import { MainNavBar } from '@/components/navigation/main-navbar.tsx'
import { SummaryBar } from '@/components/navigation/summary-bar.tsx'

export function MonthSummary() {
  return (
    <>
      <SummaryBar />
      <div className="text-black">Month Summary Page</div>
      <MainNavBar />
    </>
  )
}
