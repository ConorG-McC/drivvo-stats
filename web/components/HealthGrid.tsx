import type { FuelEntry, ServiceEntry } from "@/lib/types";
import { gbp, mileFmt, yr, statusColor, COLOR_MAP } from "@/lib/format";
import styles from "./Dashboard.module.css";

interface Props {
  readonly fuel: FuelEntry[];
  readonly service: ServiceEntry[];
}

export default function HealthGrid({ fuel, service }: Props) {
  const sortedSvc = [...service].sort((a, b) => a.date.localeCompare(b.date));
  const sortedFuel = [...fuel].sort((a, b) => a.date.localeCompare(b.date));

  const latestOdo = Math.max(...fuel.map(e => e.odometer));
  const lastFill = sortedFuel[sortedFuel.length - 1];
  const daysSinceLastFill = Math.floor((Date.now() - new Date(lastFill.date).getTime()) / 86400000);

  const lastOilChange = [...sortedSvc]
    .filter(e => e.service_types.some(t => /oil change/i.test(t.name)))
    .sort((a, b) => b.date.localeCompare(a.date))[0];
  const kmSinceOil = lastOilChange ? latestOdo - lastOilChange.odometer : null;

  const oilTopUps = sortedSvc.filter(e => e.service_types.some(t => /oil top up/i.test(t.name)));
  const topUpsSinceOil = oilTopUps.filter(e => lastOilChange ? e.date > lastOilChange.date : true);

  let oilConsumptionColor = "green";
  if (topUpsSinceOil.length > 2) oilConsumptionColor = "red";
  else if (topUpsSinceOil.length > 0) oilConsumptionColor = "amber";

  const oilConsumptionNote = kmSinceOil && topUpsSinceOil.length > 0
    ? `~${(topUpsSinceOil.length / kmSinceOil * 1000).toFixed(2)} L/1000mi`
    : "No top-ups logged";

  const lastSvc = sortedSvc[sortedSvc.length - 1];
  const kmSinceLastSvc = latestOdo - lastSvc.odometer;

  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  const recentFuel = fuel.filter(e => new Date(e.date) >= threeMonthsAgo);
  const avgRecentPpl = recentFuel.length
    ? recentFuel.reduce((s, e) => s + e.price_per_litre, 0) / recentFuel.length
    : 0;

  const thisYear = new Date().getFullYear().toString();
  const fuelThisYear = fuel.filter(e => yr(e.date) === thisYear).reduce((s, e) => s + e.total_cost, 0);
  const svcThisYear = service.filter(e => yr(e.date) === thisYear)
    .reduce((s, e) => s + e.service_types.reduce((ss, t) => ss + (t.amount ?? 0), 0), 0);

  const oilPct = kmSinceOil != null ? kmSinceOil / 10000 : 0;
  const svcPct = kmSinceLastSvc / 10000;

  const cards = [
    { label: "Since last oil change", value: kmSinceOil != null ? mileFmt(kmSinceOil) + " mi" : "—", sub: lastOilChange?.date.slice(0, 10) ?? "", pct: oilPct, color: statusColor(oilPct) },
    { label: "Since last service",    value: mileFmt(kmSinceLastSvc) + " mi", sub: `${lastSvc.date.slice(0, 10)} · ${lastSvc.location?.name ?? ""}`, pct: svcPct, color: statusColor(svcPct) },
    { label: "Oil consumption",       value: `${topUpsSinceOil.length} top-up${topUpsSinceOil.length !== 1 ? "s" : ""}`, sub: oilConsumptionNote, pct: Math.min(topUpsSinceOil.length / 5, 1), color: oilConsumptionColor },
    { label: "Last fill-up",          value: `${daysSinceLastFill}d ago`, sub: `${gbp(lastFill.total_cost)} · ${lastFill.date.slice(0, 10)}`, pct: null, color: "blue" },
    { label: "Avg price/litre (3mo)", value: `£${avgRecentPpl.toFixed(3)}`, sub: `${recentFuel.length} fills in period`, pct: null, color: "blue" },
    { label: `Spend ${thisYear}`,     value: gbp(fuelThisYear + svcThisYear), sub: `Fuel: ${gbp(fuelThisYear)} · Service: ${gbp(svcThisYear)}`, pct: null, color: "blue" },
  ];

  return (
    <>
      <p className={styles.sectionLabel}>Health at a glance</p>
      <div className={styles.healthGrid}>
        {cards.map(c => {
          const col = COLOR_MAP[c.color] ?? COLOR_MAP.blue;
          return (
            <div key={c.label} className={styles.healthCard}>
              <div className={styles.hcLabel}>{c.label}</div>
              <div className={styles.hcValue} style={{ color: c.pct != null ? col : "var(--text)" }}>{c.value}</div>
              <div className={styles.hcSub}>{c.sub}</div>
              {c.pct != null && (
                <div className={styles.progress}>
                  <div className={styles.progressBar} style={{ width: `${Math.min(c.pct * 100, 100).toFixed(1)}%`, background: col }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
