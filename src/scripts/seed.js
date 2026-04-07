import { connectDB, disconnectDB } from "../internal/super/database/connection.js";
import { seedDatabase } from "../internal/super/database/seed.js";

async function run() {
  try {
    await connectDB();
    await seedDatabase();
  } finally {
    await disconnectDB();
  }
}

run().catch((error) => {
  console.error("Seed script failed:", error);
  process.exit(1);
});


