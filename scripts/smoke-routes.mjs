#!/usr/bin/env node
/** Read-only local HTTP smoke test. Never sends mutations or credentials. */
const base = process.argv[2] ?? "http://localhost:3000";
let origin;
try {
  const url = new URL(base);
  if (!(["localhost", "127.0.0.1", "[::1]", "::1"].includes(url.hostname))) {
    throw new Error("Only local development addresses are allowed");
  }
  if (url.protocol !== "http:") throw new Error("Use an http:// local URL");
  origin = url.origin;
} catch (error) {
  console.error(`Invalid local URL: ${error.message}`);
  process.exit(2);
}
const cases = [
  { path: "/", status: 200, contains: "Three worlds" },
  { path: "/engineering", status: 200 },
  { path: "/graphics", status: 200 },
  { path: "/visibility", status: 200 },
  { path: "/studio", status: 404 },
  { path: "/api/health", status: 200, json: { status: "ok", component: "public-foundation" } },
];
let failures = 0;
for (const c of cases) {
  try {
    const response = await fetch(origin + c.path, { redirect: "manual", signal: AbortSignal.timeout(10000) });
    let valid = response.status === c.status;
    if (valid && c.contains) valid = (await response.text()).toLowerCase().includes(c.contains.toLowerCase());
    if (valid && c.json) {
      const value = await response.json();
      valid = Object.entries(c.json).every(([key, expected]) => value[key] === expected);
    }
    console.log(`${valid ? "PASS" : "FAIL"} ${c.path} (HTTP ${response.status}, expected ${c.status})`);
    if (!valid) failures++;
  } catch (error) {
    console.log(`FAIL ${c.path}: ${error.message}`);
    failures++;
  }
}
console.log(`\n${cases.length - failures}/${cases.length} route smoke tests passed on ${origin}`);
process.exitCode = failures ? 1 : 0;
