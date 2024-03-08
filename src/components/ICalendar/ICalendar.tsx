import Calendar from 'react-calendar'
import React from 'react'

interface ICalendarProps {
  monthStartDay: Date
  onClickDay: (day: Date) => void
  onChangeMonth: (startDay: Date) => void
}

class ICalendar extends React.Component<ICalendarProps> {
  monthStartDay = new Date()

  onMonthStartDayChange = (date: Date) => {
    if (
      this.monthStartDay.getMonth() != date.getMonth() ||
      this.monthStartDay.getFullYear() != date.getFullYear()
    ) {
      this.monthStartDay = date
      this.props.onChangeMonth(date)
    }
  }

  render() {
    const onClickDay = this.props.onClickDay
    return (
      <div className="month-summary-page-calendar">
        <Calendar
          locale="en-GB"
          activeStartDate={this.props.monthStartDay}
          onClickDay={onClickDay}
          onClickMonth={(value: Date) => {
            this.onMonthStartDayChange(value)
          }}
          onActiveStartDateChange={({
            action,
            activeStartDate,
            value,
            view,
          }) => {
            if (view === 'month' && activeStartDate != null) {
              this.onMonthStartDayChange(activeStartDate)
            }
          }}
        />
      </div>
    )
  }
}

export default ICalendar
