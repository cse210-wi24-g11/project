import React, { useEffect, useState } from 'react'
import Calendar from '@spectrum-icons/workflow/Calendar'
import {
  ActionButton,
  Content,
  Dialog,
  DialogTrigger,
  Flex,
  Heading,
  Provider,
  RangeCalendar,
} from '@adobe/react-spectrum'
import { getDateAbbr, getDatesInWeek } from '@/components/SummaryHelper.ts'

interface WeekPickerProps {
  startDay: Date
  onChangeWeek: (startDay: Date) => void
}

interface DatePickerBoxProps {
  time: string
  onClick: () => void
}

const DatePickerBox = ({ time, onClick }: DatePickerBoxProps) => {
  // TODO: move border to outside div.
  return (
    <div className="flex h-10 flex-row rounded-md" onClick={onClick}>
      <div className="flex flex-row items-center justify-center rounded-l-md border border-gray-500">
        <p className="ml-8 mr-8 line-clamp-1">{time}</p>
      </div>
      <div className="flex w-10 flex-row items-center justify-center rounded-r-md border-b border-r border-t border-gray-500">
        <Calendar aria-label="date picker icon" size="S" />
      </div>
    </div>
  )
}

const BottomDialog = ({ time, onClick }: DatePickerBoxProps) => {
  return (
    <DialogTrigger type="tray">
      <ActionButton>
        <div className="flex h-10 flex-row">
          <div className="flex flex-row items-center justify-center border-r border-gray-500">
            <p className="ml-8 mr-8 line-clamp-1">{time}</p>
          </div>
          <div className="flex w-10 flex-row items-center justify-center">
            <Calendar aria-label="date picker icon" size="S" />
          </div>
        </div>
      </ActionButton>
      {(close) => (
        <Dialog>
          {/*<Heading>Bottom Dialog</Heading>*/}
          {/*<Content>This a dialog from bottom.</Content>*/}
          {/*<ActionButton onPress={close}></ActionButton>*/}
          <Content>
            <Flex>
              <Provider locale="en">
                <RangeCalendar />
              </Provider>
            </Flex>
          </Content>
        </Dialog>
      )}
    </DialogTrigger>
  )
}

const WeekPicker = ({ startDay, onChangeWeek }: WeekPickerProps) => {
  const [startDate, setStartDate] = useState(startDay)
  const [weekStr, setWeekStr] = useState('')

  useEffect(() => {
    const days = getDatesInWeek(startDay)
    if (days.length == 0) {
      return
    }
    const last = days[days.length - 1]
    setWeekStr(getDateAbbr(startDate) + ' ~ ' + getDateAbbr(last))
  }, [startDate])

  return (
    <div className="fixed left-0 right-0 top-10 border bg-white pb-2 pt-2">
      {/*<DatePickerBox time="Fed 2" onClick={() => console.log('Box clicked')} />*/}
      <BottomDialog time={weekStr} onClick={() => console.log('Box clicked')} />
    </div>
  )
}

export default WeekPicker
