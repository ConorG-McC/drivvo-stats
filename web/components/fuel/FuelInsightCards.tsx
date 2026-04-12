import { Badge } from "@/components/retroui/Badge";
import { Card } from "@/components/retroui/Card";
import type { FuelEntry } from "@/lib/types";
import type { FuelRow, MonthlyFuelStat } from "@/lib/fuel-stats";
import { getTotalFuelCost } from "@/lib/fuel-stats";
import { gbp } from "@/lib/format";
import { economyFmt, pricePerLitreFmt, signedPercentFmt } from "@/components/fuel/fuel-format";

interface Props {
  readonly rows: FuelRow[];
  readonly economyRows: FuelRow[];
  readonly monthlyStats: MonthlyFuelStat[];
  readonly latestFill?: FuelEntry;
  readonly averageEconomy: number;
  readonly averagePrice: number;
}

function percentChange(current: number, baseline: number) {
  if (!baseline) return null;
  return ((current - baseline) / baseline) * 100;
}

function badgeForPercent(value: number | null, lowerIsBetter = false) {
  if (value == null) return { label: "No baseline", variant: "default" as const };
  const isBetter = lowerIsBetter ? value < 0 : value > 0;
  if (Math.abs(value) < 3) return { label: "Stable", variant: "default" as const };
  return {
    label: isBetter ? "Better" : "Watch",
    variant: isBetter ? ("surface" as const) : ("secondary" as const),
  };
}

export default function FuelInsightCards({
  rows,
  economyRows,
  monthlyStats,
  latestFill,
  averageEconomy,
  averagePrice,
}: Props) {
  const recentEconomyRows = economyRows.slice(-3);
  const recentEconomy = recentEconomyRows.length
    ? recentEconomyRows.reduce((sum, row) => sum + (row.milesPerGallonUk ?? 0), 0) / recentEconomyRows.length
    : 0;
  const economyChange = recentEconomy ? percentChange(recentEconomy, averageEconomy) : null;
  const economyBadge = badgeForPercent(economyChange);

  const latestPriceChange = latestFill ? percentChange(latestFill.price_per_litre, averagePrice) : null;
  const priceBadge = badgeForPercent(latestPriceChange, true);

  const currentMonth = monthlyStats[monthlyStats.length - 1];
  const previousMonth = monthlyStats[monthlyStats.length - 2];
  const monthChange = currentMonth && previousMonth ? percentChange(currentMonth.spend, previousMonth.spend) : null;
  const monthBadge = badgeForPercent(monthChange, true);

  const biggestFill = [...rows]
    .sort((a, b) => getTotalFuelCost(b.entry) - getTotalFuelCost(a.entry))[0];

  const insights = [
    {
      title: "Recent economy",
      value: recentEconomy ? economyFmt(recentEconomy) : "-",
      detail: `${signedPercentFmt(economyChange)} vs long-term average`,
      badge: economyBadge,
    },
    {
      title: "Latest pump price",
      value: latestFill ? pricePerLitreFmt(latestFill.price_per_litre) : "-",
      detail: `${signedPercentFmt(latestPriceChange)} vs average price`,
      badge: priceBadge,
    },
    {
      title: "This month",
      value: currentMonth ? gbp(currentMonth.spend) : "-",
      detail: `${signedPercentFmt(monthChange)} vs previous month`,
      badge: monthBadge,
    },
    {
      title: "Biggest fill",
      value: biggestFill ? gbp(getTotalFuelCost(biggestFill.entry)) : "-",
      detail: biggestFill ? biggestFill.entry.date.slice(0, 10) : "No fill-ups",
      badge: { label: biggestFill?.entry.fuel_station?.name ?? "Fuel", variant: "default" as const },
    },
  ];

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {insights.map((insight) => (
        <Card key={insight.title} className="block w-full">
          <Card.Header className="flex flex-row items-start justify-between gap-3 pb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {insight.title}
            </span>
            <Badge variant={insight.badge.variant} size="sm">
              {insight.badge.label}
            </Badge>
          </Card.Header>
          <Card.Content>
            <div className="font-head text-2xl font-bold">{insight.value}</div>
            <p className="mt-2 text-xs text-muted-foreground">{insight.detail}</p>
          </Card.Content>
        </Card>
      ))}
    </div>
  );
}
