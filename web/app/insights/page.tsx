import AppNav from "@/components/AppNav";
import DataLoadNotice from "@/components/DataLoadNotice";
import RouteHeader from "@/components/RouteHeader";
import ServiceSchedulePanel from "@/components/service/ServiceSchedulePanel";
import WatchPoints from "@/components/WatchPoints";
import { getDashboardData } from "@/lib/dashboard-data";
import { getServiceSchedule } from "@/lib/service-stats";
import { getFuelWatchPoints, getGeneralWatchPoints, getServiceWatchPoints } from "@/lib/watchpoints";

export default async function InsightsPage() {
  const { fuel, service, latestOdo, fuelError, serviceError } = await getDashboardData();
  const fuelWatchpoints = getFuelWatchPoints({ fuel, fuelError });
  const serviceWatchpoints = getServiceWatchPoints({ service, latestOdo, serviceError });
  const generalWatchpoints = getGeneralWatchPoints({ fuel, service });
  const serviceSchedule = serviceError ? [] : getServiceSchedule(service, latestOdo);

  return (
    <main className="mx-auto max-w-7xl p-6">
      <RouteHeader
        eyebrow="Insights"
        title="Vehicle Checks"
        description="General watchpoints and maintenance checks from the records we can load."
      />
      <AppNav className="mb-8" />
      <DataLoadNotice
        errors={[
          { source: "Fuel", message: fuelError },
          { source: "Service", message: serviceError },
        ]}
      />
      <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <WatchPoints
          watchpoints={fuelWatchpoints}
          title="Fuel watchpoints"
          description="Fuel-specific checks from fill-ups, economy, prices, and odometer readings."
          emptyMessage="No fuel watchpoints from the current records."
        />
        <WatchPoints
          watchpoints={serviceWatchpoints}
          title="Service watchpoints"
          description="Service-specific checks from schedule intervals, spend, and odometer readings."
          emptyMessage="No service watchpoints from the current records."
        />
      </div>
      {generalWatchpoints.length > 0 && (
        <div className="mb-8">
          <WatchPoints
            watchpoints={generalWatchpoints}
            title="Cross-record watchpoints"
            description="Checks that need multiple record types to compare cleanly."
            emptyMessage="No cross-record watchpoints from the current records."
          />
        </div>
      )}
      {!serviceError && <ServiceSchedulePanel items={serviceSchedule} />}
    </main>
  );
}
