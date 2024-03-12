import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import * as d3 from 'd3'

import { EDIT_MOOD_ROUTE } from '@/routes.ts'
import {
  date2sessionStr,
  sessionStr2date,
  SummaryMoodRecord,
} from '@/utils/summary.ts'
import { getEntriesOfDate, getMoodById } from '@/utils/db.ts'
import { updateSettingsInDb } from '@/utils/db.ts'

import { useDb } from '@/context/db.tsx'
import { MainNavBar } from '@/components/navigation/main-navbar.tsx'
import { SummaryBar } from '@/components/navigation/summary-bar.tsx'
import { MoodEntryList } from '@/components/MoodEntryList/MoodEntryList.tsx'
import { DayPicker } from '@/components/DayPicker/DayPicker.tsx'

interface DaySummaryPageProps {
  day?: Date
}

const DAY_SUMMARY_KEY = 'day_summary'

export function DaySummary({ day }: DaySummaryPageProps) {
  const { getDb } = useDb()
  const navigate = useNavigate()
  // const location = useLocation()
  const [today, setToday] = useState<Date>(() => {
    const saved = sessionStorage?.getItem?.(DAY_SUMMARY_KEY)
    if (!saved) {
      return day ?? new Date()
    } else {
      return sessionStr2date(saved)
    }
  })
  const [listItems, setListItems] = useState<SummaryMoodRecord[]>([])

  useEffect(() => {
    async function updateLastVisited() {
      const db = await getDb()
      updateSettingsInDb(db, { lastVisited: 'day' })
    }

    void updateLastVisited()
  }, [getDb])

  useEffect(() => {
    sessionStorage.setItem(DAY_SUMMARY_KEY, date2sessionStr(today))

    async function run() {
      const db = await getDb()
      const entries = (await getEntriesOfDate(db, today)) ?? []
      const records = Array<SummaryMoodRecord>()
      for (const entry of entries) {
        const mood = await getMoodById(db, entry.moodId)
        const imagePath = mood && mood.image ? URL.createObjectURL(mood.image) : '';
        records.push({
          id: entry.id,
          day: entry.timestamp,
          title: entry.description,
          color: d3.rgb(mood?.color ?? 'blue'),
          imagePath: imagePath,
        })
      }
      records.sort((a, b) => new Date(b.day).getTime() - new Date(a.day).getTime());
      setListItems(records)
    }

    void run()
  }, [today, getDb])

  return (
    <div className="flex h-screen flex-col">
      <SummaryBar />
      <div className="fixed left-0 right-0 top-10 border bg-white pb-2 pt-2">
        <DayPicker
          initialDay={today}
          onChangeDay={(day: Date) => {
            setToday(day)
          }}
        />
      </div>
      <div className="mt-24 flex-grow overflow-y-auto bg-white px-8 pb-16">
        <MoodEntryList
          records={listItems}
          onClickRecord={(record: SummaryMoodRecord) => {
            navigate(EDIT_MOOD_ROUTE, { state: { id: record.id } })
          }}
        />
      </div>
      <MainNavBar />
    </div>
  )
}
