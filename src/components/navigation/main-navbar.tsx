import { useState } from 'react'

import calendarIcon from '../../assets/icons/calendar.svg'
import plusIcon from '../../assets/icons/plus.svg'
import settingIcon from '../../assets/icons/setting.svg'

export function MainNavBar() {
  enum NavButton {
    Calendar = 'Calendar',
    Add = 'Add',
    Settings = 'Settings',
  }

  const [selectedButton, setSelectedButton] = useState<NavButton>(
    NavButton.Calendar,
  )
  const buttonStyle = (button: NavButton) => {
    if (button === selectedButton) {
      return 'rounded-3xl mx-8 my-2 border w-1/3 bg-blue-500 text-white hover:border-blue-500 flex items-center justify-center'
    } else {
      return 'rounded-3xl mx-8 my-2 border w-1/3 bg-white hover:bg-gray-200 text-slate-500 hover:border-gray-200 flex items-center justify-center'
    }
  }

  return (
    <div className="w-full bg-white">
      <div className="fixed bottom-0 left-0 flex w-full bg-white">
        <button
          className={buttonStyle(NavButton.Calendar)}
          onClick={() => setSelectedButton(NavButton.Calendar)}
        >
          <img src={calendarIcon} alt="calendar" height={35} width={35} />
        </button>
        <button
          className={buttonStyle(NavButton.Add)}
          onClick={() => setSelectedButton(NavButton.Add)}
        >
          <img src={plusIcon} alt="add mood" height={35} width={35} />
        </button>
        <button
          className={buttonStyle(NavButton.Settings)}
          onClick={() => setSelectedButton(NavButton.Settings)}
        >
          <img src={settingIcon} alt="settings" height={35} width={35} />
        </button>
      </div>
    </div>
  )
}
