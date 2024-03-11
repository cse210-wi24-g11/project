import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as d3 from 'd3'

import {
  SummaryMoodRecord,
  getDatesInWeek,
  get1stDayInWeek,
  sessionStr2date,
  date2sessionStr,
} from '@/components/SummaryHelper.ts'
import { getEntriesOfDate, getMoodById } from '@/utils/db.ts'
import { updateSettingsInDb } from '@/utils/db.ts'
import { EDIT_MOOD_ROUTE } from '@/routes.ts'

import WeekPicker from '@/components/WeekPicker/WeekPicker.tsx'
import MoodEntryList from '@/components/MoodEntryList/MoodEntryList.tsx'
import { MainNavBar } from '@/components/navigation/main-navbar.tsx'
import { SummaryBar } from '@/components/navigation/summary-bar.tsx'
import { useDb } from '@/context/db.tsx'

const WEEK_SUMMARY_KEY = 'week_summary'

function WeekSummary() {
  const { getDb } = useDb()
  const navigate = useNavigate()

  const [startDay, setStartDay] = useState<Date>(() => {
    const saved = sessionStorage?.getItem?.(WEEK_SUMMARY_KEY)
    if (!saved) {
      return get1stDayInWeek(new Date())
    } else {
      return sessionStr2date(saved)
    }
  })
  const [records, setRecords] = useState<SummaryMoodRecord[]>([])

  useEffect(() => {
    async function updateLastVisited() {
      const db = await getDb()
      updateSettingsInDb(db, { lastVisited: 'week' })
    }

    void updateLastVisited()
  }, [getDb])

  useEffect(() => {
    sessionStorage.setItem(WEEK_SUMMARY_KEY, date2sessionStr(startDay))

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
            color: d3.rgb(mood?.color ?? 'blue'),
            imagePath: mood?.imagePath ?? 'https://i.imgur.com/yXOvdOSs.jpg', // TODO: remove link
          })
        }
      }
      setRecords(records)
    }

    void run()
  }, [startDay, getDb])

  return (
    <div className="flex h-screen flex-col">
      <SummaryBar />
      <div className="fixed left-0 right-0 top-10 border bg-white pb-2 pt-2">
        <WeekPicker
          startDay={startDay}
          onChangeWeek={(startDay: Date) => {
            setStartDay(startDay)
          }}
        />
      </div>
      <div className="mt-24 flex-grow overflow-y-auto bg-white px-8 pb-16">
        <MoodEntryList
          records={records}
          onClickRecord={(record: SummaryMoodRecord) => {
            navigate(EDIT_MOOD_ROUTE, { state: { id: record.id } })
          }}
        />
      </div>
      <MainNavBar />
    </div>
  )
}

export default WeekSummary
