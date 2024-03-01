import * as d3 from "d3";

import {
  getDateAbbr,
  getMoodDesc,
  MaxMoodValue,
  SummaryDayMoodRecord
} from "@/components/SummaryHelper.ts";
import {useEffect, useRef, useState} from "react";

interface SummaryGraphProps {
  records: Array<SummaryDayMoodRecord>
  onRenderStart: () => void
  onRenderEnd: () => void
}

const MonthSummaryGraph = (props: SummaryGraphProps) => {
  const {records, onRenderStart, onRenderEnd} = props;
  const [title, setTitle] = useState('Mood');
  const [desc, setDesc] = useState('');

  const d3Container = useRef(null);

  useEffect(() => {
    draw(records);
    updateTitle(records);
    setDesc(getMoodDesc(records));
  }, [records]);

  const draw = (data: SummaryDayMoodRecord[]) => {
    if (data.length == 0 || !d3Container.current) {
      // TODO: empty state
      return;
    }
    console.log('draw data', data);
    const svg = d3.select(d3Container.current);
    const margin = {top: 10, right: 25, bottom: 10, left: 25};
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;
    console.log(`graph w ${width} h ${height}`);

    svg.selectAll("*").remove();

    const g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    const x = d3.scaleBand().rangeRound([0, width]).padding(0.1).domain(data.map((d, i) => i));
    const y = d3.scaleLinear().rangeRound([height, 0]).domain([0, MaxMoodValue]);
    const barWidth = width / (data.length * 2 - 1);
    const barGap = barWidth;
    const cornerRadius = barWidth / 2;

    // 0~5 horizontal lines
    for (let i = 0; i <= MaxMoodValue; i++) {
      g.append("line")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", y(i))
        .attr("y2", y(i))
        .attr("stroke", "lightgray")
        .attr("stroke-dasharray", 5);
      // g.append("text")
      //   .attr("x", 0)
      //   .attr("y", y(i))
      //   .attr("dy", "0.3em")
      //   .attr('text-anchor', 'end')
      //   .attr('fill', 'gray')
      //   .text(i.toString());
    }

    data.forEach((value, index) => {
      const barHeight = height - y(value.value);
      g.append("rect")
        .attr('width', barWidth)
        .attr('height', barHeight + cornerRadius * 2)
        .attr('x', (barWidth + barGap) * index)
        .attr('y', y(value.value) - cornerRadius)
        .attr('fill', value.color?.toString() ?? 'black') // TODO: change color
        .attr('rx', cornerRadius)
        .attr('ry', cornerRadius);
    });
  }

  const updateTitle = (records: SummaryDayMoodRecord[]) => {
    let text = 'Mood Summary';
    if (records.length != 0) {
      const start = records[0].day;
      const end = records[records.length - 1].day;
      let startTxt = getDateAbbr(start);
      let endTxt = getDateAbbr(end);
      if (start.getFullYear() != end.getFullYear()) {
        startTxt = startTxt + ' ' + start.getFullYear().toString();
        endTxt = endTxt + ' ' + end.getFullYear().toString();
      }
      text = 'Mood · ' + startTxt + ' ~ ' + endTxt;
    }
    setTitle(text);
  }

  return (
    <div className="mood-month-summary-graph">
      <p className="title">{title}</p>
      <svg ref={d3Container} width={400} height={180}/>
      <p className="description">{desc}</p>
    </div>
  )
}

export default MonthSummaryGraph;
