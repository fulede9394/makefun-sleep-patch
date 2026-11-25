// Fix Human Sleep: Funniest Patch Note
// Changelog voice, applied to the human operating system.
// The 3 a.m. dread is not fixed — it is merely deprecated.
import { createWriteStream, mkdirSync } from "node:fs";
import { join } from "node:path";

const note =
  "v2.4.1: Fixed human sleep. Users now fall asleep in under 8 minutes; dreams load 40% faster; the 3 a.m. existential dread has been deprecated.";
const LIMIT = 160;

function guardPatch(text: string): Error | null {
  if (text.length === 0 || text.length > LIMIT) {
    return new Error(`patch note must be 1-${LIMIT} chars, got ${text.length}`);
  }
  if (!text.startsWith("v")) return new Error("patch note must start with a version tag");
  if (!text.includes("sleep")) return new Error("patch note must mention sleep");
  if (text.split("\n").length !== 1) return new Error("patch note must be one line");
  return null;
}

function shipPatch(): Promise<void> {
  const problem = guardPatch(note);
  if (problem) return Promise.reject(problem);
  const dir = process.env.MAKEFUN_OUTPUT_DIR ?? "output";
  mkdirSync(dir, { recursive: true });
  return new Promise((resolvePromise, rejectPromise) => {
    const stream = createWriteStream(join(dir, "entry.txt"), "utf8");
    stream.on("error", rejectPromise);
    stream.on("finish", () => resolvePromise());
    stream.write(note);
    stream.end();
  });
}

await shipPatch();
