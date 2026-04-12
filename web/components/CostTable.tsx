import type { FuelEntry, ServiceEntry } from "@/lib/types";
import { gbp, yr } from "@/lib/format";
import { Card } from "@/components/retroui/Card";
import { Table } from "./retroui/Table";

interface Props {
  readonly fuel: FuelEntry[];
  readonly service: ServiceEntry[];
}

export default function CostTable({ fuel, service }: Props) {
  const tcoF: Record<string, number> = {};
  const tcoS: Record<string, number> = {};
  const tcoC: Record<string, number> = {};
  const tcoP: Record<string, number> = {};

  fuel.forEach((e) => {
    const y = yr(e.date);
    tcoF[y] = (tcoF[y] ?? 0) + e.total_cost;
    tcoC[y] = (tcoC[y] ?? 0) + 1;
    tcoP[y] = (tcoP[y] ?? 0) + e.price_per_litre;
  });
  service.forEach((e) => {
    const y = yr(e.date);
    tcoS[y] = (tcoS[y] ?? 0) +
      e.service_types.reduce((s, t) => s + (t.amount ?? 0), 0);
  });

  const allYears = [...new Set([...Object.keys(tcoF), ...Object.keys(tcoS)])]
    .sort((a, b) => a.localeCompare(b));

  return (
    <Card>
      <Card.Header>
        <Card.Title className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Cost of ownership by year
        </Card.Title>
      </Card.Header>
      <Card.Content>
        <Table className="border-0 shadow-none">
          <Table.Header className="sticky top-0">
            <Table.Row className="bg-secondary hover:bg-secondary">
              <Table.Head className="w-[100px] text-secondary-foreground">
                Year
              </Table.Head>
              <Table.Head className="text-secondary-foreground">
                Fuel
              </Table.Head>
              <Table.Head className="text-secondary-foreground">
                Servicing
              </Table.Head>
              <Table.Head className="text-secondary-foreground">
                Total
              </Table.Head>
              <Table.Head className="text-right text-secondary-foreground">
                Fills
              </Table.Head>
              <Table.Head className="text-right text-secondary-foreground">
                Avg P/L
              </Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {allYears.map((y) => {
              const f = tcoF[y] ?? 0,
                s = tcoS[y] ?? 0,
                c = tcoC[y] ?? 0,
                p = tcoP[y] ?? 0;
              return (
                <Table.Row
                  key={y}
                >
                  <Table.Cell>{y}</Table.Cell>
                  <Table.Cell>
                    {gbp(f)}
                  </Table.Cell>
                  <Table.Cell>
                    {gbp(s)}
                  </Table.Cell>
                  <Table.Cell>
                    {gbp(f + s)}
                  </Table.Cell>
                  <Table.Cell>
                    {c}
                  </Table.Cell>
                  <Table.Cell>£{c ? (p / c).toFixed(3) : "—"}</Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </Card.Content>
    </Card>
  );
}
