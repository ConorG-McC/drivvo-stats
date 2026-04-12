"use client";

import { Card } from "@/components/retroui/Card";
import PaginatedTable from "@/components/PaginatedTable";
import { gbp } from "@/lib/format";
import type { CostEvent } from "@/lib/cost-stats";

interface Props {
  readonly events: CostEvent[];
}

export default function CostEventsTable({ events }: Props) {
  return (
    <Card className="block w-full">
      <Card.Header>
        <Card.Title className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Recent Cost Events
        </Card.Title>
        <Card.Description>Fuel and service records ordered by date.</Card.Description>
      </Card.Header>
      <Card.Content>
        <PaginatedTable
          rows={events}
          pageSize={12}
          getRowKey={(event) => event.id}
          emptyMessage="No cost records"
          columns={[
            { key: "date", header: "Date", render: (event) => event.date.slice(0, 10) },
            { key: "type", header: "Type", render: (event) => event.kind },
            { key: "label", header: "Label", render: (event) => event.label },
            { key: "location", header: "Location", render: (event) => event.location },
            {
              key: "odometer",
              header: "Odometer",
              className: "text-right text-secondary-foreground",
              render: (event) => `${event.odometer.toLocaleString()} mi`,
            },
            {
              key: "cost",
              header: "Cost",
              className: "text-right text-secondary-foreground",
              render: (event) => gbp(event.cost),
            },
          ]}
        />
      </Card.Content>
    </Card>
  );
}
