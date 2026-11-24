// Developer Excuses — v1 entry runner.
//
// Job: take the single line shipped in entry.txt (sitting beside this
// file) and copy it verbatim into the folder the grader points at with
// MAKEFUN_OUTPUT_DIR. When that variable is absent we drop it into a
// local out/ folder instead, so `node main.ts` works by hand too.
//
// Deliberately boring on purpose: the joke lives in entry.txt, this
// script only has to be deterministic — same bytes in, same bytes out,
// every run, with no trimming and no newline added or removed. It
// refuses to ship anything the gate would reject (empty,
// whitespace-only, or over 200 characters) rather than silently
// handing the scorer a bad file.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_CHARS = 200;

function repoRoot(): string {
  return dirname(fileURLToPath(import.meta.url));
}

function outputFolder(root: string): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  return fromEnv ? resolve(fromEnv) : join(root, "out");
}

function loadEntry(root: string): string {
  const source = join(root, "entry.txt");
  let text: string;
  try {
    text = readFileSync(source, "utf8");
  } catch {
    throw new Error(`cannot read shipped entry: ${source}`);
  }
  const chars = Array.from(text).length;
  if (chars < 1 || chars > MAX_CHARS || text.trim().length === 0) {
    throw new Error(
      `entry must be 1-${MAX_CHARS} non-blank characters, got ${chars}`,
    );
  }
  return text;
}

const root = repoRoot();
const line = loadEntry(root);
const dest = outputFolder(root);
mkdirSync(dest, { recursive: true });
writeFileSync(join(dest, "entry.txt"), line, "utf8");
