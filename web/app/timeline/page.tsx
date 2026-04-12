import AppNav from "@/components/AppNav";
import DataLoadNotice from "@/components/DataLoadNotice";
import MetricCard from "@/components/MetricCard";
import RecentActivityList from "@/components/RecentActivityList";
import RouteHeader from "@/components/RouteHeader";
import { Card } from "@/components/retroui/Card";
import { getDashboardData } from "@/lib/dashboard-data";

export default async function TimelinePage() {
  const { fuel, service, latestOdo, fuelError, serviceError } = await getDashboardData();

  return (
    <main className="mx-auto max-w-7xl p-6">
      <RouteHeader
        eyebrow="Timeline"
        title="Vehicle Timeline"
        description="A single stream of fuel stops, service work, and odometer movement."
      />
      <AppNav className="mb-8" />
      <DataLoadNotice
        errors={[
          { source: "Fuel", message: fuelError },
          { source: "Service", message: serviceError },
        ]}
      />
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricCard label="Latest odometer" value={`${latestOdo.toLocaleString()} mi`} />
        <MetricCard label="Fuel entries" value={fuel.length.toLocaleString()} />
        <MetricCard label="Service entries" value={service.length.toLocaleString()} />
      </div>
      <Card className="block w-full">
        <Card.Header>
          <Card.Title className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Activity
          </Card.Title>
        </Card.Header>
        <Card.Content>
          <RecentActivityList fuel={fuel} service={service} limit={40} />
        </Card.Content>
      </Card>
    </main>
  );
}
