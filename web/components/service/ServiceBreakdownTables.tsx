"use client";

import { Card } from "@/components/retroui/Card";
import PaginatedTable from "@/components/PaginatedTable";
import { gbp } from "@/lib/format";
import type { ServiceLocationStat, ServiceTypeStat } from "@/lib/service-stats";

interface Props {
  readonly types: ServiceTypeStat[];
  readonly locations: ServiceLocationStat[];
}

export default function ServiceBreakdownTables({ types, locations }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card className="block w-full">
        <Card.Header>
          <Card.Title className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Spend By Work
          </Card.Title>
        </Card.Header>
        <Card.Content>
          <PaginatedTable
            rows={types}
              getRowKey={(type) => type.name}
            emptyMessage="No work types"
            columns={[
              { key: "work", header: "Work", render: (type) => type.name },
              {
                key: "count",
                header: "Count",
                className: "text-right text-secondary-foreground",
                render: (type) => type.count,
              },
              {
                key: "spend",
                header: "Spend",
                className: "text-right text-secondary-foreground",
                render: (type) => gbp(type.spend),
              },
            ]}
          />
        </Card.Content>
      </Card>

      <Card className="block w-full">
        <Card.Header>
          <Card.Title className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Spend By Location
          </Card.Title>
        </Card.Header>
        <Card.Content>
          <PaginatedTable
            rows={locations}
              getRowKey={(location) => location.name}
            emptyMessage="No locations"
            columns={[
              { key: "location", header: "Location", render: (location) => location.name },
              {
                key: "records",
                header: "Records",
                className: "text-right text-secondary-foreground",
                render: (location) => location.count,
              },
              {
                key: "spend",
                header: "Spend",
                className: "text-right text-secondary-foreground",
                render: (location) => gbp(location.spend),
              },
            ]}
          />
        </Card.Content>
      </Card>
    </div>
  );
}
