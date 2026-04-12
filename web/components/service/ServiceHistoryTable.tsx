"use client";

import { Card } from "@/components/retroui/Card";
import PaginatedTable from "@/components/PaginatedTable";
import type { ServiceEntry } from "@/lib/types";
import { gbp } from "@/lib/format";
import { getServiceCost, getServiceWork, sortServiceByDate } from "@/lib/service-stats";

interface Props {
  readonly service: ServiceEntry[];
}

export default function ServiceHistoryTable({ service }: Props) {
  const rows = sortServiceByDate(service).reverse();

  return (
    <Card className="block w-full">
      <Card.Header>
        <Card.Title className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Service History
        </Card.Title>
        <Card.Description>Latest service records and line-item totals.</Card.Description>
      </Card.Header>
      <Card.Content>
        <PaginatedTable
          rows={rows}
          pageSize={10}
          getRowKey={(entry) => entry.service_id}
          emptyMessage="No service records"
          columns={[
            { key: "date", header: "Date", render: (entry) => entry.date.slice(0, 10) },
            { key: "work", header: "Work", render: (entry) => getServiceWork(entry) },
            { key: "location", header: "Location", render: (entry) => entry.location?.name ?? "-" },
            {
              key: "odometer",
              header: "Odometer",
              className: "text-right text-secondary-foreground",
              render: (entry) => `${entry.odometer.toLocaleString()} mi`,
            },
            {
              key: "cost",
              header: "Cost",
              className: "text-right text-secondary-foreground",
              render: (entry) => gbp(getServiceCost(entry)),
            },
          ]}
        />
      </Card.Content>
    </Card>
  );
}
