import Link from "next/link";
import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";
import { Table } from "@/components/retroui/Table";
import WatchPoints from "@/components/WatchPoints";
import type { FuelEntry } from "@/lib/types";
import { buildFuelRows, getFuelLitres, getTotalFuelCost } from "@/lib/fuel-stats";
import { gbp } from "@/lib/format";
import { getFuelWatchPoints } from "@/lib/watchpoints";
import { economyFmt, pricePerLitreFmt } from "@/components/fuel/fuel-format";

interface Props {
  readonly fuel: FuelEntry[];
  readonly fuelError?: string | null;
}

export default function FuelDashboardPanel({ fuel, fuelError }: Props) {
  const rows = buildFuelRows(fuel);
  const recentRows = [...rows].reverse().slice(0, 3);
  const economyRows = rows.filter((row) => row.milesPerGallonUk != null);
  const totalSpend = fuel.reduce((sum, entry) => sum + getTotalFuelCost(entry), 0);
  const totalLitres = fuel.reduce((sum, entry) => sum + (getFuelLitres(entry) ?? 0), 0);
  const averagePrice = totalLitres > 0 ? totalSpend / totalLitres : 0;
  const recentEconomy = economyRows.length
    ? economyRows.slice(-3).reduce((sum, row) => sum + (row.milesPerGallonUk ?? 0), 0) /
      Math.min(economyRows.length, 3)
    : 0;
  const latestRow = rows[rows.length - 1];
  const watchpoints = getFuelWatchPoints({ fuel, fuelError }).slice(0, 2);

  return (
    <Card className="block h-full w-full">
      <Card.Header className="flex flex-row items-start justify-between gap-3">
        <div>
          <Card.Title className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Fuel
          </Card.Title>
          <Card.Description>Spend, price, and full-tank economy.</Card.Description>
        </div>
        <Button asChild size="sm">
          <Link href="/fuel">Open</Link>
        </Button>
      </Card.Header>
      <Card.Content>
        <div className="mb-4 grid grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-muted-foreground">Total fuel</div>
            <div className="font-head text-2xl font-bold">{gbp(totalSpend)}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Recent economy</div>
            <div className="font-head text-2xl font-bold">
              {recentEconomy ? economyFmt(recentEconomy) : "-"}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Average p/l</div>
            <div className="font-head text-xl font-bold">{pricePerLitreFmt(averagePrice)}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Latest fill</div>
            <div className="font-head text-xl font-bold">
              {latestRow ? gbp(getTotalFuelCost(latestRow.entry)) : "-"}
            </div>
          </div>
        </div>
        {watchpoints.length > 0 && (
          <div className="mb-4">
            <WatchPoints
              watchpoints={watchpoints}
              compact
              title="Fuel watchpoints"
              emptyMessage="No fuel watchpoints from the current records."
            />
          </div>
        )}
        <Table className="border-0 shadow-none">
          <Table.Header>
            <Table.Row className="bg-secondary hover:bg-secondary">
              <Table.Head className="text-secondary-foreground">Date</Table.Head>
              <Table.Head className="text-right text-secondary-foreground">P/L</Table.Head>
              <Table.Head className="text-right text-secondary-foreground">Cost</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {recentRows.map((row) => (
              <Table.Row key={row.entry.fuel_entry_id}>
                <Table.Cell>{row.entry.date.slice(0, 10)}</Table.Cell>
                <Table.Cell className="text-right">{pricePerLitreFmt(row.entry.price_per_litre)}</Table.Cell>
                <Table.Cell className="text-right">{gbp(getTotalFuelCost(row.entry))}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Card.Content>
    </Card>
  );
}
