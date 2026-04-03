import "dotenv/config";

import app from "./app.js";
import connectDatabase from "./connectDatabase.js";

const port = Number(process.env.PORT) || 5000;

async function startServer() {
  await connectDatabase();

  const server = app.listen(port, () => {
    console.log(`AYRA ERP unified backend running on http://localhost:${port}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(`Port ${port} is already in use.`);
      process.exit(1);
    }

    console.error("Unified backend server error:", error);
    process.exit(1);
  });
}

startServer().catch((error) => {
  console.error("Failed to start AYRA ERP unified backend", error);
  process.exit(1);
});
