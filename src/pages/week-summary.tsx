import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { EDIT_ENTRY_ROUTE } from '@/routes.ts'
import { getResolvedEntriesForDate, updateSettings } from '@/db/actions.ts'
import { ExpandedEntry } from '@/db/utils.ts'
import { useAsyncMemo } from '@/hooks/use-async-memo.ts'
import {
  getDatesInWeek,
  get1stDayInWeek,
  sessionStorageStr2Date,
  date2SessionStorageStr,
  WEEK_SUMMARY_SESSIONSTORAGE_KEY,
} from '@/utils/summary.ts'

import { WeekPicker } from '@/components/WeekPicker/WeekPicker.tsx'
import { MoodEntryList } from '@/components/mood-entry-list/mood-entry-list.tsx'
import { MainNavBar } from '@/components/navigation/main-navbar.tsx'
import { SummaryBar } from '@/components/navigation/summary-bar.tsx'

export function WeekSummary() {
  const navigate = useNavigate()

  useEffect(() => {
    void updateSettings({ lastVisited: 'week' })
  }, [])

  const [startDay, setStartDay] = useState<Date>(() => {
    const saved = sessionStorage?.getItem?.(WEEK_SUMMARY_SESSIONSTORAGE_KEY)
    if (!saved) {
      return get1stDayInWeek(new Date())
    } else {
      return sessionStorageStr2Date(saved)
    }
  })

  useEffect(() => {
    sessionStorage.setItem(
      WEEK_SUMMARY_SESSIONSTORAGE_KEY,
      date2SessionStorageStr(startDay),
    )
  }, [startDay])

  const expandedEntries = useAsyncMemo(
    async () => {
      const daysInWeek = getDatesInWeek(startDay)
<<<<<<< HEAD
      for (const day of daysInWeek) {
        const entries = (await getEntriesOfDate(db, day)) ?? []
        for (const entry of entries) {
          const mood = await getMoodById(db, entry.moodId)
          records.push({
            id: entry.id,
            day: entry.timestamp,
            title: entry.description,
            color: d3.rgb(mood?.color ?? 'blue'),
            imagePath: URL.createObjectURL(mood!.image),
          })
        }
      }
      setRecords(records)
    }

    void run()
  }, [startDay, getDb])
=======
      const entries = await Promise.all(
        daysInWeek.map(getResolvedEntriesForDate),
      )
      return entries.flat()
    },
    [startDay],
    [] as ExpandedEntry[],
  )
>>>>>>> main

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
          entries={expandedEntries}
          onClickEntry={(entry) => {
            navigate(EDIT_ENTRY_ROUTE(entry.id))
          }}
        />
      </div>
      <MainNavBar />
    </div>
  )
}
