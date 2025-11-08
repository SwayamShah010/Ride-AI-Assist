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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardTab } from "@/components/dashboard-tab";
import { SettingsTab } from "@/components/settings-tab";
import { WhitelistTab } from "@/components/whitelist-tab";
import { CallLogTab } from "@/components/call-log-tab";
import type { CallLogEntry } from "@/lib/types";

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [isRiding, setIsRiding] = useState(false);
  const [autoReplyMessage, setAutoReplyMessage] = useState(
    "I'm currently riding a bike and will respond later."
  );
  const [whitelist, setWhitelist] = useState<string[]>([]);
  const [callLog, setCallLog] = useState<CallLogEntry[]>([]);

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

  return (
    <div className="container mx-auto min-h-screen max-w-5xl p-4 md:p-8">
      <header className="mb-8 flex items-center gap-3">
        <div className="rounded-full bg-primary p-3 text-primary-foreground">
          <Bike className="h-8 w-8" />
        </div>
        <h1 className="font-headline text-4xl font-bold tracking-tight">
          RideReply
        </h1>
      </header>

      <main>
        <Tabs defaultValue="dashboard">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="dashboard">
              <Gauge className="mr-2 h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="whitelist">
              <Users className="mr-2 h-4 w-4" />
              Whitelist
            </TabsTrigger>
            <TabsTrigger value="call-log">
              <History className="mr-2 h-4 w-4" />
              Call Log
            </TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard">
            <DashboardTab
              isRiding={isRiding}
              setIsRiding={setIsRiding}
              autoReplyMessage={autoReplyMessage}
              whitelist={whitelist}
              addCallLogEntry={addCallLogEntry}
            />
          </TabsContent>
          <TabsContent value="settings">
            <SettingsTab
              autoReplyMessage={autoReplyMessage}
              setAutoReplyMessage={handleSetAutoReplyMessage}
            />
          </TabsContent>
          <TabsContent value="whitelist">
            <WhitelistTab
              whitelist={whitelist}
              setWhitelist={handleSetWhitelist}
            />
          </TabsContent>
          <TabsContent value="call-log">
            <CallLogTab callLog={callLog} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
