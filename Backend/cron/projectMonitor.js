import cron from "node-cron";
import { markExpiredProjectsService } from "../services/project.service.js";

// Runs every minute to check for timed-out projects
export const startProjectMonitor = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const result = await markExpiredProjectsService();
      if (result.reassignedCount > 0 || result.expiredCount > 0) {
        console.log(`[CRON] Processed timeouts: ${result.reassignedCount} reassigned, ${result.expiredCount} expired.`);
      }
    } catch (err) {
      console.error("[CRON] Error in project monitor:", err.message);
    }
  });
  console.log("📋 Project monitor cron job started (runs every minute)");
};
