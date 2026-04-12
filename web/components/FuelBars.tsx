import type { FuelEntry } from "@/lib/types";
import { gbp, ym, COLOR_MAP } from "@/lib/format";
import styles from "./Dashboard.module.css";

interface Props {
  readonly fuel: FuelEntry[];
}

export default function FuelBars({ fuel }: Props) {
  const months: string[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }

  const mSpend: Record<string, number> = Object.fromEntries(months.map(m => [m, 0]));
  fuel.forEach(e => {
    if (ym(e.date) in mSpend) mSpend[ym(e.date)] += e.total_cost;
  });
  const maxM = Math.max(...Object.values(mSpend), 1);

  return (
    <div className={styles.panel}>
      <p className={styles.sectionLabel}>Monthly fuel spend — last 12 months</p>
      {months.map(m => {
        const v = mSpend[m];
        const pct = (v / maxM * 100).toFixed(1);
        return (
          <div key={m} className={styles.barRow}>
            <div className={styles.barRowHeader}><span>{m}</span><span>{gbp(v)}</span></div>
            <div className={styles.barTrack}>
              <div className={styles.barFill} style={{ width: `${pct}%`, background: COLOR_MAP.blue }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
