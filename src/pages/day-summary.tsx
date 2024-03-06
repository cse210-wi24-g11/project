import {useLocation, useNavigate} from 'react-router-dom';

import {MainNavBar} from '@/components/navigation/main-navbar.tsx';
import {SummaryBar} from '@/components/navigation/summary-bar.tsx';
import {useEffect, useState} from "react";
import {getDateAbbr, getEntryDateKey, getMoodOfDate, SummaryMoodRecord} from "@/components/SummaryHelper.ts";
import MoodListItem from "@/components/MoodItem/MoodItem.tsx";
import {DatePicker} from "@adobe/react-spectrum";
import {CalendarDate, getLocalTimeZone} from "@internationalized/date";
import {SummaryNavbarItem} from '@/components/navigation/summary-bar.tsx';
import {useDb} from "@/context/db.tsx";

// import DaySummaryPage from "@/pages/DaySummaryPage.tsx";

interface DaySummaryPageProps {
  day?: Date;
  summaryNavBarItem: SummaryNavbarItem
}

const date2CalendarDate = (date: Date) => {
  return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

const DaySummary = (props: DaySummaryPageProps) => {
  const {getDb} = useDb();
  const navigate = useNavigate();
  const location = useLocation();
  const locState = location.state as { from }
  const {day, summaryNavBarItem} = props;
  const [today, setToday] = useState<Date>(day ?? new Date());
  const [dpDate, setDpDate] = useState(date2CalendarDate(day ?? new Date()))
  const [listItems, setListItems] = useState<SummaryMoodRecord[]>([]);

  useEffect(() => {
    const cd = date2CalendarDate(today);
    setDpDate(cd);

    async function run() {
      const db = await getDb();

      // read all entry id of given date.
      const idReq = db.transaction('date_collections', 'readonly')
        .objectStore('dateCollection')
        .get(getEntryDateKey(today));

      idReq.onerror = () => {
        console.log('read entries of date', getDateAbbr(today), 'fail');
      }
      idReq.onsuccess = () => {
        // read all entries with given ids.
        const entries = idReq.result; // TODO: check id type.
        console.log('db:', entries);
        // setListItems(entries);
      }
    }

    void run();
    setListItems(getMoodOfDate(today));
  }, [today]);

  return (
    <div className="flex flex-col">
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
                  console.log(`Go to entry edit page ${recordId}`);
                  navigate("/UpdateEntry", {state: {id: recordId}}) // TODO: give id
                }}
              />
            </li>
          ))}
        </ul>
      </div>
      <MainNavBar/>
    </div>
  );
}

export default DaySummary;
