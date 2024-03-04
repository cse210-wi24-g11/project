import { useState } from 'react'

import calendarIcon from '../../assets/icons/calendar.svg'
import plusIcon from '../../assets/icons/plus.svg'
import settingIcon from '../../assets/icons/setting.svg'

type NavbarItem = 'calendar' | 'add' | 'settings'

export function MainNavBar() {
  const [selectedButton, setSelectedButton] = useState<NavbarItem>('calendar')
  const buttonStyle = (button: NavbarItem) => {
    if (button === selectedButton) {
      return 'rounded-3xl mx-8 my-2 border w-1/3 bg-blue-500 text-white hover:border-blue-500 flex items-center justify-center'
    } else {
      return 'rounded-3xl mx-8 my-2 border w-1/3 bg-white hover:bg-gray-200 text-slate-500 hover:border-gray-200 flex items-center justify-center'
    }
  }

  return (
    <div className="w-full bg-white">
      <div className="fixed bottom-0 left-0 flex w-full border bg-white">
        <button
          className={buttonStyle('calendar')}
          onClick={() => setSelectedButton('calendar')}
        >
          <img src={calendarIcon} alt="calendar" height={35} width={35} />
        </button>
        <button
          className={buttonStyle('add')}
          onClick={() => setSelectedButton('add')}
        >
          <img src={plusIcon} alt="add mood" height={35} width={35} />
        </button>
        <button
          className={buttonStyle('settings')}
          onClick={() => setSelectedButton('settings')}
        >
          <img src={settingIcon} alt="settings" height={35} width={35} />
        </button>
      </div>
    </div>
  )
}
