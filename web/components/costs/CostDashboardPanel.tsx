import Link from "next/link";
import { Badge } from "@/components/retroui/Badge";
import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";
import type { CostSummary, MonthlyCostStat } from "@/lib/cost-stats";
import { gbp } from "@/lib/format";

interface Props {
  readonly summary: CostSummary;
  readonly months: MonthlyCostStat[];
  readonly fuelError?: string | null;
  readonly serviceError?: string | null;
}

function monthLabel(month: string) {
  const [year, monthNumber] = month.split("-");
  return `${monthNumber}/${year.slice(2)}`;
}

function percentage(value: number, total: number) {
  return total > 0 ? Math.round((value / total) * 100) : 0;
}

export default function CostDashboardPanel({ summary, months, fuelError, serviceError }: Props) {
  const currentMonth = months.at(-1);
  const activeMonths = months.filter((month) => month.totalSpend > 0);
  const recentAverage = activeMonths.length
    ? activeMonths.reduce((sum, month) => sum + month.totalSpend, 0) / activeMonths.length
    : 0;
  const biggestMonth = months.reduce<MonthlyCostStat | undefined>((largest, month) => {
    if (!largest || month.totalSpend > largest.totalSpend) return month;
    return largest;
  }, undefined);
  const maxMonthSpend = Math.max(0, ...months.map((month) => month.totalSpend));
  const fuelShare = percentage(summary.fuelSpend, summary.totalSpend);
  const serviceShare = percentage(summary.serviceSpend, summary.totalSpend);
  const eventCount = summary.fuelCount + summary.serviceCount;
  const partialSources = [
    fuelError ? "fuel" : null,
    serviceError ? "service" : null,
  ].filter(Boolean);

  return (
    <Card className="block h-full w-full">
      <Card.Header className="flex flex-row items-start justify-between gap-3">
        <div>
          <Card.Title className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Costs
          </Card.Title>
          <Card.Description>Monthly spend and ownership mix.</Card.Description>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {partialSources.length > 0 && <Badge variant="secondary">Partial</Badge>}
          <Button asChild size="sm">
            <Link href="/costs">Open</Link>
          </Button>
        </div>
      </Card.Header>
      <Card.Content>
        <div className="mb-4 grid grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-muted-foreground">This month</div>
            <div className="font-head text-2xl font-bold">{gbp(currentMonth?.totalSpend ?? 0)}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Recent avg</div>
            <div className="font-head text-2xl font-bold">{recentAverage ? gbp(recentAverage) : "-"}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Total logged</div>
            <div className="font-head text-xl font-bold">{gbp(summary.totalSpend)}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Cost events</div>
            <div className="font-head text-xl font-bold">{eventCount}</div>
          </div>
        </div>

        <div className="mb-4 space-y-3">
          <div>
            <div className="mb-1 flex justify-between text-xs text-muted-foreground">
              <span>Fuel</span>
              <span>
                {gbp(summary.fuelSpend)} · {fuelShare}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-sm border border-border bg-card">
              <div className="h-full bg-primary" style={{ width: `${fuelShare}%` }} />
            </div>
          </div>
          <div>
            <div className="mb-1 flex justify-between text-xs text-muted-foreground">
              <span>Service</span>
              <span>
                {gbp(summary.serviceSpend)} · {serviceShare}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-sm border border-border bg-card">
              <div className="h-full bg-secondary" style={{ width: `${serviceShare}%` }} />
            </div>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Recent Months
            </div>
            <div className="text-xs text-muted-foreground">
              Peak {biggestMonth ? `${monthLabel(biggestMonth.month)} · ${gbp(biggestMonth.totalSpend)}` : "-"}
            </div>
          </div>
          <div className="space-y-2">
            {months.slice(-4).map((month) => {
              const width = percentage(month.totalSpend, maxMonthSpend);
              return (
                <div key={month.month} className="grid grid-cols-[3.5rem_1fr_4.5rem] items-center gap-2">
                  <div className="text-xs text-muted-foreground">{monthLabel(month.month)}</div>
                  <div className="h-3 overflow-hidden rounded-sm border border-border bg-card">
                    <div className="h-full bg-primary" style={{ width: `${width}%` }} />
                  </div>
                  <div className="text-right text-xs text-muted-foreground">{gbp(month.totalSpend)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}
