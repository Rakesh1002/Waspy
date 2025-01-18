"use client"

import { Line, LineChart as RechartsLineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface ChartData {
  name: string;
  "Messages Sent": number;
  "Messages Opened": number;
  "Responses": number;
}

interface LineChartProps {
  data: ChartData[]
}

export function LineChart({ data }: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <RechartsLineChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="Messages Sent"
          stroke="#adfa1d"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="Messages Opened"
          stroke="#0ea5e9"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="Responses"
          stroke="#0f766e"
          strokeWidth={2}
          dot={false}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  )
} 