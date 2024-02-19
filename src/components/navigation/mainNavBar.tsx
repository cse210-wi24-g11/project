import { useState } from 'react'

import calendarIcon from '../../assets/icons/calendar.png'
import plusIcon from '../../assets/icons/plus.png'
import settingIcon from '../../assets/icons/setting.png'

export function MainNavBar() {
  const [selectedButton, setSelectedButton] = useState<string>('Calendar')
  const buttonStyle = (button: string) => {
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
          className={buttonStyle('Calendar')}
          onClick={() => setSelectedButton('Calendar')}
        >
          <img src={calendarIcon} alt="calendar" />
        </button>
        <button
          className={buttonStyle('Add')}
          onClick={() => setSelectedButton('Add')}
        >
          <img src={plusIcon} alt="add mood" />
        </button>
        <button
          className={buttonStyle('Settings')}
          onClick={() => setSelectedButton('Settings')}
        >
          <img src={settingIcon} alt="settings" />
        </button>
      </div>
    </div>
  )
}
