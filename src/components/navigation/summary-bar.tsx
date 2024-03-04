import { useState } from 'react'

type SummaryNavbarItem = 'Day' | 'Week' | 'Month'

export function SummaryBar() {
  const [selectedButton, setSelectedButton] = useState<SummaryNavbarItem>('Day')
  const buttonGeneralStyle = 'w-1/3 bg-white rounded-none mb-[-2px]'
  const buttonSelectStyle = (button: SummaryNavbarItem) => {
    if (button === selectedButton) {
      return `${buttonGeneralStyle} blue-500 text-blue-500 border-b-4 border-b-blue-500`
    } else {
      return `${buttonGeneralStyle} slate-500 text-slate-500`
    }
  }

  return (
    <div className="w-full bg-white">
      <div className="fixed left-0 top-10 w-full flex-row border-b-2 bg-white px-2">
        <button
          className={buttonSelectStyle('Day')}
          onClick={() => setSelectedButton('Day')}
        >
          Day
        </button>
        <button
          className={buttonSelectStyle('Week')}
          onClick={() => setSelectedButton('Week')}
        >
          Week
        </button>
        <button
          className={buttonSelectStyle('Month')}
          onClick={() => setSelectedButton('Month')}
        >
          Month
        </button>
      </div>
    </div>
  )
}
