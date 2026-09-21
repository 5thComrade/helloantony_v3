import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const knowledgePath = resolve(process.cwd(), "src/content/about-me.md");

export async function getKnowledge() {
  return readFile(knowledgePath, "utf-8");
}
