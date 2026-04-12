"use client";

import { Card } from "@/components/retroui/Card";
import { LineChart } from "@/components/retroui/charts/LineChart";
import type { FuelRow } from "@/lib/fuel-stats";
import { economyFmt } from "@/components/fuel/fuel-format";

interface Props {
  readonly rows: FuelRow[];
}

export default function FuelConsumptionTrend({ rows }: Props) {
  const recentRows = rows.slice(-8);
  const data = recentRows.map((row) => ({
    date: row.entry.date.slice(0, 10),
    economy: row.milesPerGallonUk ?? 0,
  }));

  return (
    <Card className="block w-full">
      <Card.Header>
        <Card.Title className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Consumption Trend
        </Card.Title>
        <Card.Description>Calculated between full-tank fill-ups.</Card.Description>
      </Card.Header>
      <Card.Content>
        {data.length ? (
          <LineChart
            data={data}
            index="date"
            categories={["economy"]}
            strokeColors={["var(--foreground)"]}
            valueFormatter={economyFmt}
            className="h-72"
          />
        ) : (
          <p className="text-sm text-muted-foreground">Needs two valid full-tank fill-ups.</p>
        )}
      </Card.Content>
    </Card>
  );
}
