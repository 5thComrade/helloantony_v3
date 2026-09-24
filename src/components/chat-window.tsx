import { ArrowUpIcon, CaretLeftIcon, CoffeeIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
  "How did Antony build this portfolio?",
  "Why should I hire Antony?",
  "What technologies does Antony prefer?",
];

function createMessage(role: MessageRole, content: string): ChatMessage {
  return {
    id: `${role}-${crypto.randomUUID()}`,
    role,
    content,
  };
}

function normalizeAssistantAnswer(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    return value
      .map((part) => {
        if (
          part &&
          typeof part === "object" &&
          "type" in part &&
          part.type === "text" &&
          "text" in part &&
          typeof part.text === "string"
        ) {
          return part.text;
        }

        return "";
      })
      .filter(Boolean)
      .join("\n");
  }

  if (value == null) {
    return "";
  }

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
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

  const isBusy = isLoading;

  const submitPrompt = useCallback(
    async (input: string) => {
      const trimmed = input.trim();

      if (!trimmed || isBusy) {
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
          answer?: unknown;
          error?: unknown;
        };

        const normalizedAnswer = normalizeAssistantAnswer(
          payload.answer,
        ).trim();

        if (!response.ok) {
          const errorMessage =
            typeof payload.error === "string"
              ? payload.error
              : "Unable to fetch an answer right now.";

          throw new Error(errorMessage);
        }

        setMessages((prev) => [
          ...prev,
          createMessage(
            "assistant",
            normalizedAnswer ||
              "I don't have enough information to answer that.",
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
    [isBusy],
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
                      {isUser ? (
                        message.content
                      ) : (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({ children }) => (
                              <p className="mb-3 last:mb-0">{children}</p>
                            ),
                            ul: ({ children }) => (
                              <ul className="mb-3 list-disc space-y-1 pl-5 last:mb-0">
                                {children}
                              </ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="mb-3 list-decimal space-y-1 pl-5 last:mb-0">
                                {children}
                              </ol>
                            ),
                            li: ({ children }) => <li>{children}</li>,
                            strong: ({ children }) => (
                              <strong className="font-semibold">
                                {children}
                              </strong>
                            ),
                            em: ({ children }) => (
                              <em className="italic">{children}</em>
                            ),
                            code: ({ children }) => (
                              <code className="rounded bg-foreground/10 px-1.5 py-0.5 text-[0.9em]">
                                {children}
                              </code>
                            ),
                            h1: ({ children }) => (
                              <h3 className="mb-2 text-base font-semibold last:mb-0">
                                {children}
                              </h3>
                            ),
                            h2: ({ children }) => (
                              <h4 className="mb-2 text-sm font-semibold last:mb-0">
                                {children}
                              </h4>
                            ),
                            h3: ({ children }) => (
                              <h5 className="mb-2 text-sm font-semibold last:mb-0">
                                {children}
                              </h5>
                            ),
                            table: ({ children }) => (
                              <div className="mb-3 overflow-x-auto rounded-lg border border-border/50 last:mb-0">
                                <table className="w-full min-w-md border-collapse text-left text-[0.9rem]">
                                  {children}
                                </table>
                              </div>
                            ),
                            thead: ({ children }) => (
                              <thead className="bg-foreground/5">
                                {children}
                              </thead>
                            ),
                            tbody: ({ children }) => (
                              <tbody className="divide-y divide-border/40">
                                {children}
                              </tbody>
                            ),
                            tr: ({ children }) => (
                              <tr className="align-top">{children}</tr>
                            ),
                            th: ({ children }) => (
                              <th className="px-3 py-2 font-semibold">
                                {children}
                              </th>
                            ),
                            td: ({ children }) => (
                              <td className="px-3 py-2">{children}</td>
                            ),
                            blockquote: ({ children }) => (
                              <blockquote className="mb-3 border-l-2 border-foreground/20 pl-3 italic last:mb-0">
                                {children}
                              </blockquote>
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      )}
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
                  className="rounded-full cursor-pointer"
                  onClick={() => {
                    void submitPrompt(starter);
                  }}
                  disabled={isBusy}
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
                className="min-h-11 max-h-40 w-full resize-y rounded-2xl border border-border/90 bg-background/95 px-4 py-3 text-sm leading-relaxed text-foreground shadow-sm ring-1 ring-foreground/10 transition-[border-color,box-shadow,background-color] placeholder:text-muted-foreground/90 focus-visible:border-primary/70 focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-primary/35"
                placeholder="How can I contact Antony?"
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
                disabled={isBusy}
              />

              <Button
                type="submit"
                size="icon-lg"
                variant="outline"
                aria-label="Send message"
                className="h-12 w-12 cursor-pointer"
                disabled={isBusy || !prompt.trim()}
              >
                {isBusy ? "..." : <ArrowUpIcon size={40} />}
              </Button>
            </form>
          </div>
        </footer>
      </section>
    </motion.main>
  );
}
