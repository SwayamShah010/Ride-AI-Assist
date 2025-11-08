"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PhoneCall, Loader2, Bot } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import type { CallLogEntry } from "@/lib/types";
import { screenCall } from "@/app/actions";

interface DashboardTabProps {
  isRiding: boolean;
  setIsRiding: (isRiding: boolean) => void;
  autoReplyMessage: string;
  whitelist: string[];
  addCallLogEntry: (entry: Omit<CallLogEntry, "id" | "timestamp">) => void;
}

const rideReplyHero = PlaceHolderImages.find(
  (img) => img.id === "ride-reply-hero"
);

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  if (hour < 22) return "evening";
  return "night";
}

function generateRandomPhoneNumber() {
  return `(${Math.floor(Math.random() * 900) + 100}) ${
    Math.floor(Math.random() * 900) + 100
  }-${Math.floor(Math.random() * 9000) + 1000}`;
}

const priorities = ["low", "normal", "high", "emergency"] as const;
function getRandomPriority() {
  return priorities[Math.floor(Math.random() * priorities.length)];
}

export function DashboardTab({
  isRiding,
  setIsRiding,
  autoReplyMessage,
  whitelist,
  addCallLogEntry,
}: DashboardTabProps) {
  const [isScreening, setIsScreening] = useState(false);
  const [lastCall, setLastCall] = useState<CallLogEntry | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRiding) {
      intervalRef.current = setInterval(simulateCall, 8000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setLastCall(null);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRiding, whitelist, autoReplyMessage]);

  const simulateCall = async () => {
    setIsScreening(true);
    setLastCall(null);

    const callerId = generateRandomPhoneNumber();
    const timeOfDay = getTimeOfDay();
    const contactPriority = getRandomPriority();

    if (whitelist.includes(callerId)) {
      const logEntry: Omit<CallLogEntry, "id" | "timestamp"> = {
        callerId,
        action: "Whitelisted",
        reason: "Caller is on the whitelist.",
        wasAiUsed: false,
      };
      setLastCall({ ...logEntry, id: "", timestamp: "" });
      addCallLogEntry(logEntry);
      setIsScreening(false);
      return;
    }

    const userRules = "Block unknown numbers between 10pm and 8am. Emergency contacts should always be allowed.";

    const result = await screenCall({
      callerId,
      timeOfDay,
      contactPriority,
      userRules,
      cannedResponse: autoReplyMessage,
    });
    
    const logEntry: Omit<CallLogEntry, "id" | "timestamp"> = {
      callerId,
      action: result.shouldSendCannedResponse ? "Auto-Replied" : "Allowed",
      reason: result.reason,
      wasAiUsed: true,
    };
    setLastCall({ ...logEntry, id: "", timestamp: "" });
    addCallLogEntry(logEntry);
    setIsScreening(false);
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="p-0">
        <CardTitle>Ride Detection</CardTitle>
        <CardDescription>
          Activate ride mode to automatically handle incoming calls.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-0 pt-4">
        {rideReplyHero && (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={rideReplyHero.imageUrl}
              alt={rideReplyHero.description}
              fill
              className="object-cover"
              data-ai-hint={rideReplyHero.imageHint}
              priority
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>
        )}

        <div className="flex items-center justify-between space-x-4 rounded-lg border bg-card p-4 shadow-sm">
          <Label htmlFor="ride-mode" className="text-base font-medium">
            Activate Ride Mode
          </Label>
          <div className="flex items-center gap-3">
          {isRiding && (
             <div className="relative flex h-3 w-3">
              <div className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></div>
              <div className="relative inline-flex h-3 w-3 rounded-full bg-primary"></div>
            </div>
          )}
          <Switch
            id="ride-mode"
            checked={isRiding}
            onCheckedChange={setIsRiding}
            className="data-[state=checked]:bg-primary"
            aria-label="Toggle Ride Mode"
          />
          </div>
        </div>

        {isRiding && (
          <Alert>
            <PhoneCall className="h-4 w-4" />
            <AlertTitle>Ride Mode is Active</AlertTitle>
            <AlertDescription>
              Simulating incoming calls and screening them with AI.
            </AlertDescription>
          </Alert>
        )}

        {(isScreening || lastCall) && (
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 font-semibold">Incoming Call Simulator</h3>
            {isScreening && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Screening incoming call...</span>
              </div>
            )}
            {lastCall && (
              <div className="space-y-2">
                <p>
                  <strong>Caller:</strong> {lastCall.callerId}
                </p>
                <p>
                  <strong>Action:</strong>{" "}
                  <span
                    className={
                      lastCall.action === "Allowed" || lastCall.action === "Whitelisted"
                        ? "text-green-600"
                        : "text-orange-600"
                    }
                  >
                    {lastCall.action}
                  </span>
                </p>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  {lastCall.wasAiUsed && <Bot className="h-4 w-4 flex-shrink-0 mt-0.5" />}
                  <span>{lastCall.reason}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
