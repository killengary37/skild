import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return(
    <main>
      <h1>Hello from Tanstack start</h1>
    </main>
  );
}
