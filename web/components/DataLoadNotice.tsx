import { Badge } from "@/components/retroui/Badge";
import { Card } from "@/components/retroui/Card";
import { cn } from "@/lib/utils";

interface Props {
  readonly title?: string;
  readonly errors: Array<{ source: string; message: string | null }>;
  readonly className?: string;
}

export default function DataLoadNotice({ title = "Some data could not load", errors, className }: Props) {
  const activeErrors = errors.filter((error) => error.message);
  if (activeErrors.length === 0) return null;

  return (
    <Card className={cn("mb-6 block w-full", className)}>
      <Card.Header className="flex flex-row items-start justify-between gap-3">
        <div>
          <Card.Title className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </Card.Title>
          <Card.Description>The page is using the data that is available.</Card.Description>
        </div>
        <Badge variant="secondary">{activeErrors.length} issue{activeErrors.length === 1 ? "" : "s"}</Badge>
      </Card.Header>
      <Card.Content className="space-y-2 text-sm text-muted-foreground">
        {activeErrors.map((error) => (
          <p key={error.source}>
            <span className="font-semibold text-foreground">{error.source}:</span> {error.message}
          </p>
        ))}
      </Card.Content>
    </Card>
  );
}
