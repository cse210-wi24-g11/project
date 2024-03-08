import React, { useState, useEffect } from 'react'

import {
  SummaryMoodRecord,
  getDatesInMonth,
  getRecordsInRange,
  getDateAbbr, getDatesInWeek, get1stDayInWeek,
} from '@/components/SummaryHelper.ts'
import WeekSummaryGraph from '@/components/WeekSummaryGraph/WeekSummaryGraph.tsx'
import WeekPicker from '@/components/WeekPicker/WeekPicker.tsx'
import MoodEntryList from '@/components/MoodEntryList/MoodEntryList.tsx'

import { MainNavBar } from '@/components/navigation/main-navbar.tsx'
import { SummaryBar } from '@/components/navigation/summary-bar.tsx'
import { SummaryNavbarItem } from '@/components/navigation/summary-bar.tsx'

type WeekSummaryProps = {
  summaryNavBarItem: SummaryNavbarItem
}

const WeekSummary = ({ summaryNavBarItem }: WeekSummaryProps) => {
  const [startDay, setStartDay] = useState(get1stDayInWeek(new Date()))
  const [records, setRecords] = useState<SummaryMoodRecord[]>([])

  useEffect(() => {
    const records = getRecordsInRange(getDatesInWeek(startDay))
    setRecords(records)
  }, [startDay])

  const onClickRecord = (record: SummaryMoodRecord) => {
    console.log('Click on record', record)
    // TODO: go to day page.
  }

  return (
    <>
      <SummaryBar summaryNavBarItem={summaryNavBarItem} />
      <div>
        {/*<WeekSummaryGraph records={records} />*/}
        <WeekPicker
          startDay={startDay}
          onChangeWeek={(startDay: Date) => {
            setStartDay(startDay)
          }}
        />
        {}
      </div>
      <MainNavBar />
    </>
  )
}

export default WeekSummary
