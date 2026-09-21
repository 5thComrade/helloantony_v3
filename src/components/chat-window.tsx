import { ArrowUpIcon, CaretLeftIcon, CoffeeIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

type MessageRole = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: MessageRole;
  content: string;
};

const STARTER_PROMPTS = [
  "Tell me about Antony's recent engineering focus.",
  "What kind of projects has Antony worked on?",
  "What technologies does Antony prefer?",
];

function createMessage(role: MessageRole, content: string): ChatMessage {
  return {
    id: `${role}-${crypto.randomUUID()}`,
    role,
    content,
  };
}

export function ChatWindow() {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    createMessage(
      "assistant",
      "I can answer questions about Antony's professional background, work, and experience. Ask me anything.",
    ),
  ]);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [canScrollUp, setCanScrollUp] = useState(false);

  const updateScrollState = useCallback(() => {
    const container = scrollContainerRef.current;

    if (!container) {
      return;
    }

    const maxScrollTop = container.scrollHeight - container.clientHeight;
    const nextHasOverflow = maxScrollTop > 4;
    const nextCanScrollUp = container.scrollTop > 4;

    setHasOverflow(nextHasOverflow);
    setCanScrollUp(nextCanScrollUp);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;

    if (!container) {
      return;
    }

    const observer = new ResizeObserver(() => {
      updateScrollState();
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [updateScrollState]);

  const scrollToEnd = useCallback((behavior: ScrollBehavior = "smooth") => {
    const container = scrollContainerRef.current;

    if (!container) {
      return;
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior,
    });
  }, []);

  useEffect(() => {
    scrollToEnd(messages.length <= 2 ? "auto" : "smooth");

    const frameId = window.requestAnimationFrame(() => {
      updateScrollState();
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [messages, scrollToEnd, updateScrollState]);

  const submitPrompt = useCallback(
    async (input: string) => {
      const trimmed = input.trim();

      if (!trimmed || isLoading) {
        return;
      }

      const userMessage = createMessage("user", trimmed);
      setMessages((prev) => [...prev, userMessage]);
      setPrompt("");
      setIsLoading(true);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: trimmed }),
        });

        const payload = (await response.json()) as {
          answer?: string;
          error?: string;
        };

        if (!response.ok) {
          throw new Error(
            payload.error || "Unable to fetch an answer right now.",
          );
        }

        setMessages((prev) => [
          ...prev,
          createMessage(
            "assistant",
            payload.answer || "I don't have enough information to answer that.",
          ),
        ]);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Something went wrong while contacting the assistant.";

        setMessages((prev) => [...prev, createMessage("assistant", message)]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading],
  );

  const handleSubmit = useCallback(
    (event: React.SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();
      void submitPrompt(prompt);
    },
    [prompt, submitPrompt],
  );

  return (
    <motion.main
      className="relative z-20 h-svh overflow-hidden"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,color-mix(in_oklch,var(--primary)_14%,transparent)_0%,transparent_38%),radial-gradient(circle_at_100%_100%,color-mix(in_oklch,var(--secondary)_22%,transparent)_0%,transparent_42%)]" />

      <section className="relative mx-auto flex h-full w-full max-w-4xl flex-col px-4 pb-5 pt-20 md:px-6 md:pb-7">
        <div className="pb-3 flex items-center gap-4">
          <Button
            variant="outline"
            size="icon-lg"
            aria-label="Submit"
            className="cursor-pointer"
            onClick={() => window.history.back()}
          >
            <CaretLeftIcon />
          </Button>

          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
              Chat with Antony's Portfolio
            </p>

            <h2 className="mt-2 text-balance text-lg font-semibold tracking-tight text-foreground md:text-xl">
              Ask anything related to Antony's professional journey
            </h2>
          </div>
        </div>

        <div className="relative min-h-0 flex-1 overflow-hidden">
          <AnimatePresence>
            {hasOverflow && canScrollUp ? (
              <motion.div
                className="pointer-events-none absolute inset-x-0 top-0 z-10 h-12 bg-linear-to-b from-foreground/10 to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            ) : null}
          </AnimatePresence>

          <ScrollArea
            className="h-full"
            viewportRef={scrollContainerRef}
            viewportClassName="h-full pb-4 pr-6"
            onViewportScroll={updateScrollState}
          >
            <div className="flex min-h-full flex-col justify-end gap-4 pb-2 pt-8">
              {messages.map((message, index) => {
                const isUser = message.role === "user";

                return (
                  <motion.div
                    key={message.id}
                    className={`flex items-start ${isUser ? "justify-end" : "justify-start"}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: Math.min(index * 0.03, 0.16),
                      duration: 0.3,
                    }}
                  >
                    {isUser ? null : (
                      <span
                        className="mt-2 mr-4 shrink-0 text-foreground"
                        aria-hidden
                      >
                        <CoffeeIcon size={32} weight="duotone" />
                      </span>
                    )}

                    <motion.article
                      className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed md:text-[0.95rem] ${
                        isUser
                          ? "rounded-br-md bg-primary text-primary-foreground"
                          : "rounded-bl-md bg-background/70 text-foreground backdrop-blur-sm"
                      }`}
                    >
                      {message.content}
                    </motion.article>
                  </motion.div>
                );
              })}

              <AnimatePresence>
                {isLoading ? (
                  <motion.div
                    className="mr-auto rounded-2xl rounded-bl-md bg-background/70 px-4 py-3 text-sm text-muted-foreground backdrop-blur-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    Thinking...
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </div>

        <footer className="relative pt-4">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-linear-to-t from-background/80 to-transparent" />

          <div className="relative">
            <div className="mb-3 flex flex-wrap gap-2">
              {STARTER_PROMPTS.map((starter) => (
                <Button
                  key={starter}
                  type="button"
                  size="xs"
                  variant="outline"
                  className="rounded-full"
                  onClick={() => {
                    void submitPrompt(starter);
                  }}
                  disabled={isLoading}
                >
                  {starter}
                </Button>
              ))}
            </div>

            <form className="flex items-center gap-2" onSubmit={handleSubmit}>
              <label className="sr-only" htmlFor="chat-prompt-input">
                Ask about Antony
              </label>

              <Textarea
                id="chat-prompt-input"
                className="min-h-11 max-h-40 w-full resize-y rounded-2xl border border-border/60 bg-background/65 px-4 py-3 text-sm leading-relaxed text-foreground"
                placeholder="Ask about Antony's work, projects, or experience..."
                value={prompt}
                onChange={(event) => {
                  setPrompt(event.target.value);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void submitPrompt(prompt);
                  }
                }}
                disabled={isLoading}
              />

              <Button
                type="submit"
                size="icon-lg"
                variant="outline"
                aria-label="Send message"
                className="h-12 w-12 cursor-pointer"
                disabled={isLoading || !prompt.trim()}
              >
                {isLoading ? "..." : <ArrowUpIcon size={40} />}
              </Button>
            </form>
          </div>
        </footer>
      </section>
    </motion.main>
  );
}
