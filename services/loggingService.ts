
import { LogEntry, ProjectLog } from "../types";

/**
 * Aerie Master Logging Service
 * Consolidates all user-AI interactions.
 */

export class LoggingService {
  private masterLog: ProjectLog;

  constructor() {
    this.masterLog = {
      masterId: "AERIE-MASTER-LOG-001",
      lastUpdated: new Date().toISOString(),
      platform: "Aerie Education Portal",
      history: []
    };
  }

  /**
   * Logs a complete turn (User Prompt + AI Response)
   */
  public logInteraction(prompt: string, response: string, context: string = "chatbot") {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      prompt,
      response,
      context
    };
    
    this.masterLog.history.push(entry);
    this.masterLog.lastUpdated = entry.timestamp;
    
    // Log to console for real-time visibility in Vercel Dashboard
    console.log("--- AERIE INTERACTION ---");
    console.log(JSON.stringify(entry, null, 2));
  }

  /**
   * Generates the single AERIE_MASTER_LOG.json file for the current user.
   */
  public syncToMasterFile() {
    if (this.masterLog.history.length === 0) {
      return { success: false, message: "No conversation history to sync yet." };
    }

    try {
      const dataStr = JSON.stringify(this.masterLog, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `AERIE_MASTER_LOG.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return { success: true, fileName: "AERIE_MASTER_LOG.json" };
    } catch (e) {
      return { success: false, message: "Sync failed." };
    }
  }

  public getLogCount() {
    return this.masterLog.history.length;
  }
}

export const aerieLogger = new LoggingService();
