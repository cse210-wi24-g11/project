import { NavLink } from 'react-router-dom'

import { DAY_SUMMARY_ROUTE } from '@/routes.ts'

import { MainNavBar } from '@/components/navigation/main-navbar.tsx'

export function UpdateMood() {
  return (
    <>
      <NavLink to={DAY_SUMMARY_ROUTE} className="fixed left-5 top-10">
        <button className="bg-blue-500 text-white">back</button>
      </NavLink>
      <MainNavBar />
    </>
  )
}
