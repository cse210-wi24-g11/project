import React, {useState, useEffect} from 'react';

import {SummaryDayMoodRecord, getDatesInMonth, getRecordsInRange, getDateAbbr} from "@/components/SummaryHelper.ts";
import WeekSummaryGraph from "@/components/WeekSummaryGraph/WeekSummaryGraph.tsx";
import WeekPicker from "@/components/WeekPicker/WeekPicker.tsx";
import DayEntryList from "@/components/DayEntryList/DayEntryList.tsx";

interface WeekSummaryProps {

}

const WeekSummaryPage = (props: WeekSummaryProps) => {
  const [startDay, setStartDay] = useState(new Date());
  const [records, setRecords] = useState<Array<SummaryDayMoodRecord>>([]);

  useEffect(() => {
    const records = getRecordsInRange(getDatesInMonth(startDay));
    setRecords(records);
  }, [startDay]);

  const onClickRecord = (record: SummaryDayMoodRecord) => {
    console.log("Click on record", record);
    // TODO: go to day page.
  }

  return (
    <div>
      <WeekSummaryGraph records={records}/>
      <WeekPicker
        startDay={startDay}
        onChangeWeek={(startDay: Date) => {
          setStartDay(startDay);
        }}
      />
      <DayEntryList records={records} onClickRecord={onClickRecord}/>
    </div>
  )
}

export default WeekSummaryPage;
