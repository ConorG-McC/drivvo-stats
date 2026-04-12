"use client";

import { Card } from "@/components/retroui/Card";
import { BarChart } from "@/components/retroui/charts/BarChart";
import { gbp } from "@/lib/format";
import type { MonthlyCostStat } from "@/lib/cost-stats";

interface Props {
  readonly months: MonthlyCostStat[];
}

export default function CostMonthlyTrend({ months }: Props) {
  const data = months.map((month) => ({
    month: month.month,
    fuel: month.fuelSpend,
    service: month.serviceSpend,
  }));

  return (
    <Card className="block w-full">
      <Card.Header>
        <Card.Title className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Monthly Spend
        </Card.Title>
        <Card.Description>Fuel and service spend over the last 12 months.</Card.Description>
      </Card.Header>
      <Card.Content>
        <BarChart
          data={data}
          index="month"
          categories={["fuel", "service"]}
          stacked
          fillColors={["var(--primary)", "var(--secondary)"]}
          valueFormatter={gbp}
          className="h-72"
        />
      </Card.Content>
    </Card>
  );
}
