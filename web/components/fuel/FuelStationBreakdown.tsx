"use client";

import { Card } from "@/components/retroui/Card";
import PaginatedTable from "@/components/PaginatedTable";
import type { StationStat } from "@/lib/fuel-stats";
import { gbp } from "@/lib/format";
import { pricePerLitreFmt } from "@/components/fuel/fuel-format";

interface Props {
  readonly stations: StationStat[];
}

export default function FuelStationBreakdown({ stations }: Props) {
  return (
    <Card className="block w-full">
      <Card.Header>
        <Card.Title className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Station Breakdown
        </Card.Title>
      </Card.Header>
      <Card.Content>
        <PaginatedTable
          rows={stations}
          getRowKey={(station) => station.station}
          emptyMessage="No stations"
          columns={[
            { key: "station", header: "Station", render: (station) => station.station },
            {
              key: "fills",
              header: "Fills",
              className: "text-right text-secondary-foreground",
              render: (station) => station.fills,
            },
            {
              key: "average-price",
              header: "Avg p/l",
              className: "text-right text-secondary-foreground",
              render: (station) => pricePerLitreFmt(station.averagePrice),
            },
            {
              key: "spend",
              header: "Spend",
              className: "text-right text-secondary-foreground",
              render: (station) => gbp(station.spend),
            },
          ]}
        />
      </Card.Content>
    </Card>
  );
}
