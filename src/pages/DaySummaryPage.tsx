import {getDateAbbr, SummaryMoodRecord} from "@/components/SummaryHelper.ts";
import {useEffect, useState} from "react";
import MoodListItem from "@/components/MoodItem/MoodItem.tsx";

interface DaySummaryPageProps {
  records: SummaryMoodRecord[];
}

const DaySummaryPage = (props: DaySummaryPageProps) => {
  const {records} = props;
  const [listItems, setListItems] = useState<SummaryMoodRecord[]>(records);

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
    setListItems(records);
  }, [records]);

  return (
    <div className="day-summary-page">
      <ul className="mood-list">
        {listItems.map((item, index) => (
          <li className="item" key={item.id}>
            {/*<p className="mood-text">{getDateAbbr(item.day) + " " + item.title}</p>*/}
            <MoodListItem
              imageUrl={"TODO"} // TODO: fix
              title={item.title}
              date={item.day}
              recordId={item.id.toString()} // TODO: type of id?
              onClick={(recordId: string) => {
                // TODO: type of id?
                console.log("Go to mood page");
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DaySummaryPage;
