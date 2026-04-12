import Link from "next/link";
import { getDashboardData } from "@/lib/dashboard-data";
import { Card } from "@/components/retroui/Card";
import { Button } from "@/components/retroui/Button";
import RecentActivityList from "@/components/RecentActivityList";
import DataLoadNotice from "@/components/DataLoadNotice";

export default async function DashboardTimelineSlot() {
  const { fuel, service, fuelError, serviceError } = await getDashboardData();

  return (
    <div className="h-full">
      <DataLoadNotice
        errors={[
          { source: "Fuel", message: fuelError },
          { source: "Service", message: serviceError },
        ]}
        className="mb-4"
      />
      <Card className="block h-full w-full">
        <Card.Header className="flex flex-row items-start justify-between gap-3">
          <div>
            <Card.Title className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Timeline
            </Card.Title>
            <Card.Description>Recent fuel and service activity.</Card.Description>
          </div>
          <Button asChild size="sm">
            <Link href="/timeline">Open</Link>
          </Button>
        </Card.Header>
        <Card.Content>
          <RecentActivityList fuel={fuel} service={service} limit={5} />
        </Card.Content>
      </Card>
    </div>
  );
}
