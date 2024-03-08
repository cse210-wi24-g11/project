import React from 'react'

interface WeekPickerProps {
  startDay: Date
  onChangeWeek: (startDay: Date) => void
}

interface DatePickerBoxProps {
  time: string;
  onClick: () => void;
}

const DatePickerBox = ({ time, onClick }: DatePickerBoxProps) => {
  return (
    <div className="rounded-md border h-10 w-40 border-gray-500 flex flex-row items-center justify-center">
      <p>{time}</p>
    </div>
  )
}

const WeekPicker = (props: WeekPickerProps) => {
  const { onChangeWeek } = props
  return (
    <div className="fixed top-10 left-0 right-0 bg-white border pl-8 pt-2 pb-2">
      {/*<p>Week Picker</p>*/}
      <DatePickerBox time="Fed 2" onClick={() => console.log('Box clicked')} />
    </div>
  )
}

export default WeekPicker
