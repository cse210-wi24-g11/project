import * as d3 from 'd3'
import { RGBColor } from 'd3'
import { useDb } from '@/context/db.tsx'
import {DbRecord, getEntryDateKey} from "@/utils/db.ts";

export interface SummaryDayMoodRecord {
  id: number
  day: Date
  title: string
  value: number
  color: RGBColor
}

export interface SummaryMoodRecord {
  id: string
  day: Date
  title: string
  color: RGBColor
}

export interface TempMood {
  id: string
  color: string
  image: Blob
}

export const MaxMoodValue = 5

export function getDateAbbr(date: Date): string {
  const abbr = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  return abbr[date.getMonth()] + ' ' + date.getDate()
}

export function getTimeAbbr(date: Date): string {
  let s = date.getHours().toString() + '::'
  const m = date.getMinutes()
  if (m < 10) {
    s += '0' + m.toString()
  } else {
    s += m.toString()
  }
  return s
}

export function getDatesInMonth(startDay: Date): Array<Date> {
  const date = new Date(startDay.getFullYear(), startDay.getMonth(), 1)
  const days = Array<Date>()
  while (date.getMonth() === startDay.getMonth()) {
    days.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }
  return days
}

export function getDatesInWeek(startDay: Date): Array<Date> {
  const days = Array<Date>()
  const date = new Date(startDay)
  for (let i = 0; i < 7; i++) {
    days.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }
  return days
}

export function get1stDayInWeek(date: Date): Date {
  const resultDate = new Date(date)
  const dayOfWeek = resultDate.getDay()
  resultDate.setDate(resultDate.getDate() - dayOfWeek)
  resultDate.setHours(0, 0, 0, 0)
  return resultDate
}

// TODO: fix
export function getRecordsInRange(dates: Date[]): SummaryDayMoodRecord[] {
  return dates.map((d, i) => {
    // const val = 0 + Math.floor(Math.random() * 3);
    const val = Math.floor(Math.random() * 6)
    return {
      id: i + 100 * d.getDay(),
      day: new Date(d),
      title: 'day ' + d.getDate(),
      value: val,
      color: mockMoodColors[val],
      // color: d3.color('steelblue'),
    }
  })
}

export function getMoodOfDate(date: Date): SummaryMoodRecord[] {
  // TODO: remove!
  return Array.from({ length: 10 }, (_, index) => ({
    id: index + 100 * date.getDay(),
    day: date,
    title: 'Day ' + date.getDate() + ' is good.',
    color: mockMoodColors[Math.floor(Math.random() * 6)],
  }))
}

// TODO: fix
export function getMoodLevel(record: SummaryDayMoodRecord): number {
  return Math.floor(Math.random() * 6)
}

const mockMoodColors = [
  d3.rgb('black'),
  d3.rgb('darkred'),
  d3.rgb('red'),
  d3.rgb('pink'),
  d3.rgb('lightsalmon'),
  d3.rgb('lightpink'),
]

export function getMoodDesc(records: SummaryDayMoodRecord[]): string {
  if (records.length == 0) {
    return 'No mood summary.'
  }
  const avgMood =
    records.reduce((acc, cur) => acc + cur.value, 0) / records.length
  if (avgMood > (MaxMoodValue / 3) * 2) {
    return 'Seems that you are quite happy these days!'
  } else if (avgMood > MaxMoodValue / 3) {
    return 'Being ordinary is just a part of life.'
  } else {
    return "Don't worry, things will get better soon!"
  }
}

export function setEntryList(
  db: IDBDatabase,
  date: Date,
  setList: (entries: SummaryMoodRecord[]) => void,
) {
  // read all entry id of given date.
  const dayKey = getEntryDateKey(date)
  const idReq = db
    .transaction('dateCollection', 'readonly')
    .objectStore('dateCollection')
    .get(dayKey)

  idReq.onsuccess = () => {
    // read all entries with given ids.
    const entries = idReq.result // TODO: check id type.
    // console.log(`db find ${dayKey}:`, entries)
    if (entries === undefined) {
      setList([])
      return
    }

    Promise.all(
      entries.map((entry: DbRecord<'entry'>) => {
        // TODO: change type
        return new Promise((resolve) => {
          const moodReq = db
            .transaction('mood')
            .objectStore('mood')
            .get(entry.moodId)
          moodReq.onsuccess = () => {
            const color: string = moodReq.result.color
            // console.log('moodId:', entry.moodId, 'result:', moodReq.result)
            const temp: SummaryMoodRecord = {
              id: entry.id,
              day: entry.timestamp,
              title: entry.description,
              color: d3.rgb(color), // TODO: add image
            }
            resolve(temp)
          }
        })
      }),
    ).then((resArr: SummaryMoodRecord[]) => {
      console.log('all entries of date', dayKey, ':', resArr)
      // setListItems(resArr)
      setList(resArr)
    })
  }
}
