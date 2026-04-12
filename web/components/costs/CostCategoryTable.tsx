"use client";

import { Card } from "@/components/retroui/Card";
import PaginatedTable from "@/components/PaginatedTable";
import { gbp } from "@/lib/format";
import type { CostCategoryStat } from "@/lib/cost-stats";

interface Props {
  readonly categories: CostCategoryStat[];
}

export default function CostCategoryTable({ categories }: Props) {
  return (
    <Card className="block w-full">
      <Card.Header>
        <Card.Title className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Spend By Category
        </Card.Title>
      </Card.Header>
      <Card.Content>
        <PaginatedTable
          rows={categories}
          pageSize={10}
          getRowKey={(category) => category.category}
          emptyMessage="No cost categories"
          columns={[
            { key: "category", header: "Category", render: (category) => category.category },
            {
              key: "count",
              header: "Count",
              className: "text-right text-secondary-foreground",
              render: (category) => category.count,
            },
            {
              key: "spend",
              header: "Spend",
              className: "text-right text-secondary-foreground",
              render: (category) => gbp(category.spend),
            },
          ]}
        />
      </Card.Content>
    </Card>
  );
}
