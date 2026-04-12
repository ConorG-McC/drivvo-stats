import { Text } from "@/components/retroui/Text";

interface Props {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
}

export default function RouteHeader({ eyebrow, title, description }: Props) {
  return (
    <header className="mb-6">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {eyebrow}
      </p>
      <Text as="h1" className="text-3xl font-bold tracking-tight">
        {title}
      </Text>
      <Text as="p" className="mt-2 max-w-3xl text-sm text-muted-foreground">
        {description}
      </Text>
    </header>
  );
}
