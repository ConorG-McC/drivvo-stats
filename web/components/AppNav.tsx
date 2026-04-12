import Link from "next/link";
import { Button } from "@/components/retroui/Button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/fuel", label: "Fuel" },
  { href: "/services", label: "Services" },
  { href: "/costs", label: "Costs" },
  { href: "/timeline", label: "Timeline" },
  { href: "/insights", label: "Insights" },
];

interface Props {
  readonly className?: string;
}

export default function AppNav({ className }: Props) {
  return (
    <nav className={cn("flex flex-wrap gap-2", className)} aria-label="Vehicle sections">
      {links.map((link) => (
        <Button key={link.href} asChild size="sm">
          <Link href={link.href}>{link.label}</Link>
        </Button>
      ))}
    </nav>
  );
}
