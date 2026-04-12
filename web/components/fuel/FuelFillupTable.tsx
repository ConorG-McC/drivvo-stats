"use client";

import { Card } from "@/components/retroui/Card";
import PaginatedTable from "@/components/PaginatedTable";
import type { FuelRow } from "@/lib/fuel-stats";
import { getTotalFuelCost } from "@/lib/fuel-stats";
import { gbp } from "@/lib/format";
import { economyFmt, litresFmt, pricePerLitreFmt } from "@/components/fuel/fuel-format";

interface Props {
  readonly rows: FuelRow[];
}

export default function FuelFillupTable({ rows }: Props) {
  return (
    <Card className="block w-full">
      <Card.Header>
        <Card.Title className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Fill-Ups
        </Card.Title>
        <Card.Description>
          Latest entries with derived litres and full-tank economy where available.
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <PaginatedTable
          rows={rows}
          pageSize={10}
          getRowKey={(row) => row.entry.fuel_entry_id}
          emptyMessage="No fill-ups"
          columns={[
            { key: "date", header: "Date", render: (row) => row.entry.date.slice(0, 10) },
            { key: "station", header: "Station", render: (row) => row.entry.fuel_station?.name ?? "-" },
            {
              key: "tank",
              header: "Tank",
              render: (row) => `${row.entry.full_tank ? "Full" : "Partial"}${row.entry.missed_previous_fill ? " / gap" : ""}`,
            },
            {
              key: "odometer",
              header: "Odometer",
              className: "text-right text-secondary-foreground",
              render: (row) => `${row.entry.odometer.toLocaleString()} mi`,
            },
            {
              key: "litres",
              header: "Litres",
              className: "text-right text-secondary-foreground",
              render: (row) => litresFmt(row.litres),
            },
            {
              key: "economy",
              header: "Economy",
              className: "text-right text-secondary-foreground",
              render: (row) => economyFmt(row.milesPerGallonUk),
            },
            {
              key: "price",
              header: "P/L",
              className: "text-right text-secondary-foreground",
              render: (row) => pricePerLitreFmt(row.entry.price_per_litre),
            },
            {
              key: "cost",
              header: "Cost",
              className: "text-right text-secondary-foreground",
              render: (row) => gbp(getTotalFuelCost(row.entry)),
            },
          ]}
        />
      </Card.Content>
    </Card>
  );
}
