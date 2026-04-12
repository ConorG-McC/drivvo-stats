"use client";

import type { ServiceEntry } from "@/lib/types";
import { Card } from "@/components/retroui/Card";
import PaginatedTable from "@/components/PaginatedTable";

interface Props {
  readonly service: ServiceEntry[];
}

export default function OilTopUpTable({ service }: Props) {
  const oilTopUps = [...service]
    .filter(e => e.service_types.some(t => /oil top up/i.test(t.name)))
    .sort((a, b) => a.date.localeCompare(b.date));
  const rows = oilTopUps.map((entry, index) => ({
    entry,
    intervalMiles: index > 0 ? entry.odometer - oilTopUps[index - 1].odometer : null,
  }));

  return (
    <Card>
      <Card.Header>
        <Card.Title className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Oil top-up log
        </Card.Title>
      </Card.Header>
      <Card.Content>
        <PaginatedTable
          rows={rows}
          getRowKey={(row) => row.entry.service_id}
          emptyMessage="None logged"
          columns={[
            { key: "date", header: "Date", render: (row) => row.entry.date.slice(0, 10) },
            {
              key: "odometer",
              header: "Odometer",
              className: "text-right text-secondary-foreground",
              render: (row) => `${row.entry.odometer.toLocaleString()} mi`,
            },
            {
              key: "interval",
              header: "Interval",
              className: "text-right text-secondary-foreground",
              render: (row) => row.intervalMiles == null ? "-" : `${row.intervalMiles} mi`,
            },
          ]}
        />
      </Card.Content>
    </Card>
  );
}
