import { createFileRoute } from "@tanstack/react-router";
import { ChatWindow } from "@/components/chat-window";
import { PortfolioNavbar } from "@/components/navbar";

export const Route = createFileRoute("/chat")({
  component: ChatPage,
});

function ChatPage() {
  return (
    <div className="relative min-h-svh overflow-hidden bg-background">
      <PortfolioNavbar show showName useSharedName nameTo="/" />
      <ChatWindow />
    </div>
  );
}
