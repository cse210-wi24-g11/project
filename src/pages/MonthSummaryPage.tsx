import React, {useEffect, useState} from 'react';

import {ICalendar} from "@/components";
import {
  SummaryDayMoodRecord,
  getRecordsInRange,
  getDateAbbr,
  getDatesInMonth
} from "@/components/SummaryHelper.ts";
import DayEntryList from "@/components/DayEntryList/DayEntryList.tsx";
import MonthSummaryGraph from "@/components/MonthSummaryGraph/MonthSummaryGraph.tsx";

// class MonthSummary extends React.Component {
const MonthSummaryPage = () => {
  const [startDay, setStartDay] = useState(new Date());
  const [records, setRecords] = useState<Array<SummaryDayMoodRecord>>([]);

  const goToDaySummaryPage = (day: Date) => {
    // TODO: fix
    console.log('Go to day summary page', day);
  };

  useEffect(() => {
    const records = getRecordsInRange(getDatesInMonth(startDay));
    setRecords(records);
  }, [startDay]);

  return (
    <div>
      <MonthSummaryGraph
        records={records}
        onRenderStart={() => {
        }}
        onRenderEnd={() => {
        }}
      />
      <ICalendar
        monthStartDay={startDay}
        onClickDay={goToDaySummaryPage}
        onChangeMonth={(startDay: Date) => {
          setStartDay(startDay);
        }}
      />
      <DayEntryList
        records={records}
        onClickRecord={(r: SummaryDayMoodRecord) => goToDaySummaryPage(r.day)}
      />
    </div>
  )
}


class SummaryList extends React.Component {

}

export default MonthSummaryPage;
