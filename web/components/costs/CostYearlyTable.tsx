"use client";

import { Card } from "@/components/retroui/Card";
import PaginatedTable from "@/components/PaginatedTable";
import { gbp } from "@/lib/format";
import type { YearlyCostStat } from "@/lib/cost-stats";

interface Props {
  readonly years: YearlyCostStat[];
}

export default function CostYearlyTable({ years }: Props) {
  return (
    <Card className="block w-full">
      <Card.Header>
        <Card.Title className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Cost By Year
        </Card.Title>
      </Card.Header>
      <Card.Content>
        <PaginatedTable
          rows={years}
          getRowKey={(year) => year.year}
          emptyMessage="No cost records"
          columns={[
            { key: "year", header: "Year", render: (year) => year.year },
            { key: "fuel", header: "Fuel", render: (year) => gbp(year.fuelSpend) },
            { key: "service", header: "Service", render: (year) => gbp(year.serviceSpend) },
            { key: "total", header: "Total", render: (year) => gbp(year.totalSpend) },
            {
              key: "fills",
              header: "Fills",
              className: "text-right text-secondary-foreground",
              render: (year) => year.fillCount,
            },
            {
              key: "avg-price",
              header: "Avg P/L",
              className: "text-right text-secondary-foreground",
              render: (year) => year.averageFuelPrice ? `£${year.averageFuelPrice.toFixed(3)}` : "-",
            },
          ]}
        />
      </Card.Content>
    </Card>
  );
}
