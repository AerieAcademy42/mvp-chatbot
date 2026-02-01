
import { LogEntry, ProjectLog } from "../types";

/**
 * Aerie Project Logging Service
 * Handles the collection and exportation of user prompts.
 * Note: Browser security prevents direct filesystem writes. 
 * Use 'exportToProjectFolder()' to generate a file for your /logs directory.
 */

class LoggingService {
  private currentSession: ProjectLog;

  constructor() {
    this.currentSession = {
      sessionId: `AERIE-SES-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      sessionStart: new Date().toISOString(),
      platform: "Aerie Web Platform",
      entries: []
    };
  }

  /**
   * Captures a user prompt in the current active session
   */
  public logUserPrompt(prompt: string, context: string = "general_chat") {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      prompt,
      context
    };
    
    this.currentSession.entries.push(entry);
    
    // Developer Console Mirror
    console.debug(`[PROMPT LOGGED] ${entry.timestamp}: ${prompt}`);
    
    // Optional: If you implement a backend, call it here:
    // fetch('/api/logs', { method: 'POST', body: JSON.stringify(entry) });
  }

  /**
   * Prepares and triggers a download of the session logs.
   * Save this file into your project's /logs/ folder.
   */
  public exportToProjectFolder() {
    if (this.currentSession.entries.length === 0) {
      return { success: false, message: "No logs captured in this session yet." };
    }

    const dataStr = JSON.stringify(this.currentSession, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const dateTag = new Date().toISOString().split('T')[0];
    const fileName = `AERIE_SESSION_${dateTag}_${this.currentSession.sessionId}.json`;
    
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return { success: true, fileName };
  }

  public getSessionStats() {
    return {
      count: this.currentSession.entries.length,
      start: this.currentSession.sessionStart
    };
  }
}

export const aerieLogger = new LoggingService();
