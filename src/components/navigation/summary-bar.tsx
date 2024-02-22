import { useState } from 'react'

export function SummaryBar() {
  enum SummaryButton {
    Day = 'Day',
    Week = 'Week',
    Month = 'Month',
  }

  const [selectedButton, setSelectedButton] = useState<SummaryButton>(
    SummaryButton.Day,
  )
  const buttonStyle = (button: SummaryButton) => {
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
          className={buttonStyle(SummaryButton.Day)}
          onClick={() => setSelectedButton(SummaryButton.Day)}
        >
          Day
        </button>
        <button
          className={buttonStyle(SummaryButton.Week)}
          onClick={() => setSelectedButton(SummaryButton.Week)}
        >
          Week
        </button>
        <button
          className={buttonStyle(SummaryButton.Month)}
          onClick={() => setSelectedButton(SummaryButton.Month)}
        >
          Month
        </button>
      </div>
    </div>
  )
}
