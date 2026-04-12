import type { WatchPoint } from "@/lib/watchpoints";
import { Badge } from "@/components/retroui/Badge";
import { Card } from "@/components/retroui/Card";

interface Props {
  readonly watchpoints: WatchPoint[];
  readonly compact?: boolean;
  readonly title?: string;
  readonly description?: string;
  readonly emptyMessage?: string;
}

function badgeVariant(severity: WatchPoint["severity"]) {
  if (severity === "urgent") return "destructive" as const;
  if (severity === "watch") return "secondary" as const;
  return "default" as const;
}

export default function WatchPoints({
  watchpoints,
  compact = false,
  title = "Watchpoints",
  description = "Checks from the current records.",
  emptyMessage = "No watchpoints from the current records.",
}: Props) {
  const content = watchpoints.length === 0 ? (
    <p className="text-sm text-muted-foreground">{emptyMessage}</p>
  ) : (
    <div className={compact ? "space-y-3" : "grid grid-cols-1 gap-3 md:grid-cols-2"}>
      {watchpoints.map((watchpoint) => (
        <div key={watchpoint.id} className="border-2 border-border bg-card p-3 shadow-sm">
          <div className="mb-2 flex items-start justify-between gap-3">
            <div className="text-sm font-semibold">{watchpoint.title}</div>
            <Badge variant={badgeVariant(watchpoint.severity)} size="sm">
              {watchpoint.severity}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">{watchpoint.detail}</p>
        </div>
      ))}
    </div>
  );

  if (compact) {
    return (
      <div>
        <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </div>
        {content}
      </div>
    );
  }

  return (
    <Card className="block w-full">
      <Card.Header>
        <Card.Title className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </Card.Title>
        <Card.Description>{description}</Card.Description>
      </Card.Header>
      <Card.Content>
        {content}
      </Card.Content>
    </Card>
  );
}
