import { NavLink } from 'react-router-dom'

export function UpdateMood() {
  return (
    <>
      <NavLink to="/" className="fixed left-5 top-10">
        <button className="bg-blue-500 text-white">back</button>
      </NavLink>
    </>
  )
}
