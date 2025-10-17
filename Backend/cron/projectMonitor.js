import cron from "node-cron";
import { markExpiredProjectsService } from "../services/project.service.js";

// Runs every minute
export const startProjectMonitor = () => {
  cron.schedule("* * * * *", async () => {
    const count = await markExpiredProjectsService();
    if (count > 0) {
      console.log(`[CRON] Reassigned ${count} project(s) due to inactivity.`);
    }
  });
};
