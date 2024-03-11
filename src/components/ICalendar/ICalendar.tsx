import React, { useEffect, useState } from 'react'
import ChevronRight from '@spectrum-icons/workflow/ChevronRight'
import ChevronLeft from '@spectrum-icons/workflow/ChevronLeft'

import {
  get1stDayInMonth,
  getFirstDayOfPrevMonth,
  get1stDayOfNextMonth,
  getDatesInMonth,
  getMonthAbbr,
  getNextMonthDatesInCalendar,
  getPrevMonthDatesInCalendar,
  inSameDay,
  inSameMonth,
  get1stDayInWeek,
} from '@/utils/summary'
import { getEntryDateKey } from '@/utils/db.ts'
import { cls } from '@/utils/cls.ts'

interface CalendarGridProps {
  num: string
  date: Date
  inCurrentMonth: boolean
  selected: boolean
}

interface DayPickerCalendar {
  day: Date
  onSelectDay: (day: Date) => void
}

export function DayPickerCalendar({ day, onSelectDay }: DayPickerCalendar) {
  const [monthStart, setMonthStart] = useState<Date>(get1stDayInMonth(day))
  const [gridItems, setGridItems] = useState<CalendarGridProps[][]>([])

  useEffect(() => {
    const gridProps = genGridsInMonth(monthStart)
    if (inSameMonth(monthStart, day)) {
      for (const row of gridProps) {
        for (const item of row) {
          item.selected = inSameDay(item.date, day)
        }
      }
    }
    setGridItems(gridProps)
  }, [monthStart, day])

  const clickDay = (rowIndex: number, colIndex: number) => {
    if (gridItems.length <= rowIndex) {
      return
    }
    if (gridItems[rowIndex].length <= colIndex) {
      return
    }
    onSelectDay(gridItems[rowIndex][colIndex].date)
  }

  const dayItemStyle = (selected: boolean, inCurrentMonth: boolean) => {
    const base =
      'flex items-center justify-center h-full text-center align-middle border-2 rounded-md'
    const selectedStyle = 'text-blue-500 font-bold border-blue-500 bg-blue-100'
    const currMonthStyle = 'text-black border-white'
    const otherMonthStyle = 'text-gray-300 border-white'
    const conditional = selected
      ? selectedStyle
      : inCurrentMonth
        ? currMonthStyle
        : otherMonthStyle
    return cls(base, conditional)
  }

  const buildGrids = (data: CalendarGridProps[][]) => {
    return data.map((line: CalendarGridProps[], rowIndex: number) => {
      return (
        <div
          key={rowIndex}
          className="mt-2 flex flex-row justify-between rounded-md border-2 border-white bg-white font-mono"
        >
          {line.map((item: CalendarGridProps, colIndex: number) => {
            return (
              <div
                key={getEntryDateKey(item.date)}
                className="h-10 flex-1 flex-row items-center justify-center"
                onClick={() => {
                  clickDay(rowIndex, colIndex)
                }}
              >
                <p className={dayItemStyle(item.selected, item.inCurrentMonth)}>
                  {item.num}
                </p>
              </div>
            )
          })}
        </div>
      )
    })
  }

  return (
    <CalendarContainer
      monthStartDate={monthStart}
      onChangeMonth={(start: Date) => {
        if (inSameMonth(start, monthStart)) {
          return
        }
        setMonthStart(start)
      }}
      dayItems={buildGrids(gridItems)}
    />
  )
}

interface WeekPickerCalendarProps {
  weekStartDay: Date
  onSelectWeek: (start: Date) => void
}

