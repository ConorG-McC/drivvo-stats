"use client";

import { Card } from "@/components/retroui/Card";
import { BarChart } from "@/components/retroui/charts/BarChart";
import type { MonthlyFuelStat } from "@/lib/fuel-stats";
import { gbp } from "@/lib/format";

interface Props {
  readonly months: MonthlyFuelStat[];
}

export default function FuelMonthlySpend({ months }: Props) {
  const data = months.map((month) => ({
    month: month.month,
    spend: month.spend,
  }));

  return (
    <Card className="block w-full">
      <Card.Header>
        <Card.Title className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Monthly Spend
        </Card.Title>
      </Card.Header>
      <Card.Content>
        <BarChart
          data={data}
          index="month"
          categories={["spend"]}
          fillColors={["var(--secondary)"]}
          valueFormatter={gbp}
          className="h-72"
        />
      </Card.Content>
    </Card>
  );
}
