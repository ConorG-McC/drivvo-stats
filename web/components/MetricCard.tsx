import { Card } from "@/components/retroui/Card";

interface Props {
  readonly label: string;
  readonly value: string;
  readonly detail?: string;
}

export default function MetricCard({ label, value, detail }: Props) {
  return (
    <Card className="block w-full">
      <Card.Header className="pb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      </Card.Header>
      <Card.Content>
        <div className="font-head text-2xl font-bold">{value}</div>
        {detail && <p className="mt-2 text-xs text-muted-foreground">{detail}</p>}
      </Card.Content>
    </Card>
  );
}
