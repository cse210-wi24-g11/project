import { Link } from 'react-router-dom'

export type SummaryNavbarItem = 'Day' | 'Week' | 'Month'

type SummaryBarProps = {
  summaryNavBarItem: SummaryNavbarItem
}

export function SummaryBar({ summaryNavBarItem }: SummaryBarProps) {
  const buttonGeneralStyle =
    'text-lg py-1 px-2 rounded-none mb-[-4px] flex-grow'
  const buttonSelectStyle = (button: SummaryNavbarItem) => {
    if (button === summaryNavBarItem) {
      return `${buttonGeneralStyle} bg-blue-100 text-blue-500 border-b-4 border-b-blue-500`
    } else {
      return `${buttonGeneralStyle} bg-white slate-500 text-slate-500`
    }
  }

  return (
    <div className="w-full bg-white">
      <div className="fixed left-0 top-0 flex w-full border-b-2 bg-white pb-1">
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
