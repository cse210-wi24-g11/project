import React from 'react'

interface WeekPickerProps {
  startDay: Date
  onChangeWeek: (startDay: Date) => void
}

const WeekPicker = (props: WeekPickerProps) => {
  const { onChangeWeek } = props
  return <div></div>
}

export default WeekPicker
