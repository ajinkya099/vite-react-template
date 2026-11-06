// node scripts/still.mjs out.png '{"eyeOpen":1}' [page]
import { chromium } from "playwright";
import path from "path";
const [out, pose = "{}", page = "still.html"] = process.argv.slice(2);
const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1920, height: 1080 } });
const errs = []; pg.on("pageerror", e => errs.push(e.message)); pg.on("console", m => m.type() === "error" && errs.push(m.text()));
await pg.goto("file://" + path.resolve("film/" + page) + "?pose=" + encodeURIComponent(pose));
await pg.waitForFunction(() => window.__done === true, null, { timeout: 30000 }).catch(() => {});
await pg.screenshot({ path: out }); await b.close();
if (errs.length) console.log("ERRORS:", errs.join("\n")); else console.log("ok", out);
