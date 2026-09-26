import {
  createRootRoute,
  HeadContent,
  Link,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        name: "theme-color",
        content: "#c8d8c0",
      },
      {
        title: "Antony Chiramel",
      },
    ],
    links: [
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "/favicon.svg",
      },
      {
        rel: "shortcut icon",
        href: "/favicon.svg",
      },
      {
        rel: "apple-touch-icon",
        href: "/favicon.svg",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundPage,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>

      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function NotFoundPage() {
  return (
    <div className="relative h-svh max-h-svh w-screen max-w-[100vw] overflow-hidden bg-background">
      <motion.div
        className="pointer-events-none absolute -left-16 -top-12 h-64 w-64 rounded-full bg-primary/12 blur-3xl"
        animate={{ x: [0, 12, 0], y: [0, 16, 0], opacity: [0.35, 0.5, 0.35] }}
        transition={{
          duration: 9,
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
        }}
        aria-hidden
      />

      <motion.div
        className="pointer-events-none absolute -bottom-16 -right-16 h-72 w-72 rounded-full bg-accent/12 blur-3xl"
        animate={{
          x: [0, -14, 0],
          y: [0, -12, 0],
          opacity: [0.25, 0.45, 0.25],
        }}
        transition={{
          duration: 10.5,
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
        }}
        aria-hidden
      />

      <main className="relative z-10 flex h-full max-h-full w-full max-w-[100vw] flex-col px-6 py-6 md:px-10 md:py-8">
        <motion.section
          className="mx-auto flex h-full max-h-full w-full max-w-2xl flex-col items-center justify-center text-center"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.p
            className="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            404 • Page Not Found
          </motion.p>

          <motion.h1
            className="mt-4 text-[clamp(4rem,20vw,8rem)] leading-[0.86] font-semibold tracking-[-0.04em] text-foreground"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.6,
              delay: 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            Lost,
            <span className="block text-muted-foreground">Not Gone</span>
          </motion.h1>

          <motion.p
            className="mt-5 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground md:text-lg"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.55,
              delay: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            The page you tried to visit does not exist. Let&apos;s get you back
            to a meaningful place.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.55,
              delay: 0.28,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Link
              to="/"
              className="inline-flex h-9 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium tracking-[0.04em] text-primary-foreground transition-colors hover:bg-primary/85"
            >
              Back Home
            </Link>

            <Link
              to="/chat"
              className="inline-flex h-9 items-center justify-center rounded-full border border-border bg-background px-5 text-sm font-medium tracking-[0.04em] text-foreground transition-colors hover:bg-muted"
            >
              Ask Me Anything
            </Link>
          </motion.div>
        </motion.section>
      </main>
    </div>
  );
}
