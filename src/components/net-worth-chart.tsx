"use client";

import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { formatCurrency } from "@/lib/utils";

const data = [
  { month: "Jan", value: 71200 },
  { month: "Feb", value: 73850 },
  { month: "Mar", value: 72980 },
  { month: "Apr", value: 76410 },
  { month: "May", value: 79220 },
  { month: "Jun", value: 78540 },
  { month: "Jul", value: 81100 },
  { month: "Aug", value: 84230 },
];

export function NetWorthChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="netWorthGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d4af37" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#d4af37" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="month"
          tick={{ fill: "#a1a1aa", fontSize: 12 }}
          axisLine={{ stroke: "#27272a" }}
          tickLine={false}
        />
        <YAxis hide domain={["dataMin - 4000", "dataMax + 4000"]} />
        <Tooltip
          contentStyle={{
            background: "#18181b",
            border: "1px solid #27272a",
            borderRadius: 8,
            fontSize: 12,
          }}
          labelStyle={{ color: "#a1a1aa" }}
          formatter={(value) => [formatCurrency(Number(value)), "Net Worth"]}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#d4af37"
          strokeWidth={2}
          fill="url(#netWorthGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
