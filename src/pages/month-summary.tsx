import React, { useEffect, useState } from 'react'

import ICalendar from '@/components/ICalendar/ICalendar.tsx'
import {
  SummaryDayMoodRecord,
  getRecordsInRange,
  getDateAbbr,
  getDatesInMonth,
} from '@/components/SummaryHelper.ts'
import MoodEntryList from '@/components/MoodEntryList/MoodEntryList.tsx'
import MonthSummaryGraph from '@/components/MonthSummaryGraph/MonthSummaryGraph.tsx'
import { MainNavBar } from '@/components/navigation/main-navbar.tsx'
import { SummaryBar } from '@/components/navigation/summary-bar.tsx'
import { SummaryNavbarItem } from '@/components/navigation/summary-bar.tsx'

type MonthSummaryProps = {
  summaryNavBarItem: SummaryNavbarItem
}

// class MonthSummary extends React.Component {
const MonthSummary = ({ summaryNavBarItem }: MonthSummaryProps) => {
  const [startDay, setStartDay] = useState(new Date())
  const [records, setRecords] = useState<Array<SummaryDayMoodRecord>>([])

  const goToDaySummaryPage = (day: Date) => {
    console.log('Go to day summary page', day)
  }

  useEffect(() => {
    const records = getRecordsInRange(getDatesInMonth(startDay))
    setRecords(records)
  }, [startDay])

  return (
    <>
      <SummaryBar summaryNavBarItem={summaryNavBarItem} />
      <div>
        <MonthSummaryGraph
          records={records}
          onRenderStart={() => {}}
          onRenderEnd={() => {}}
        />
        <ICalendar
          monthStartDay={startDay}
          onClickDay={goToDaySummaryPage}
          onChangeMonth={(startDay: Date) => {
            setStartDay(startDay)
          }}
        />
        {/*<MoodEntryList*/}
        {/*  records={records}*/}
        {/*  onClickRecord={(r: SummaryDayMoodRecord) => goToDaySummaryPage(r.day)}*/}
        {/*/>*/}
      </div>
      <MainNavBar />
    </>
  )
}

export default MonthSummary
