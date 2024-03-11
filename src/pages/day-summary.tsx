import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import * as d3 from 'd3'

import { UPDATE_MOOD_ROUTE } from '@/routes.ts'
import {
  date2sessionStr,
  sessionStr2date,
  SummaryMoodRecord,
} from '@/components/SummaryHelper.ts'
import { getEntriesOfDate, getMoodById } from '@/utils/db.ts'

import { MainNavBar } from '@/components/navigation/main-navbar.tsx'
import { SummaryBar } from '@/components/navigation/summary-bar.tsx'
import { SummaryNavbarItem } from '@/components/navigation/summary-bar.tsx'
import { useDb } from '@/context/db.tsx'
import MoodEntryList from '@/components/MoodEntryList/MoodEntryList.tsx'
import DayPicker from '@/components/DayPicker/DayPicker.tsx'

interface DaySummaryPageProps {
  day?: Date
  summaryNavBarItem: SummaryNavbarItem
}

const DAY_SUMMARY_KEY = 'day_summary'

const DaySummary = ({ day, summaryNavBarItem }: DaySummaryPageProps) => {
  const { getDb } = useDb()
  const navigate = useNavigate()
  // const location = useLocation()
  const [today, setToday] = useState<Date>(() => {
    const saved = sessionStorage.getItem(DAY_SUMMARY_KEY)
    if (!saved) {
      return day ?? new Date()
    } else {
      return sessionStr2date(saved)
    }
  })
  const [listItems, setListItems] = useState<SummaryMoodRecord[]>([])

  useEffect(() => {
    sessionStorage.setItem(DAY_SUMMARY_KEY, date2sessionStr(today))

    async function run() {
      const db = await getDb()
      const entries = (await getEntriesOfDate(db, today)) ?? []
      const records = Array<SummaryMoodRecord>()
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
      setListItems(records)
    }

    void run()
  }, [today, getDb])

  return (
    <div className="flex h-screen flex-col">
      <SummaryBar summaryNavBarItem={summaryNavBarItem} />
      <div className="fixed left-0 right-0 top-10 border bg-white pb-2 pt-2">
        <DayPicker
          day={today}
          onChangeDay={(day: Date) => {
            setToday(day)
          }}
        />
      </div>
      <div className="mt-24 flex-grow overflow-y-auto bg-white px-8 pb-16">
        <MoodEntryList
          records={listItems}
          onClickRecord={(record: SummaryMoodRecord) => {
            navigate(UPDATE_MOOD_ROUTE, { state: { id: record.id } })
          }}
        />
      </div>
      <MainNavBar />
    </div>
  )
}

export default DaySummary
