import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// One honest error line: what broke, why it is funny, and what to do next.
// The failure is stated plainly (the server ran out of memory and dropped
// the request), the second sentence is the twist a reader repeats, and the
// ending tells the reader their work survived and trying again is the fix.
const entry =
  "The server ran out of memory and dropped your request to save itself. Your work is safe; its memory is not. Try again.";

// The gate only accepts a single line of 1 to 200 characters, so refuse
// to ship anything that is blank, wrapped, or over the limit instead of
// writing a file the judge will never see.
function assertSingleShortLine(text: string): void {
  if (text.length === 0 || text.length > 200) {
    throw new Error(`Entry must be 1 to 200 characters, got ${text.length}.`);
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("Entry must be a single line.");
  }
  if (text.trim().length === 0) {
    throw new Error("Entry must not be only whitespace.");
  }
}

assertSingleShortLine(entry);

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", entry, "utf8");

// Read the file back and refuse to claim success unless it holds exactly
// this one line: the grader runs the program twice and both runs must
// produce the same bytes, so a silent write difference must fail loudly.
const written = readFileSync("/output/entry.txt", "utf8");
if (written !== entry) {
  throw new Error("Wrote /output/entry.txt, but its contents differ from the entry.");
}

console.log(entry);
console.log(`Wrote ${entry.length} characters to /output/entry.txt`);
