import Link from "next/link";
import { Badge } from "@/components/retroui/Badge";
import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";
import WatchPoints from "@/components/WatchPoints";
import type { ServiceEntry } from "@/lib/types";
import { gbp, mileFmt } from "@/lib/format";
import {
  getServiceCost,
  getServiceSchedule,
  getServiceWork,
  sortServiceByDate,
} from "@/lib/service-stats";
import { getServiceWatchPoints } from "@/lib/watchpoints";

interface Props {
  readonly service: ServiceEntry[];
  readonly latestOdo: number;
  readonly serviceError?: string | null;
}

export default function ServiceDashboardPanel({ service, latestOdo, serviceError }: Props) {
  const totalSpend = service.reduce((sum, entry) => sum + getServiceCost(entry), 0);
  const latest = sortServiceByDate(service).at(-1);
  const schedule = getServiceSchedule(service, latestOdo);
  const watchpoints = getServiceWatchPoints({ service, latestOdo, serviceError }).slice(0, 2);

  return (
    <Card className="block h-full w-full">
      <Card.Header className="flex flex-row items-start justify-between gap-3">
        <div>
          <Card.Title className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Services
          </Card.Title>
          <Card.Description>Maintenance spend and next due items.</Card.Description>
        </div>
        <Button asChild size="sm">
          <Link href="/services">Open</Link>
        </Button>
      </Card.Header>
      <Card.Content>
        <div className="mb-4 grid grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-muted-foreground">Service spend</div>
            <div className="font-head text-2xl font-bold">{gbp(totalSpend)}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Records</div>
            <div className="font-head text-2xl font-bold">{service.length}</div>
          </div>
        </div>
        {watchpoints.length > 0 && (
          <div className="mb-4">
            <WatchPoints
              watchpoints={watchpoints}
              compact
              title="Service watchpoints"
              emptyMessage="No service watchpoints from the current records."
            />
          </div>
        )}
        <div className="mb-4 text-sm">
          <div className="font-semibold">Latest work</div>
          <div className="text-muted-foreground">
            {latest ? `${latest.date.slice(0, 10)} · ${getServiceWork(latest)}` : "No service records"}
          </div>
        </div>
        <div className="space-y-3">
          {schedule.slice(0, 3).map((item) => (
            <div key={item.name} className="border-b border-border pb-3 last:border-0 last:pb-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold">{item.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {item.remainingMiles > 0
                      ? `Due in ~${mileFmt(item.remainingMiles)} mi`
                      : `Overdue by ~${mileFmt(Math.abs(item.remainingMiles))} mi`}
                  </div>
                </div>
                <Badge
                  variant={
                    item.status === "overdue"
                      ? "destructive"
                      : item.status === "soon"
                        ? "secondary"
                        : "default"
                  }
                  size="sm"
                >
                  {item.status === "overdue" ? "Overdue" : item.status === "soon" ? "Soon" : "OK"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card.Content>
    </Card>
  );
}
