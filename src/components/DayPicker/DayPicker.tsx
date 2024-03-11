import { useState } from 'react'
import Calendar from '@spectrum-icons/workflow/Calendar'
import {
  ActionButton,
  Content,
  Dialog,
  DialogTrigger,
  Flex,
} from '@adobe/react-spectrum'

import { displayDate } from '@/components/SummaryHelper.ts'

import { DayPickerCalendar } from '@/components/ICalendar/ICalendar.tsx'

interface DayPickerProps {
  initialDay: Date
  onChangeDay: (day: Date) => void
}

function DayPicker({ initialDay, onChangeDay }: DayPickerProps) {
  const [date, setDate] = useState(initialDay)

  return (
    <DialogTrigger type="tray">
      <ActionButton>
        <div className="flex h-10 flex-row">
          <div className="flex flex-row items-center justify-center border-r border-gray-500">
            <p className="ml-8 mr-8 line-clamp-1">{displayDate(date)}</p>
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
              <DayPickerCalendar
                day={date}
                onSelectDay={(day: Date) => {
                  setDate(day)
                  onChangeDay(day)
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

export default DayPicker
