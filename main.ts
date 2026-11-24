// make.fun — "Make the AI Judge Laugh: Developer Excuses"
// (u-motasimfuad-make-the-ai-judge-laugh-developer-49386be3)
//
// Entry program: writes one funny single-line excuse a developer gives
// when code breaks in production to /output/entry.txt.
//
// The excuse turns the most worn developer excuse of all time —
// "it works on my machine" — by revealing what really happened:
// the deploy shipped the developer's own machine as production.
//
// Deterministic: the same text on every run. No input, no network,
// no randomness, no environment reads.

import { chmodSync, mkdirSync, writeFileSync } from "node:fs";

const EXCUSE =
  "It works on my machine — and after this deploy, my machine is production.";

const OUTPUT_PATH = "/output/entry.txt";
const MAX_CHARS = 200;

function codePointCount(text: string): number {
  return [...text].length;
}

function main(): void {
  // Gate guard: the sealed scorer only judges UTF-8 text of 1-200
  // characters that is not only whitespace, on a single line.
  if (codePointCount(EXCUSE) < 1 || codePointCount(EXCUSE) > MAX_CHARS) {
    throw new Error(
      `excuse must be 1-${MAX_CHARS} characters, got ${codePointCount(EXCUSE)}`,
    );
  }
  if (EXCUSE.trim().length === 0) {
    throw new Error("excuse must not be only whitespace");
  }
  if (EXCUSE.includes("\n") || EXCUSE.includes("\r")) {
    throw new Error("excuse must be a single line");
  }
  mkdirSync("/output", { recursive: true });
  writeFileSync(OUTPUT_PATH, EXCUSE + "\n", {
    encoding: "utf8",
    mode: 0o644,
  });
  // The grader collects /output as another user, so the file must be
  // world-readable whatever the sandbox umask is: writeFileSync's mode
  // only applies on creation and is masked by the umask, so chmod
  // explicitly after writing.
  chmodSync(OUTPUT_PATH, 0o644);
}

main();
