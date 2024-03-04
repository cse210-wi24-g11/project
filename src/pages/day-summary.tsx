import {NavLink} from 'react-router-dom'

import {MainNavBar} from '@/components/navigation/main-navbar.tsx'
import {SummaryBar} from '@/components/navigation/summary-bar.tsx'
import {useEffect, useState} from "react";
import {getDateAbbr, getMoodOfDate, SummaryMoodRecord} from "@/components/SummaryHelper.ts";
import MoodListItem from "@/components/MoodItem/MoodItem.tsx";
import {DatePicker} from "@adobe/react-spectrum";
import {CalendarDate, getLocalTimeZone} from "@internationalized/date";

// import DaySummaryPage from "@/pages/DaySummaryPage.tsx";

interface DaySummaryPageProps {
  day?: Date;
}

const date2CalendarDate = (date: Date) => {
  return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

const DaySummary = (props: DaySummaryPageProps) => {
  const {day} = props;
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
    <div>
      <SummaryBar/>
      <div className="w-full bg-white top-8">
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
    </div>
  );
}

// function DaySummary() {
//   return (
//     <>
//       <SummaryBar />
//       <div className="flex flex-col items-center">
//         <div>
//           <p className="text-black">Your day so far</p>
//           <div className="mt-2 h-60 w-60 rounded-md border border-gray-200">
//             {/* insert mood source (img?) here */}
//             <div></div>
//           </div>
//         </div>
//         <NavLink className="mt-5 w-80 bg-white" to="/UpdateMood">
//           <div className="rounded-md border px-1 py-2">
//             <div className="fßex items-center justify-start">
//               <div className="mr-2 h-10 w-10 rounded-md border border-gray-200">
//                 {/* insert mood source (img?) here */}
//                 <div></div>
//               </div>
//               <p className="text-black">time: content</p>
//             </div>
//           </div>
//         </NavLink>
//       </div>
//       <MainNavBar />
//     </>
//   )
// }

export default DaySummary;
