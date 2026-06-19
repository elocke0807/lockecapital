"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#d4af37", "#a1a1aa", "#22c55e", "#f59e0b", "#3b82f6"];

interface AllocationDonutProps {
  data: { ticker: string; allocation: number }[];
}

export function AllocationDonut({ data }: AllocationDonutProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          dataKey="allocation"
          nameKey="ticker"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={2}
          stroke="none"
        >
          {data.map((entry, i) => (
            <Cell key={entry.ticker} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: "#18181b",
            border: "1px solid #27272a",
            borderRadius: 8,
            fontSize: 12,
          }}
          formatter={(value, name) => [`${value}%`, name]}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