export function WeekPickerCalendar({
  weekStartDay,
  onSelectWeek,
}: WeekPickerCalendarProps) {
  const [monthStart, setMonthStart] = useState<Date>(
    get1stDayInMonth(weekStartDay),
  )
  const [gridItems, setGridItems] = useState<CalendarGridProps[][]>([])

  useEffect(() => {
    const gridProps = genGridsInMonth(monthStart)
    if (
      inSameMonth(monthStart, weekStartDay) ||
      inSameDay(weekStartDay, get1stDayInWeek(monthStart))
    ) {
      for (const row of gridProps) {
        if (inSameDay(row[0].date, weekStartDay)) {
          row.forEach((v) => (v.selected = true))
        } else {
          row.forEach((v) => (v.selected = false))
        }
      }
    }
    setGridItems(gridProps)
  }, [monthStart, weekStartDay])

  const clickWeek = (rowIndex: number) => {
    if (gridItems.length <= rowIndex) {
      return
    }
    onSelectWeek(gridItems[rowIndex][0].date)
  }

  const weekRowStyle = (selected: boolean) => {
    const base =
      'mt-2 flex flex-row justify-between border-2 rounded-md font-mono'
    const selectedStyle = 'bg-blue-100 border-blue-500 text-blue-500 font-bold'
    const notSelectedStyle = 'bg-white border-white text-black'
    const conditional = selected ? selectedStyle : notSelectedStyle
    return cls(base, conditional)
  }

  const dayItemStyle = (selected: boolean, inCurrentMonth: boolean) => {
    const base =
      'flex items-center justify-center h-full text-center align-middle'
    const selectedStyle = 'text-blue-500 font-bold'
    const currMonthStyle = 'text-black'
    const otherMonthStyle = 'text-gray-300'
    const conditional = selected
      ? selectedStyle
      : inCurrentMonth
        ? currMonthStyle
        : otherMonthStyle
    return cls(base, conditional)
  }

  const buildGrids = (data: CalendarGridProps[][]) => {
    return data.map((line: CalendarGridProps[], rowIndex: number) => {
      const selected = line[0].selected
      return (
        <div
          key={rowIndex}
          className={weekRowStyle(selected)}
          onClick={() => {
            clickWeek(rowIndex)
          }}
        >
          {line.map((item: CalendarGridProps) => {
            return (
              <div
                key={getEntryDateKey(item.date)}
                className="h-10 flex-1 flex-row items-center justify-center"
              >
                <p className={dayItemStyle(item.selected, item.inCurrentMonth)}>
                  {item.date.getDate()}
                </p>
              </div>
            )
          })}
        </div>
      )
    })
  }

  return (
    <CalendarContainer
      monthStartDate={monthStart}
      onChangeMonth={(start: Date) => {
        if (inSameMonth(start, monthStart)) {
          return
        }
        setMonthStart(start)
      }}
      dayItems={buildGrids(gridItems)}
    />
  )
}

const genGridsInMonth = (start: Date) => {
  const currMonth = start.getMonth()
  const prevMonthDays = getPrevMonthDatesInCalendar(start)
  const nextMonthDays = getNextMonthDatesInCalendar(start)
  let temp = prevMonthDays
  temp = temp.concat(getDatesInMonth(start))
  temp = temp.concat(nextMonthDays)
  const res: CalendarGridProps[][] = [[]]
  let i = 0
  temp.forEach((v: Date) => {
    const prop: CalendarGridProps = {
      num: v.getDate().toString(),
      date: v,
      inCurrentMonth: currMonth == v.getMonth(),
      selected: false,
    }
    res[res.length - 1].push(prop)
    i++
    if (i > 6) {
      i = 0
      res.push([])
    }
  })
  res.pop()
  return res
}

interface CalendarContainerProps {
  monthStartDate: Date
  onChangeMonth: (start: Date) => void
  dayItems: React.ReactNode
}

function CalendarContainer({
  monthStartDate,
  onChangeMonth,
  dayItems,
}: CalendarContainerProps) {
  const [monthStr, setMonthStr] = useState('')

  useEffect(() => {
    setMonthStr(getMonthAbbr(monthStartDate))
  }, [monthStartDate])

  const clickPrevMonth = () => {
    const start = getFirstDayOfPrevMonth(monthStartDate)
    onChangeMonth(start)
  }

  const clickNextMonth = () => {
    const start = get1stDayOfNextMonth(monthStartDate)
    onChangeMonth(start)
  }

  return (
    <div className="w-80 bg-white">
      <div className="flex h-10 flex-row justify-between">
        <div
          className="flex w-20 flex-row items-center justify-center"
          onClick={clickPrevMonth}
        >
          <ChevronLeft size="M" />
        </div>
        <div className="flex flex-row items-center">
          <p className="text-xl font-bold">{monthStr}</p>
        </div>
        <div
          className="flex w-20 flex-row items-center justify-center"
          onClick={clickNextMonth}
        >
          <ChevronRight size="M" />
        </div>
      </div>
      <div className="mt-4 flex flex-row justify-between">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(
          (day: string, index: number) => {
            return (
              <div
                key={index}
                className="h-8 flex-1 flex-row items-center justify-center"
              >
                <p className="text-center font-mono text-sm">{day}</p>
              </div>
            )
          },
        )}
      </div>
      <div className="flex flex-col items-stretch justify-start">
        {dayItems}
      </div>
    </div>
  )
}
