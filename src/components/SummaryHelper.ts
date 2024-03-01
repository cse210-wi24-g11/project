import * as d3 from "d3";
import {RGBColor} from "d3";

export interface SummaryDayMoodRecord {
  id: number;
  day: Date;
  title: string;
  value: number;
  color: RGBColor;
}

export interface SummaryMoodRecord {
  id: number,
  day: Date;
  title: string;
  color: RGBColor;
}

export const MaxMoodValue = 5;

export function getDateAbbr(date: Date): string {
  const abbr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return abbr[date.getMonth()] + " " + date.getDate();
}

export function getDatesInMonth(startDay: Date): Array<Date> {
  const date = new Date(startDay.getFullYear(), startDay.getMonth(), 1);
  const days = Array<Date>();
  while (date.getMonth() === startDay.getMonth()) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1)
  }
  return days;
}

export function getDatesInWeek(startDay: Date): Array<Date> {
  const days = Array<Date>();
  const date = new Date(startDay);
  for (let i = 0; i < 7; i++) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

// TODO: fix
export function getRecordsInRange(dates: Date[]): SummaryDayMoodRecord[] {
  return dates.map((d, i) => {
    // const val = 0 + Math.floor(Math.random() * 3);
    const val = Math.floor(Math.random() * 6);
    return {
      id: i + 100 * d.getDay(),
      day: new Date(d),
      title: "day " + d.getDate(),
      value: val,
      color: mockMoodColors[val]
      // color: d3.color('steelblue'),
    };
  });
}

export function getMoodOfDate(date: Date): SummaryMoodRecord[] {
  return Array.from({ length: 10 }, (_, index) => ({
    id: index + 100 * date.getDay(),
    day: date,
    title: "Day " + date.getDate() + " is good.",
    color: mockMoodColors[Math.floor(Math.random() * 6)]
  }))
}

// TODO: fix
export function getMoodLevel(record: SummaryDayMoodRecord): number {
  return Math.floor(Math.random() * 6);
}

const mockMoodColors = [
  d3.rgb('black'),
  d3.rgb('darkred'),
  d3.rgb('red'),
  d3.rgb('pink'),
  d3.rgb('lightsalmon'),
  d3.rgb('lightpink')
]

export function getMoodDesc(records: SummaryDayMoodRecord[]): string {
  if (records.length == 0) {
    return "No mood summary.";
  }
  const avgMood = records.reduce((acc, cur) => acc + cur.value, 0) / records.length;
  if (avgMood > MaxMoodValue / 3 * 2) {
    return "Seems that you are quite happy these days!";
  } else if (avgMood > MaxMoodValue / 3) {
    return "Being ordinary is just a part of life."
  } else {
    return "Don't worry, things will get better soon!"
  }
}