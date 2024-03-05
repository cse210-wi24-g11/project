import {NavLink} from 'react-router-dom'

import {MainNavBar} from '@/components/navigation/main-navbar.tsx'
import {SummaryBar} from '@/components/navigation/summary-bar.tsx'
import {useEffect, useState} from "react";
import {getDateAbbr, getMoodOfDate, SummaryMoodRecord} from "@/components/SummaryHelper.ts";
import MoodListItem from "@/components/MoodItem/MoodItem.tsx";
import {DatePicker} from "@adobe/react-spectrum";
import {CalendarDate, getLocalTimeZone} from "@internationalized/date";
import { SummaryNavbarItem } from '@/components/navigation/summary-bar.tsx'

// import DaySummaryPage from "@/pages/DaySummaryPage.tsx";

interface DaySummaryPageProps {
  day?: Date;
  summaryNavBarItem: SummaryNavbarItem
}

const date2CalendarDate = (date: Date) => {
  return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

export function DaySummary(props: DaySummaryPageProps) {
  const {day, summaryNavBarItem} = props;
  const [today, setToday] = useState<Date>(day ?? new Date());
  const [dpDate, setDpDate] = useState(date2CalendarDate(day ?? new Date()))
  const [listItems, setListItems] = useState<SummaryMoodRecord[]>([]);

  const createEntries = (records: SummaryMoodRecord[]) => {
    records.map(r => (
      <li key={r.id}>
        {/*<img />*/}
        <p>
          <b>{r.title}</b>
          {getDateAbbr(r.day)}
        </p>
      </li>
    ))
  };

  useEffect(() => {
    // console.log('Effect 1');
    // console.log('  today', today, today.getMonth(), today.getDate());
    const cd = date2CalendarDate(today);
    // console.log('  converted', cd);
    setDpDate(cd);
    setListItems(getMoodOfDate(today));
  }, [today]);

  return (
    <>
      <SummaryBar summaryNavBarItem={summaryNavBarItem}/>
      <div className="flex flex-col items-center">
        <div>
          <DatePicker
            label="Select a date"
            value={dpDate}
            onChange={(d: CalendarDate) => {
              setToday(d.toDate(getLocalTimeZone()))
            }}
          />
        </div>
        <ul className="w-full bg-white left-0 top-8">
          {listItems.map((item, index) => (
            <li className="my-4" key={item.id}>
              <MoodListItem
                imageUrl={"TODO"} // TODO: fix
                title={item.title}
                date={item.day}
                color={item.color}
                recordId={item.id.toString()} // TODO: type of id?
                onClick={(recordId: string) => {
                  // TODO: type of id?
                  console.log(`Go to mood page ${recordId}`);
                }}
              />
            </li>
          ))}
        </ul>
      </div>
      <MainNavBar/>
    </>
  );
}

export default DaySummary;
