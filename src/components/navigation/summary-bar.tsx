import { Link } from 'react-router-dom'

export type SummaryNavbarItem = 'Day' | 'Week' | 'Month'

type SummaryBarProps = {
  summaryNavBarItem: SummaryNavbarItem
}

export function SummaryBar({ summaryNavBarItem }: SummaryBarProps) {
  const buttonGeneralStyle = 'mx-8 text-lg pb-1 px-2 bg-white rounded-none mb-[-2px]'
  const buttonSelectStyle = (button: SummaryNavbarItem) => {
    if (button === summaryNavBarItem) {
      return `${buttonGeneralStyle} blue-500 text-blue-500 border-b-4 border-b-blue-500`
    } else {
      return `${buttonGeneralStyle} slate-500 text-slate-500`
    }
  }

  return (
    <div className="w-full bg-white">
      <div className="fixed left-0 top-10 w-full flex-row border-b-2 bg-white px-2 pb-1">
        <Link className={buttonSelectStyle('Day')} to="/DaySummary">
          Day
        </Link>
        <Link className={buttonSelectStyle('Week')} to="/WeekSummary">
          Week
        </Link>
        <Link className={buttonSelectStyle('Month')} to="/MonthSummary">
          Month
        </Link>
      </div>
    </div>
  )
}
