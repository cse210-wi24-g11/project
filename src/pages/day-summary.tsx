import { useLocation, useNavigate } from 'react-router-dom'

import { MainNavBar } from '@/components/navigation/main-navbar.tsx'
import { SummaryBar } from '@/components/navigation/summary-bar.tsx'
import { useEffect, useState } from 'react'
import {
  setEntryList,
  getDateAbbr,
  getMoodOfDate,
  SummaryMoodRecord,
} from '@/components/SummaryHelper.ts'
import MoodListItem from '@/components/MoodItem/MoodItem.tsx'
import { DatePicker, ListBox, Item, Flex } from '@adobe/react-spectrum'
import { OverlayContainer } from '@react-aria/overlays'
import { CalendarDate, getLocalTimeZone } from '@internationalized/date'
import { SummaryNavbarItem } from '@/components/navigation/summary-bar.tsx'
import { useDb } from '@/context/db.tsx'
import * as d3 from 'd3'
import { RGBColor } from 'd3'
import { Provider } from '@react-spectrum/provider'
import MoodEntryList from '@/components/MoodEntryList/MoodEntryList.tsx'

// import DaySummaryPage from "@/pages/DaySummaryPage.tsx";

interface DaySummaryPageProps {
  day?: Date
  summaryNavBarItem: SummaryNavbarItem
}

const date2CalendarDate = (date: Date) => {
  return new CalendarDate(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  )
}

const DaySummary = (props: DaySummaryPageProps) => {
  const { getDb } = useDb()
  const navigate = useNavigate()
  const location = useLocation()
  const { day, summaryNavBarItem } = props
  const [today, setToday] = useState<Date>(day ?? new Date())
  const [dpDate, setDpDate] = useState(date2CalendarDate(day ?? new Date()))
  const [listItems, setListItems] = useState<SummaryMoodRecord[]>([])

  useEffect(() => {
    const cd = date2CalendarDate(today)
    setDpDate(cd)

    async function run() {
      const db = await getDb()
      setEntryList(db, today, (entries: SummaryMoodRecord[]) =>
        setListItems(entries),
      )
    }

    void run()
    // setListItems(getMoodOfDate(today));
  }, [today])

  // async function setEntryList(date: Date, setList: (entries: SummaryMoodRecord[]) => void) {
  //   const db = await getDb()
  //
  //   // read all entry id of given date.
  //   const dayKey = getEntryDateKey(date)
  //   const idReq = db
  //     .transaction('dateCollection', 'readonly')
  //     .objectStore('dateCollection')
  //     .get(dayKey)
  //
  //   idReq.onsuccess = () => {
  //     // read all entries with given ids.
  //     const entries = idReq.result // TODO: check id type.
  //     console.log(`db find ${dayKey}:`, entries)
  //     if (entries === undefined) {
  //       setListItems([])
  //       return
  //     }
  //
  //     Promise.all(
  //       entries.map((entry: TempEntry) => {
  //         // TODO: change type
  //         return new Promise((resolve) => {
  //           const moodReq = db
  //             .transaction('mood')
  //             .objectStore('mood')
  //             .get(entry.moodId)
  //           moodReq.onsuccess = () => {
  //             const color: string = moodReq.result.color
  //             console.log('moodId:', entry.moodId, 'result:', moodReq.result)
  //             const temp: SummaryMoodRecord = {
  //               id: entry.id,
  //               day: entry.timestamp,
  //               title: entry.description,
  //               color: d3.rgb(color), // TODO: add image
  //             }
  //             resolve(temp)
  //           }
  //         })
  //       }),
  //     ).then((resArr: SummaryMoodRecord[]) => {
  //       console.log('all db read', resArr)
  //       // setListItems(resArr)
  //       setList(resArr)
  //     })
  //   }
  // }

  const buildList = () => {
    if (listItems.length == 0) {
      return (
        <div className="fixed left-0 h-full w-full">
          <p className="mt-20 text-4xl text-gray-400">No Data</p>
        </div>
      )
    }
    return (
      <div className="ml-8 mr-8">
        <ul className="left-8 right-8 mt-0 scroll-auto bg-white">
          {/*<ul className="left-0 mt-0 w-full bg-white scroll-auto">*/}
          {listItems.map((item, index) => (
            <li className="left-0 right-0 my-4" key={item.id}>
              <MoodListItem
                imageUrl={'TODO'} // TODO: fix
                title={item.title}
                date={item.day}
                color={item.color}
                recordId={item.id.toString()} // TODO: type of id?
                onClick={(recordId: string) => {
                  // TODO: type of id?
                  console.log(`Go to entry edit page ${recordId}`)
                  navigate('/UpdateMood', { state: { id: recordId } }) // TODO: give id
                }}
              />
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div>
      <SummaryBar summaryNavBarItem={summaryNavBarItem} />
      <div className="fixed left-0 right-0 top-10 flex flex-row border bg-white">
        <div className="mb-2 ml-8 mt-2">
          <Provider locale="en">
            <DatePicker
              aria-label="Date Picker"
              value={dpDate}
              onChange={(d: CalendarDate) => {
                setToday(d.toDate(getLocalTimeZone()))
              }}
            />
          </Provider>
        </div>
      </div>
      <div className="w-full bg-white">
        <div className="fixed bottom-20 left-0 right-0 top-24 overflow-y-auto">
          {buildList()}
        </div>
      </div>
      <MainNavBar />
    </div>
  )
}

export default DaySummary
