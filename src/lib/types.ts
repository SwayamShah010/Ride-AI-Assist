export interface CallLogEntry {
  id: string;
  timestamp: string;
  callerId: string;
  action: "Allowed" | "Auto-Replied" | "Whitelisted" | "Emergency" | "Error";
  reason: string;
  wasAiUsed: boolean;
}
