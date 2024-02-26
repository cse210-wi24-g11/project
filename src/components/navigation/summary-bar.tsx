import { useState } from 'react'

export function SummaryBar() {
  type SummaryNavbarItem = 'Day' | 'Week' | 'Month'

  const [selectedButton, setSelectedButton] = useState<SummaryNavbarItem>('Day')
  const buttonStyle = (button: SummaryNavbarItem) => {
    if (button === selectedButton) {
      return 'rounded-3xl border w-1/3 bg-blue-500 text-white hover:border-blue-500'
    } else {
      return 'rounded-3xl border w-1/3 bg-white hover:bg-gray-200 text-slate-500 hover:border-gray-200'
    }
  }

  return (
    <div className="w-full bg-white">
      <div className="fixed left-0 top-10 w-full flex-row rounded-3xl border bg-white">
        <button
          className={buttonStyle('Day')}
          onClick={() => setSelectedButton('Day')}
        >
          Day
        </button>
        <button
          className={buttonStyle('Week')}
          onClick={() => setSelectedButton('Week')}
        >
          Week
        </button>
        <button
          className={buttonStyle('Month')}
          onClick={() => setSelectedButton('Month')}
        >
          Month
        </button>
      </div>
    </div>
  )
}
