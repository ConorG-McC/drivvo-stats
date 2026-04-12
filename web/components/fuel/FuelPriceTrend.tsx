"use client";

import { Card } from "@/components/retroui/Card";
import { LineChart } from "@/components/retroui/charts/LineChart";
import type { FuelRow } from "@/lib/fuel-stats";
import { pricePerLitreFmt } from "@/components/fuel/fuel-format";

interface Props {
  readonly rows: FuelRow[];
}

export default function FuelPriceTrend({ rows }: Props) {
  const recentRows = rows.slice(-10);
  const data = recentRows.map((row) => ({
    date: row.entry.date.slice(0, 10),
    price: row.entry.price_per_litre,
  }));

  return (
    <Card className="block w-full">
      <Card.Header>
        <Card.Title className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Price Trend
        </Card.Title>
        <Card.Description>Recent price per litre.</Card.Description>
      </Card.Header>
      <Card.Content>
        <LineChart
          data={data}
          index="date"
          categories={["price"]}
          strokeColors={["var(--secondary)"]}
          valueFormatter={pricePerLitreFmt}
          className="h-72"
        />
      </Card.Content>
    </Card>
  );
}
