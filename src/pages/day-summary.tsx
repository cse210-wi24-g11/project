import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { EDIT_ENTRY_ROUTE } from '@/routes.ts'
import {
  DAY_SUMMARY_SESSIONSTORAGE_KEY,
  date2SessionStorageStr,
  sessionStorageStr2Date,
} from '@/utils/summary.ts'
import { useQuery } from '@/db/index.ts'
import { getResolvedEntriesForDate, updateSettings } from '@/db/actions.ts'
import { type ExpandedEntry } from '@/db/utils.ts'

import { MainNavBar } from '@/components/navigation/main-navbar.tsx'
import { SummaryBar } from '@/components/navigation/summary-bar.tsx'
import { MoodEntryList } from '@/components/mood-entry-list/mood-entry-list.tsx'
import { DayPicker } from '@/components/DayPicker/DayPicker.tsx'
import background from '@/assets/background.png'
interface DaySummaryPageProps {
  day?: Date
}

export function DaySummary({ day }: DaySummaryPageProps) {
  const navigate = useNavigate()

  useEffect(() => {
    void updateSettings({ lastVisited: 'day' })
  }, [])

  const [today, setToday] = useState<Date>(() => {
    const saved = sessionStorage?.getItem?.(DAY_SUMMARY_SESSIONSTORAGE_KEY)
    if (!saved) {
      return day ?? new Date()
    } else {
      return sessionStorageStr2Date(saved)
    }
  })

  useEffect(() => {
    sessionStorage.setItem(
      DAY_SUMMARY_SESSIONSTORAGE_KEY,
      date2SessionStorageStr(today),
    )
  }, [today])

  const [todayEntries] = useQuery(
    () => getResolvedEntriesForDate(today),
    [today],
    [] as ExpandedEntry[],
  )

  return (
    <div style={{backgroundImage: `url(${background})`, backgroundSize: '100vw 100vh'}} className="flex h-screen flex-col">
      <SummaryBar />
      <div className="fixed left-0 right-0 top-10 border pb-2 pt-2">
        <DayPicker
          initialDay={today}
          onChangeDay={(day: Date) => {
            setToday(day)
          }}
        />
      </div>
      <div className="mt-24 flex-grow overflow-y-auto px-8 pb-16">
        <MoodEntryList
          entries={todayEntries}
          onClickEntry={(entry) => {
            navigate(EDIT_ENTRY_ROUTE(entry.id))
          }}
        />
      </div>
      <MainNavBar />
    </div>
  )
}
