"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/retroui/Button";

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <Button size="sm" onClick={logout}>
      Sign out
    </Button>
  );
}
