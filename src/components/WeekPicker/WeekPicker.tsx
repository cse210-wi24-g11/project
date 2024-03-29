import { useState } from 'react'
import Calendar from '@spectrum-icons/workflow/Calendar'
import {
  ActionButton,
  Content,
  Dialog,
  DialogTrigger,
  Flex,
} from '@adobe/react-spectrum'

import {
  get1stDayInWeek,
  getDatesInWeek,
  displayMonthDay,
  displayMonthDayYear,
} from '@/utils/summary.ts'

import { WeekPickerCalendar } from '@/components/ICalendar/ICalendar.tsx'

interface WeekPickerProps {
  startDay: Date
  onChangeWeek: (startDay: Date) => void
}

export function WeekPicker({ startDay, onChangeWeek }: WeekPickerProps) {
  const [weekStart, setWeekStart] = useState(() => get1stDayInWeek(startDay))

  return (
    <DialogTrigger type="tray">
      <ActionButton>
        <div className="flex h-10 flex-row">
          <div className="flex flex-row items-center justify-center border-r border-gray-500">
            <p className="ml-8 mr-8 line-clamp-1">
              {displayWeekRange(weekStart)}
            </p>
          </div>
          <div className="flex w-10 flex-row items-center justify-center">
            <Calendar aria-label="date picker icon" size="S" />
          </div>
        </div>
      </ActionButton>
      {(close) => (
        <Dialog>
          <Content>
            <Flex alignItems="center" justifyContent="center">
              <WeekPickerCalendar
                weekStartDay={weekStart}
                onSelectWeek={(startDate: Date) => {
                  setWeekStart(startDate)
                  onChangeWeek(startDate)
                  close()
                }}
              />
            </Flex>
          </Content>
        </Dialog>
      )}
    </DialogTrigger>
  )
}

/**
 * given a starting date, returns a string representing the 1-week range starting from that date
 */
function displayWeekRange(date: Date): string {
  const days = getDatesInWeek(date)
  if (days.length == 0) {
    return ''
  }
  const first = days[0]
  const last = days[days.length - 1]
  if (first.getFullYear() == last.getFullYear()) {
    return displayMonthDay(first) + ' ~ ' + displayMonthDay(last)
  } else {
    return displayMonthDayYear(first) + ' ~ ' + displayMonthDayYear(last)
  }
}
