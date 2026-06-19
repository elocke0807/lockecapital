"use client";

import { LineChart, Line, ResponsiveContainer } from "recharts";

export function Sparkline({ data, positive }: { data: number[]; positive: boolean }) {
  const points = data.map((value, i) => ({ i, value }));
  return (
    <ResponsiveContainer width="100%" height={40}>
      <LineChart data={points}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={positive ? "#22c55e" : "#ef4444"}
          strokeWidth={1.5}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
