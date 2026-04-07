import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptPath = fileURLToPath(
  new URL("../internal/master/scripts/syncAtlasMasterAdmin.js", import.meta.url),
);

const child = spawn(process.execPath, [scriptPath], {
  stdio: "inherit",
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});


