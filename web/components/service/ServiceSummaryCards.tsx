import MetricCard from "@/components/MetricCard";
import type { ServiceEntry } from "@/lib/types";
import { gbp } from "@/lib/format";
import { getServiceCost, getServiceWork } from "@/lib/service-stats";

interface Props {
  readonly service: ServiceEntry[];
  readonly latestOdo: number;
}

export default function ServiceSummaryCards({ service, latestOdo }: Props) {
  const totalSpend = service.reduce((sum, entry) => sum + getServiceCost(entry), 0);
  const paidRecords = service.filter((entry) => getServiceCost(entry) > 0).length;
  const latest = [...service].sort((a, b) => b.date.localeCompare(a.date))[0];
  const largest = [...service].sort((a, b) => getServiceCost(b) - getServiceCost(a))[0];

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <MetricCard label="Service spend" value={gbp(totalSpend)} detail={`${paidRecords} paid records`} />
      <MetricCard label="Service records" value={service.length.toLocaleString()} />
      <MetricCard
        label="Latest work"
        value={latest ? latest.date.slice(0, 10) : "-"}
        detail={latest ? `${getServiceWork(latest)} · ${latest.odometer.toLocaleString()} mi` : "No service records"}
      />
      <MetricCard
        label="Largest item"
        value={largest ? gbp(getServiceCost(largest)) : "-"}
        detail={largest ? getServiceWork(largest) : `${latestOdo.toLocaleString()} mi logged`}
      />
    </div>
  );
}
