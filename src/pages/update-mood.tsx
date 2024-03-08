import { NavLink } from 'react-router-dom'

import { MainNavBar } from '@/components/navigation/main-navbar'

export function UpdateMood() {
  return (
    <>
      <NavLink to="/DaySummary" className="fixed left-5 top-10">
        <button className="bg-blue-500 text-white">back</button>
      </NavLink>
      <MainNavBar />
    </>
  )
}
