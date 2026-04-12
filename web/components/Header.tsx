import LogoutButton from "./LogoutButton";
import { Card } from "@/components/retroui/Card";
import { Text } from "@/components/retroui/Text";
import type { Vehicle } from "@/lib/drivvo";

interface Props {
  readonly latestOdo: number;
  readonly vehicle: Vehicle;
}

export default function Header({ latestOdo, vehicle }: Props) {
  const title = vehicle.vehicle_name || [vehicle.make, vehicle.model].filter(Boolean).join(" ") || "Vehicle";
  const details = [
    vehicle.year,
    vehicle.make,
    vehicle.model,
    vehicle.plate,
  ].filter(Boolean).join(" · ");

  return (
    <div className="flex items-start justify-between mb-8 flex-wrap gap-3">
      <div>
        <Text as="h1" className="text-3xl font-bold tracking-tight">
          {title}
        </Text>
        <Text as="p" className="mt-1 text-sm text-muted-foreground">
          {details || "Selected vehicle"}
        </Text>
      </div>
      <div className="flex items-start gap-3">
        <Card className="px-4 py-3">
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Odometer</div>
          <div className="text-2xl font-bold font-head">{latestOdo.toLocaleString()} mi</div>
        </Card>
        <LogoutButton />
      </div>
    </div>
  );
}
