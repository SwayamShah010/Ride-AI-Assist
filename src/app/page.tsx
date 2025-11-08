"use client";

import { useState, useEffect } from "react";
import {
  Bike,
  Gauge,
  Settings,
  Users,
  History,
  PhoneCall,
  Loader2,
} from "lucide-react";
import { DashboardTab } from "@/components/dashboard-tab";
import { SettingsTab } from "@/components/settings-tab";
import { WhitelistTab } from "@/components/whitelist-tab";
import { CallLogTab } from "@/components/call-log-tab";
import type { CallLogEntry } from "@/lib/types";
import { cn } from "@/lib/utils";

type ActiveTab = "dashboard" | "settings" | "whitelist" | "call-log";

const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard", label: "Dashboard", icon: <Gauge className="h-5 w-5" /> },
  { id: "settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
  {
    id: "whitelist",
    label: "Whitelist",
    icon: <Users className="h-5 w-5" />,
  },
  { id: "call-log", label: "Call Log", icon: <History className="h-5 w-5" /> },
];

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [isRiding, setIsRiding] = useState(false);
  const [autoReplyMessage, setAutoReplyMessage] = useState(
    "I'm currently riding a bike and will respond later."
  );
  const [whitelist, setWhitelist] = useState<string[]>([]);
  const [callLog, setCallLog] = useState<CallLogEntry[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");

  useEffect(() => {
    setIsClient(true);
    const storedMessage = localStorage.getItem("rideReply_message");
    if (storedMessage) {
      setAutoReplyMessage(storedMessage);
    }
    const storedWhitelist = localStorage.getItem("rideReply_whitelist");
    if (storedWhitelist) {
      setWhitelist(JSON.parse(storedWhitelist));
    }
    const storedCallLog = localStorage.getItem("rideReply_callLog");
    if (storedCallLog) {
      setCallLog(JSON.parse(storedCallLog));
    }
  }, []);

  const handleSetAutoReplyMessage = (message: string) => {
    setAutoReplyMessage(message);
    localStorage.setItem("rideReply_message", message);
  };

  const handleSetWhitelist = (newWhitelist: string[]) => {
    setWhitelist(newWhitelist);
    localStorage.setItem("rideReply_whitelist", JSON.stringify(newWhitelist));
  };

  const addCallLogEntry = (entry: Omit<CallLogEntry, "id" | "timestamp">) => {
    setCallLog((prevLog) => {
      const newLog = [
        {
          ...entry,
          id: new Date().toISOString(),
          timestamp: new Date().toLocaleString(),
        },
        ...prevLog,
      ];
      localStorage.setItem("rideReply_callLog", JSON.stringify(newLog));
      return newLog;
    });
  };

  if (!isClient) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardTab
            isRiding={isRiding}
            setIsRiding={setIsRiding}
            autoReplyMessage={autoReplyMessage}
            whitelist={whitelist}
            addCallLogEntry={addCallLogEntry}
          />
        );
      case "settings":
        return (
          <SettingsTab
            autoReplyMessage={autoReplyMessage}
            setAutoReplyMessage={handleSetAutoReplyMessage}
          />
        );
      case "whitelist":
        return (
          <WhitelistTab
            whitelist={whitelist}
            setWhitelist={handleSetWhitelist}
          />
        );
      case "call-log":
        return <CallLogTab callLog={callLog} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full flex-col">
      <header className="p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary p-2 text-primary-foreground">
            <Bike className="h-6 w-6" />
          </div>
          <h1 className="font-headline text-2xl font-bold tracking-tight">
            Ride AI Assist
          </h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 pt-0">{renderContent()}</main>

      <footer className="sticky bottom-0 border-t bg-background">
        <nav className="grid grid-cols-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 p-3 text-xs font-medium transition-colors",
                activeTab === item.id
                  ? "text-primary"
                  : "text-muted-foreground hover:bg-accent"
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </footer>
    </div>
  );
}
