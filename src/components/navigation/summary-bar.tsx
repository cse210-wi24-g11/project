import { NavLink } from 'react-router-dom'

import { DAY_SUMMARY_ROUTE, WEEK_SUMMARY_ROUTE } from '@/routes.ts'
import { cls } from '@/utils/cls.ts'

export type SummaryNavbarItem = 'Day' | 'Week' | 'Month'

export function SummaryBar() {
  return (
    <div className="w-full bg-white">
      <div className="fixed left-0 flex w-full border-b-2 bg-white pb-1">
        <NavLink
          to={DAY_SUMMARY_ROUTE}
          className={({ isActive }) => navbarItemStyle(isActive)}
        >
          Day
        </NavLink>
        <NavLink
          to={WEEK_SUMMARY_ROUTE}
          className={({ isActive }) => navbarItemStyle(isActive)}
        >
          Week
        </NavLink>
      </div>
    </div>
  )
}

function navbarItemStyle(active: boolean) {
  const base = 'text-lg py-1 px-2 rounded-none mb-[-4px] flex-grow'

  const conditional = active
    ? 'bg-blue-100 text-blue-500 border-b-4 border-b-blue-500'
    : 'bg-white slate-500 text-slate-500'

  return cls(base, conditional)
}
