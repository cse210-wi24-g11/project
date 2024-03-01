import {getDateAbbr, SummaryDayMoodRecord} from "@/components/SummaryHelper.ts";

interface DayEntryListProps {
  records: Array<SummaryDayMoodRecord>
  onClickRecord: (record: SummaryDayMoodRecord) => void;
}

const DayEntryList = (props: DayEntryListProps) => {
  const createEntries = (records: Array<SummaryDayMoodRecord>) => {
    return records.map(r => (
      <li key={r.id}>
        {/*<img />*/}
        <p>
          <b>{r.title}</b>
          {getDateAbbr(r.day)}
        </p>
      </li>
    ))
  }

  return (
    <div>
      <ul>
        {createEntries(props.records)}
      </ul>
    </div>
  )
}

export default DayEntryList;