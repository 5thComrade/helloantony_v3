import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-background p-8">
      <div className="text-center">
        <h1 className="text-5xl font-bold tracking-tight text-foreground">
          Hello World
        </h1>

        <p className="mt-4 text-muted-foreground">
          Plus Jakarta Sans · Zen Inspired
        </p>

        <Button className="mt-8">Test Theme</Button>
      </div>
    </main>
  );
}
