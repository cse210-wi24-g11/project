import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'

import { ExpandedEntry } from '@/db/utils.ts'

interface MoodPieChartProps {
  records: ExpandedEntry[]
}

interface MoodPercentageData {
  color: d3.RGBColor
  label: string
  percentage: number
}

function MoodPieChart({ records }: MoodPieChartProps) {
  const [pieData, setPieData] = useState<MoodPercentageData[]>([])
  const d3Container = useRef<SVGSVGElement>(null)

  useEffect(() => {
    setPieData(getMoodPercentages(records))
  }, [records])

  useEffect(() => {
    console.log('pie data', pieData)

    const svg = d3.select(d3Container.current)

    const width = d3Container.current?.parentElement?.clientHeight || 200
    const height = width
    const radius = Math.min(width, height) / 2

    const arc = d3.arc().innerRadius(0).outerRadius(radius)

    const pie = d3.pie<MoodPercentageData>().value((d) => d.percentage)

    const arcs = pie(pieData)

    svg.selectAll('*').remove()

    svg
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`)
      .selectAll('path')
      .data(arcs)
      .enter()
      .append('path')
      .attr('fill', (d) => d.data.label)
      .attr('d', arc)
  }, [pieData])

  function genLabelDesc(data: MoodPercentageData[]) {
    let arr = data
    const limit = 4
    const needEllipsis = data.length > limit
    if (needEllipsis) {
      arr = arr.slice(0, limit)
    }
    const res = arr.map((d) => {
      return (
        <li
          className="flex h-8 flex-row items-center justify-start"
          key={d.label}
        >
          <div
            style={{
              backgroundColor: d.label,
              width: '14px',
              height: '14px',
              borderRadius: '7px',
            }}
          />
          <p className="ml-2 font-mono font-bold">
            {Math.floor(d.percentage * 100).toString() + '%'}
          </p>
        </li>
      )
    })
    if (needEllipsis) {
      res.push(
        <li
          className="flex h-4 flex-row items-center justify-start"
          key="ellipsis"
        >
          <p className="mb-2 font-mono font-bold">......</p>
        </li>,
      )
    }
    return res
  }

  function getMoodPercentages(records: ExpandedEntry[]): MoodPercentageData[] {
    const map = new Map<string, number>()
    console.log('pie records', records)
    if (records.length == 0) {
      return []
    }
    let sum = 0
    for (const r of records) {
      sum += 1
      const temp = map.get(r.mood.color) ?? 0
      map.set(r.mood.color, temp + 1)
    }
    const res = new Array<MoodPercentageData>()
    for (const p of map) {
      res.push({ color: d3.rgb(p[0]), percentage: p[1] / sum, label: p[0] })
    }
    res.sort((a, b) => {
      if (a.percentage < b.percentage) {
        return 1
      } else if (a.percentage > b.percentage) {
        return -1
      } else {
        return 0
      }
    })
    console.log('pic return', res)
    return res
  }

  return (
    <div className="mt-4 flex h-40 flex-row items-center justify-start bg-white">
      <div className="h-40 w-40">
        <svg ref={d3Container} style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="ml-4 flex flex-row items-start justify-between rounded-md border">
        <ul className="mb-1 ml-4 mt-1 flex w-24 flex-col justify-start">
          {genLabelDesc(pieData)}
        </ul>
      </div>
    </div>
  )
}

export default MoodPieChart
