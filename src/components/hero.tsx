import {
  AtIcon,
  GithubLogoIcon,
  LinkedinLogoIcon,
} from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type HeroProps = {
  onAsk: () => void;
};

const EXPERIENCE = [
  {
    title: "Software Engineer II",
    company: "Neeve.ai",
    period: "2024 — Present",
  },
  {
    title: "Senior Associate Consultant",
    company: "Infosys",
    period: "2023 — 2024",
  },
  {
    title: "Associate Consultant",
    company: "Infosys",
    period: "2021 — 2023",
  },
  {
    title: "Associate DevOps Engineer",
    company: "Teamlease Services Limited",
    period: "2019 — 2021",
  },
];

const CORE_SKILLS = [
  {
    category: "Languages",
    items: ["TypeScript", "JavaScript"],
  },
  {
    category: "Backend",
    items: ["Node.js", "PostgreSQL", "Next.js"],
  },
  {
    category: "Cloud",
    items: ["AWS", "Docker"],
  },
];

export function Hero({ onAsk }: Readonly<HeroProps>) {
  const [activeTab, setActiveTab] = useState<"experience" | "skills">(
    "experience",
  );

  return (
    <motion.main
      className="relative z-10 mx-auto flex min-h-svh w-full max-w-6xl flex-col px-6 pb-16 pt-30 md:px-10 md:pt-34"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.section
        className="max-w-5xl"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.75, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Software Engineer
        </p>

        <h1 className="mt-5 text-[clamp(1.9rem,6.5vw,4rem)] font-semibold leading-[0.98] tracking-tight text-foreground">
          <span className="block text-muted-foreground">Hello, I am</span>
          <span className="block mt-1">Antony</span>
        </h1>

        <p className="mt-4 max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
          Full Stack Software Engineer focused on clean architecture,
          high-quality user experiences, and scalable product development.
        </p>

        <motion.div
          className="mt-7 flex flex-wrap items-center gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.6, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.a
            href="mailto:antonychiramel07@gmail.com"
            className="inline-flex items-center justify-center rounded-full border border-border p-2.5 text-foreground transition-colors hover:bg-muted"
            aria-label="Email Antony"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
          >
            <AtIcon size={18} />
          </motion.a>

          <motion.a
            href="https://github.com/5thComrade"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-border p-2.5 text-foreground transition-colors hover:bg-muted"
            aria-label="GitHub profile"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
          >
            <GithubLogoIcon size={18} />
          </motion.a>

          <motion.a
            href="https://www.linkedin.com/in/antony-chiramel-a40a3a169"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-border p-2.5 text-foreground transition-colors hover:bg-muted"
            aria-label="LinkedIn profile"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
          >
            <LinkedinLogoIcon size={18} />
          </motion.a>

          <Button
            size="lg"
            className="rounded-full px-5 text-sm tracking-[0.04em] cursor-pointer"
            onClick={onAsk}
          >
            Ask me anything
          </Button>
        </motion.div>

        <motion.div
          className="mt-10 h-px w-full bg-border"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: "left" }}
        />

        <div className="mt-10 grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(16rem,22rem)] md:gap-14">
          <motion.article
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.55,
              delay: 0.24,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <h2 className="text-lg font-semibold text-foreground">About me</h2>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-[0.96rem]">
              I am currently a Software Engineer II at Neeve.ai, where I helped
              lead the development of Neeve Portal, a unified platform providing
              zero-trust remote access to operational technology (OT) devices
              and endpoints.
            </p>

            <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-[0.96rem]">
              My work spans frontend engineering, full-stack feature delivery,
              API integration, technical design, and design-system development,
              with a strong focus on maintainable software and practical user
              experience.
            </p>
          </motion.article>

          <motion.aside
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.55,
              delay: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Tabs
              value={activeTab}
              onValueChange={(value) => {
                if (value === "experience" || value === "skills") {
                  setActiveTab(value);
                }
              }}
              className="w-full flex-col gap-3"
            >
              <TabsList
                variant="line"
                className="h-auto w-full self-start gap-2 rounded-none bg-transparent p-0 md:max-w-[18rem]"
              >
                <TabsTrigger
                  value="experience"
                  className="relative h-10 cursor-pointer rounded-none border border-transparent bg-transparent px-4 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-foreground/55 shadow-none transition-all hover:-translate-y-px hover:text-foreground data-active:border-transparent! data-active:bg-transparent! data-active:text-foreground data-active:shadow-none!"
                >
                  Experience
                  {activeTab === "experience" ? (
                    <motion.span
                      layoutId="hero-tabs-underline"
                      className="absolute -bottom-1 left-4 right-4 h-0.5 rounded-full bg-foreground"
                      transition={{
                        type: "spring",
                        stiffness: 520,
                        damping: 42,
                      }}
                    />
                  ) : null}
                </TabsTrigger>

                <TabsTrigger
                  value="skills"
                  className="relative h-10 cursor-pointer rounded-none border border-transparent bg-transparent px-4 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-foreground/55 shadow-none transition-all hover:-translate-y-px hover:text-foreground data-active:border-transparent! data-active:bg-transparent! data-active:text-foreground data-active:shadow-none!"
                >
                  Skills
                  {activeTab === "skills" ? (
                    <motion.span
                      layoutId="hero-tabs-underline"
                      className="absolute -bottom-1 left-4 right-4 h-0.5 rounded-full bg-foreground"
                      transition={{
                        type: "spring",
                        stiffness: 520,
                        damping: 42,
                      }}
                    />
                  ) : null}
                </TabsTrigger>
              </TabsList>

              <div className="relative min-h-72 pt-2">
                <AnimatePresence mode="wait" initial={false}>
                  {activeTab === "experience" ? (
                    <motion.div
                      key="experience"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <ul className="space-y-5">
                        {EXPERIENCE.map((item, index) => (
                          <motion.li
                            key={`${item.company}-${item.title}`}
                            initial={{ opacity: 0, x: 8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              duration: 0.3,
                              delay: index * 0.05,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            className="border-l border-border/70 pl-3"
                          >
                            <p className="text-sm font-medium leading-snug text-foreground">
                              {item.title}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {item.company}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {item.period}
                            </p>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="skills"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p className="text-sm font-semibold text-foreground">
                        Core Skills
                      </p>

                      <div className="mt-3 grid gap-3">
                        {CORE_SKILLS.map((group, groupIndex) => (
                          <motion.div
                            key={group.category}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.28,
                              delay: groupIndex * 0.06,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                          >
                            <p className="mb-2 text-xs font-medium text-muted-foreground">
                              {group.category}
                            </p>

                            <div className="flex flex-wrap gap-2">
                              {group.items.map((skill, skillIndex) => (
                                <motion.span
                                  key={skill}
                                  initial={{ opacity: 0, scale: 0.96 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{
                                    duration: 0.2,
                                    delay:
                                      groupIndex * 0.06 + skillIndex * 0.04,
                                    ease: [0.22, 1, 0.36, 1],
                                  }}
                                  className="rounded-full border border-border/80 bg-muted/25 px-2.5 py-1 text-xs text-foreground/90"
                                >
                                  {skill}
                                </motion.span>
                              ))}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Tabs>
          </motion.aside>
        </div>
      </motion.section>
    </motion.main>
  );
}
