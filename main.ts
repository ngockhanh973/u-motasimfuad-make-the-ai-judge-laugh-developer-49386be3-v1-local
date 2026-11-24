// v2 entry runner for "Make the AI Judge Laugh: Developer Excuses".
//
// The joke is the single line in entry.txt next to this file. All this
// script does is hand that line, byte for byte, to the grader: it reads
// entry.txt, refuses anything blank or longer than the 200-character
// cap, and writes the exact same bytes to entry.txt inside the output
// folder. No trimming, no added newline, no cleverness — if the bytes
// change between here and the grader, the laugh is not the one we wrote.
//
// Output folder: $MAKEFUN_OUTPUT_DIR when set, otherwise ./out/ so a
// plain `node main.ts` still works for a local check. Run it twice and
// the two outputs must hash identically — that is the whole contract.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const LIMIT = 200;
const HERE = dirname(fileURLToPath(import.meta.url));

function die(message: string): never {
  throw new Error(`entry rejected: ${message}`);
}

const raw = readFileSync(join(HERE, "entry.txt"), "utf8");
const size = [...raw].length;
if (size === 0 || size > LIMIT) die(`must be 1–${LIMIT} characters, got ${size}`);
if (raw.trim() === "") die("must not be blank or whitespace-only");

const outDir = process.env.MAKEFUN_OUTPUT_DIR
  ? resolve(process.env.MAKEFUN_OUTPUT_DIR)
  : join(HERE, "out");
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), raw, "utf8");
