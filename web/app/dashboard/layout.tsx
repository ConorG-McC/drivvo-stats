import type { ReactNode } from "react";
import AppNav from "@/components/AppNav";

interface Props {
  readonly children: ReactNode;
  readonly services: ReactNode;
  readonly fuel: ReactNode;
  readonly costs: ReactNode;
  readonly timeline: ReactNode;
}

export default function DashboardLayout({ children, services, fuel, costs, timeline }: Props) {
  return (
    <main className="mx-auto max-w-7xl p-6">
      {children}
      <AppNav className="mb-8" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-6">
        <section className="lg:col-span-3">{services}</section>
        <section className="lg:col-span-3">{fuel}</section>
        <section className="lg:col-span-3">{costs}</section>
        <section className="lg:col-span-3">{timeline}</section>
      </div>
    </main>
  );
}
