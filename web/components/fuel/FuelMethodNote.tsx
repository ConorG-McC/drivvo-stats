import { Card } from "@/components/retroui/Card";
import type { FuelRow } from "@/lib/fuel-stats";
import { economyFmt } from "@/components/fuel/fuel-format";

interface Props {
  readonly bestRow?: FuelRow;
  readonly worstRow?: FuelRow;
  readonly latestRow?: FuelRow;
}

export default function FuelMethodNote({ bestRow, worstRow, latestRow }: Props) {
  return (
    <Card className="block w-full">
      <Card.Header>
        <Card.Title className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Fuel Notes
        </Card.Title>
      </Card.Header>
      <Card.Content className="space-y-4 text-sm">
        <div>
          <div className="font-semibold">Latest fill</div>
          <div className="text-muted-foreground">
            {latestRow
              ? `${latestRow.entry.date.slice(0, 10)} · ${latestRow.entry.odometer.toLocaleString()} mi`
              : "No fill-ups yet"}
          </div>
        </div>
        <div>
          <div className="font-semibold">Best interval</div>
          <div className="text-muted-foreground">
            {bestRow
              ? `${economyFmt(bestRow.milesPerGallonUk)} over ${bestRow.intervalMiles?.toLocaleString()} miles`
              : "Needs two full-tank fill-ups"}
          </div>
        </div>
        <div>
          <div className="font-semibold">Worst interval</div>
          <div className="text-muted-foreground">
            {worstRow
              ? `${economyFmt(worstRow.milesPerGallonUk)} over ${worstRow.intervalMiles?.toLocaleString()} miles`
              : "Needs two full-tank fill-ups"}
          </div>
        </div>
        <div>
          <div className="font-semibold">Litres</div>
          <div className="text-muted-foreground">
            Estimated from total cost and price per litre when volume is not logged.
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}
