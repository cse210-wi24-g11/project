import React from 'react'
import {
  SummaryDayMoodRecord,
  getDateAbbr,
} from '@/components/SummaryHelper.ts'

interface DayMoodListProps {
  records: SummaryDayMoodRecord[]
}

const DayMoodList = (props: DayMoodListProps) => {
  const { records } = props
  const entries = records.map((r) => (
    <li key={r.id}>
      {/*<img />*/}
      <p>
        <b>{getDateAbbr(r.day)}</b>
        <b>{r.title}</b>
      </p>
    </li>
  ))
  return (
    <div>
      <ul>{entries}</ul>
    </div>
  )
}

export default DayMoodList
