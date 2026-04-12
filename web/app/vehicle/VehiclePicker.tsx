"use client";

import { useRouter } from "next/navigation";
import type { Vehicle } from "@/lib/drivvo";
import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";
import { Badge } from "@/components/retroui/Badge";

interface Props {
  vehicles: Vehicle[];
}

export default function VehiclePicker({ vehicles }: Props) {
  const router = useRouter();
  async function select(vehicleId: number) {
    await fetch("/api/auth/vehicle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vehicleId: String(vehicleId) }),
    });
    router.push("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <Card.Header>
          <Card.Title>Select a vehicle</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="space-y-3">
            {vehicles.map(v => (
              <Button
                key={v.vehicle_id}
                className="w-full h-auto py-4 px-4 flex flex-col items-start gap-1"
                onClick={() => select(v.vehicle_id)}
              >
                <div className="flex items-center gap-2 w-full">
                  <span className="font-bold text-base">
                    {v.make} {v.model}
                  </span>
                  {!v.active && <Badge variant="secondary">inactive</Badge>}
                </div>
                <span className="text-sm text-muted-foreground">
                  {v.year} · {v.plate}
                </span>
              </Button>
            ))}
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}
