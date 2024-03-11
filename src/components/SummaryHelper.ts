import * as d3 from 'd3'
import { RGBColor } from 'd3'

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

export const MaxMoodValue = 5

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

export function getMonthAbbr(date: Date): string {
  return abbr[date.getMonth()] + ' ' + date.getFullYear()
}

export function getDateAbbr(date: Date): string {
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

export function get1stDayOfPrevMonth(date: Date): Date {
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
