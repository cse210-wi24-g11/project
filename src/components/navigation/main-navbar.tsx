import { useState } from 'react'
import { ReactSVG } from 'react-svg'

import calendarIcon from '../../assets/icons/calendar.svg'
import plusIcon from '../../assets/icons/plus.svg'
import settingIcon from '../../assets/icons/setting.svg'

type NavbarItem = 'calendar' | 'add' | 'settings'

export function MainNavBar() {
  const [selectedButton, setSelectedButton] = useState<NavbarItem>('calendar')
  const generalButtonStyle =
    'rounded-none my-2 border w-1/3 flex items-center justify-center'
  const selectedButtonStyle = (button: NavbarItem) => {
    if (button === selectedButton) {
      return `${generalButtonStyle} bg-blue-100`
    } else {
      return `${generalButtonStyle} bg-white`
    }
  }

  return (
    <div className="w-full bg-white">
      <div className="fixed bottom-0 left-0 flex w-full border bg-white">
        <button
          className={selectedButtonStyle('calendar')}
          onClick={() => setSelectedButton('calendar')}
        >
          <ReactSVG
            src={calendarIcon}
            beforeInjection={(svg) => {
              svg.setAttribute('style', 'width: 35px; height: 35px')
              svg.setAttribute(
                'fill',
                selectedButton === 'calendar' ? '#3B82F6' : 'black',
              )
            }}
          />
        </button>
        <button
          className={selectedButtonStyle('add')}
          onClick={() => setSelectedButton('add')}
        >
          <ReactSVG
            src={plusIcon}
            beforeInjection={(svg) => {
              svg.setAttribute('style', 'width: 35px; height: 35px')
              svg.setAttribute(
                'stroke',
                selectedButton === 'add' ? '#3B82F6' : 'black',
              )
            }}
          />
        </button>
        <button
          className={selectedButtonStyle('settings')}
          onClick={() => setSelectedButton('settings')}
        >
          <ReactSVG
            src={settingIcon}
            beforeInjection={(svg) => {
              svg.setAttribute('style', 'width: 35px; height: 35px')
              svg.setAttribute(
                'stroke',
                selectedButton === 'settings' ? '#3B82F6' : 'black',
              )
            }}
          />
        </button>
      </div>
    </div>
  )
}
