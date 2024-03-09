import * as d3 from 'd3'
import { RGBColor } from 'd3'

import { ExpandedEntry, serializeDateForEntry } from '@/db/utils.ts'
import imagePlaceholderUrl from '@/assets/No-Image-Placeholder.png'

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
  imagePath: string
}

export const MAX_MOOD_VALUE = 5

export function displayMonthYear(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export function displayMonthDay(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function displayTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: '2-digit' })
}

export function displayMonthDayYear(date: Date): string {
  return `${displayMonthDay(date)} ${date.getFullYear()}`
}

export function date2SessionStorageStr(date: Date): string {
  return `${date.getFullYear()}.${date.getMonth()}.${date.getDate()}`
}

export function sessionStorageStr2Date(str: string): Date {
  const date = new Date()
  try {
    const [y, m, d] = str.split('.').map(Number)
    date.setFullYear(y)
    date.setMonth(m)
    date.setDate(d)
  } catch (e) {
    console.error('error parsing sessionstorage date string', e)
  }
  date.setHours(0)
  date.setMinutes(0)
  date.setSeconds(0)
  date.setMilliseconds(0)
  return date
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

export function inSameMonth(d1: Date, d2: Date): boolean {
  return d1.getFullYear() == d2.getFullYear() && d1.getMonth() == d2.getMonth()
}

export function inSameDay(d1: Date, d2: Date): boolean {
  return inSameMonth(d1, d2) && d1.getDate() == d2.getDate()
}

export function get1stDayInMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function get1stDayOfNextMonth(date: Date): Date {
  const newDate = new Date(date)
  let month = newDate.getMonth()
  let year = newDate.getFullYear()
  month++
  if (month > 11) {
    month = 0
    year++
  }
  newDate.setFullYear(year, month, 1)
  return newDate
}

export function getFirstDayOfPrevMonth(date: Date): Date {
  const newDate = new Date(date)
  let month = newDate.getMonth()
  let year = newDate.getFullYear()
  month--
  if (month < 0) {
    month = 11
    year--
  }
  newDate.setFullYear(year, month, 1)
  return newDate
}

export function getPrevMonthDatesInCalendar(date: Date): Date[] {
  const firstDay = get1stDayInMonth(date)
  const dayOfWeek = firstDay.getDay()
  if (dayOfWeek == 0) {
    return []
  }
  const lastDayOfLastMonth = new Date(date.getFullYear(), date.getMonth(), 0)
  const lastWeekStartDate = new Date(lastDayOfLastMonth)
  lastWeekStartDate.setDate(
    lastDayOfLastMonth.getDate() - ((dayOfWeek + 6) % 7),
  )
  const lastDays: Date[] = []
  while (lastWeekStartDate <= lastDayOfLastMonth) {
    lastDays.push(new Date(lastWeekStartDate))
    lastWeekStartDate.setDate(lastWeekStartDate.getDate() + 1)
  }
  return lastDays
}

export function getNextMonthDatesInCalendar(date: Date): Date[] {
  const nextMonth1stDay = get1stDayOfNextMonth(date)
  const dayOfWeek = nextMonth1stDay.getDay()
  if (dayOfWeek == 0) {
    return []
  }
  const res: Date[] = []
  const num = 7 - dayOfWeek
  for (let i = 0; i < num; i++) {
    res.push(new Date(nextMonth1stDay))
    nextMonth1stDay.setDate(nextMonth1stDay.getDate() + 1)
  }
  return res
}

export function mockEntriesOnDate(date: Date, n: number = 10): ExpandedEntry[] {
  return Array.from({ length: n }, (_, i) => ({
    id: (i + 100 * date.getDay()).toString(),
    timestamp: date,
    date: serializeDateForEntry(date),
    description: 'Day ' + date.getDate() + ' is good.',
    mood: {
      id: `mood-${i + 100 * date.getDay()}`,
      color: mockMoodColors[Math.floor(Math.random() * 6)].toString(),
      imageUrl: imagePlaceholderUrl,
    },
  }))
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
  if (avgMood > (MAX_MOOD_VALUE / 3) * 2) {
    return 'Seems that you are quite happy these days!'
  } else if (avgMood > MAX_MOOD_VALUE / 3) {
    return 'Being ordinary is just a part of life.'
  } else {
    return "Don't worry, things will get better soon!"
  }
}
