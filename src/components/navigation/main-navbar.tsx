import { NavLink } from 'react-router-dom'
import { type IconPropsWithoutChildren } from '@react-spectrum/icon'
import Calendar from '@spectrum-icons/workflow/Calendar'
import Add from '@spectrum-icons/workflow/AddCircle'
import Settings from '@spectrum-icons/workflow/Settings'

import {
  type Route,
  ADD_ENTRY_ROUTE,
  SETTINGS_ROUTE,
  SUMMARY_BASE_ROUTE,
} from '@/routes.ts'
import { cls } from '@/utils/cls.ts'

export function MainNavBar() {
  return (
    <nav className="fixed bottom-0 left-0 flex w-full bg-white">
      <NavbarItem to={SUMMARY_BASE_ROUTE} label="summary" icon={Calendar} />
      <NavbarItem to={ADD_ENTRY_ROUTE} label="add mood" icon={Add} />
      <NavbarItem to={SETTINGS_ROUTE} label="settings" icon={Settings} />
    </nav>
  )
}

interface NavbarItemProps {
  to: Route
  label: string
  icon: React.FC<IconPropsWithoutChildren>
}

function NavbarItem({ to, label, icon: Icon }: NavbarItemProps) {
  return (
    <NavLink
      to={to}
      title={label}
      className={({ isActive }) => navbarItemStyle(isActive)}
    >
      <Icon size="S" />
    </NavLink>
  )
}

function navbarItemStyle(active: boolean) {
  const base = cls(
    'grow',
    'px-8 py-4',
    'flex items-center justify-center',
    'rounded first:rounded-s-none last:rounded-e-none',
  )
  const conditional = active
    ? [
        'bg-blue-500',
        'text-white',
        'hover:border-blue-500 focus:border-blue-500 active:border-blue-500',
      ]
    : [
        ['bg-white', 'hover:bg-gray-200 focus:bg-gray-200 active:bg-gray-200'],
        'text-slate-500',
        'hover:border-gray-200 focus:border-gray-200 active:border-gray-200',
      ]
  return cls(base, conditional)
}
