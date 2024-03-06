import {getTimeAbbr} from "@/components/SummaryHelper.ts";
import {RGBColor} from "d3";

interface MoodListItemProps {
  imageUrl: string;
  title: string;
  date: Date;
  color: RGBColor;
  recordId: string;
  onClick: (recordId: string) => void;
}

const MoodListItem = (props: MoodListItemProps) => {
  const {imageUrl, title, date, color, recordId, onClick} = props;

  const colorTagName = (color: RGBColor) => {
    return `rgb(${color.r}, ${color.g}, ${color.b})`;
  }

  return (
    <div className="w-80 h-30 border rounded-xl flex flex-row " onClick={() => onClick(recordId)}>
        <img className="rounded-l-xl" src='https://i.imgur.com/yXOvdOSs.jpg'/>
        <div className="grid-flow-col">
          <div className="rounded-xl mt-2 ml-4 flex content-center items-center">
            <div style={{backgroundColor: colorTagName(color), width: '14px', height: '14px', borderRadius: '7px'}}/>
            <p className="text-base font-bold ml-2">{getTimeAbbr(date)}</p>
          </div>
          <p className="text-left text-base mt-1 ml-4">{title}</p>
        </div>
    </div>
  )
}

export default MoodListItem;
