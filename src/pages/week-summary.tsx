import React, { useState, useEffect } from 'react'

import {
  SummaryMoodRecord,
  getDatesInWeek,
  get1stDayInWeek,
} from '@/components/SummaryHelper.ts'
import WeekPicker from '@/components/WeekPicker/WeekPicker.tsx'
import MoodEntryList from '@/components/MoodEntryList/MoodEntryList.tsx'

import { MainNavBar } from '@/components/navigation/main-navbar.tsx'
import { SummaryBar } from '@/components/navigation/summary-bar.tsx'
import { SummaryNavbarItem } from '@/components/navigation/summary-bar.tsx'
import * as d3 from 'd3'
import { useDb } from '@/context/db.tsx'
import { useNavigate } from 'react-router-dom'
import { getEntriesOfDate, getMoodById } from '@/utils/db.ts'
import { UPDATE_MOOD_ROUTE } from '@/routes.ts'

type WeekSummaryProps = {
  summaryNavBarItem: SummaryNavbarItem
}

const WeekSummary = ({ summaryNavBarItem }: WeekSummaryProps) => {
  const { getDb } = useDb()
  const navigate = useNavigate()

  const [startDay, setStartDay] = useState(get1stDayInWeek(new Date()))
  const [records, setRecords] = useState<SummaryMoodRecord[]>([])

  useEffect(() => {
    async function run() {
      const db = await getDb()
      const records = Array<SummaryMoodRecord>()
      const daysInWeek = getDatesInWeek(startDay)
      for (const day of daysInWeek) {
        const entries = (await getEntriesOfDate(db, day)) ?? []
        for (const entry of entries) {
          const mood = await getMoodById(db, entry.moodId)
          records.push({
            id: entry.id,
            day: entry.timestamp,
            title: entry.description,
            color: d3.rgb(mood ? mood.color : 'blue'),
          })
        }
      }
      setRecords(records)
    }

    void run()
  }, [startDay])

  return (
    <>
      <SummaryBar summaryNavBarItem={summaryNavBarItem} />
      <div className="fixed left-0 right-0 top-10 border bg-white pb-2 pt-2">
        <WeekPicker
          startDay={startDay}
          onChangeWeek={(startDay: Date) => {
            setStartDay(startDay)
          }}
        />
      </div>
      <div className="w-full bg-white">
        <div className="fixed bottom-20 left-8 right-8 top-24 overflow-y-auto">
          <MoodEntryList
            records={records}
            onClickRecord={(record: SummaryMoodRecord) => {
              navigate(UPDATE_MOOD_ROUTE, { state: { id: record.id } })
            }}
          />
        </div>
      </div>
      <MainNavBar />
    </>
  )
}

export default WeekSummary
