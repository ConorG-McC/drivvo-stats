"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";
import { Text } from "@/components/retroui/Text";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  const isAuth = error.message === "UNAUTHORIZED";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md text-center">
        <Card.Header>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {isAuth ? "Session expired" : "Something went wrong"}
          </p>
          <Text as="h1" className="text-3xl font-bold">
            {isAuth ? "Sign in again" : "Unable to load data"}
          </Text>
          <Card.Description>
            {isAuth
              ? "Your session has expired. Please sign in again."
              : "There was a problem loading your data. This might be a temporary issue with the Drivvo API."}
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <div className="flex flex-wrap justify-center gap-3">
          {isAuth ? (
            <Button onClick={() => router.push("/login")}>Sign in</Button>
          ) : (
            <>
              <Button onClick={reset}>Try again</Button>
              <Button onClick={() => router.push("/login")}>
                Sign in again
              </Button>
            </>
          )}
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}
