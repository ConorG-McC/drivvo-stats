import ServiceBreakdownTables from "@/components/service/ServiceBreakdownTables";
import ServiceHistoryTable from "@/components/service/ServiceHistoryTable";
import ServiceSchedulePanel from "@/components/service/ServiceSchedulePanel";
import ServiceSummaryCards from "@/components/service/ServiceSummaryCards";
import WatchPoints from "@/components/WatchPoints";
import type { ServiceEntry } from "@/lib/types";
import {
  getServiceLocationStats,
  getServiceSchedule,
  getServiceTypeStats,
} from "@/lib/service-stats";
import { getServiceWatchPoints } from "@/lib/watchpoints";

interface Props {
  readonly service: ServiceEntry[];
  readonly latestOdo: number;
  readonly serviceError?: string | null;
}

export default function ServicePageContent({ service, latestOdo, serviceError }: Props) {
  const schedule = getServiceSchedule(service, latestOdo);
  const types = getServiceTypeStats(service);
  const locations = getServiceLocationStats(service);
  const watchpoints = getServiceWatchPoints({ service, latestOdo, serviceError });

  return (
    <>
      <ServiceSummaryCards service={service} latestOdo={latestOdo} />
      <div className="mb-8">
        <WatchPoints
          watchpoints={watchpoints}
          title="Service watchpoints"
          description="Service-specific checks from schedule intervals, spend, and odometer readings."
          emptyMessage="No service watchpoints from the current records."
        />
      </div>
      <div className="mb-8">
        <ServiceSchedulePanel items={schedule} />
      </div>
      <div className="mb-8">
        <ServiceBreakdownTables types={types} locations={locations} />
      </div>
      <ServiceHistoryTable service={service} />
    </>
  );
}
