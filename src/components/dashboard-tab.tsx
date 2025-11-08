
"use client";

import { useState, useEffect } from "react";
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
import { PhoneCall, Loader2, Bot, PhoneIncoming, ShieldAlert } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import type { CallLogEntry } from "@/lib/types";
import { screenCall } from "@/app/actions";
import { Button } from "./ui/button";

interface DashboardTabProps {
  isRiding: boolean;
  setIsRiding: (isRiding: boolean) => void;
  autoReplyMessage: string;
  whitelist: string[];
  emergencyContacts: string[];
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

const priorities = ["low", "normal", "high"] as const;
function getRandomPriority() {
  return priorities[Math.floor(Math.random() * priorities.length)];
}

export function DashboardTab({
  isRiding,
  setIsRiding,
  autoReplyMessage,
  whitelist,
  emergencyContacts,
  addCallLogEntry,
}: DashboardTabProps) {
  const [isScreening, setIsScreening] = useState(false);
  const [currentCaller, setCurrentCaller] = useState<string | null>(null);
  const [lastCall, setLastCall] = useState<CallLogEntry | null>(null);
  const [isEmergencyCall, setIsEmergencyCall] = useState(false);

  useEffect(() => {
    if (!isRiding) {
      setIsScreening(false);
      setCurrentCaller(null);
      setLastCall(null);
      setIsEmergencyCall(false);
    }
  }, [isRiding]);

  const simulateCall = async () => {
    setIsScreening(true);
    setLastCall(null);
    setIsEmergencyCall(false);

    // 20% chance of emergency call if list is not empty
    const isEmergency = emergencyContacts.length > 0 && Math.random() < 0.2;
    const callerId = isEmergency
      ? emergencyContacts[Math.floor(Math.random() * emergencyContacts.length)]
      : generateRandomPhoneNumber();
    
    setCurrentCaller(callerId);
    if (isEmergency) {
      setIsEmergencyCall(true);
    }

    // Short delay to show incoming call
    await new Promise(resolve => setTimeout(resolve, 2500));

    if (isEmergency) {
       const logEntry: Omit<CallLogEntry, "id" | "timestamp"> = {
        callerId,
        action: "Emergency",
        reason: "Caller is on the emergency list.",
        wasAiUsed: false,
      };
      addCallLogEntry(logEntry);
      setLastCall({ ...logEntry, id: "", timestamp: "" });
      setIsScreening(false);
      setCurrentCaller(null);
      return;
    }

    if (whitelist.includes(callerId)) {
      const logEntry: Omit<CallLogEntry, "id" | "timestamp"> = {
        callerId,
        action: "Whitelisted",
        reason: "Caller is on the whitelist.",
        wasAiUsed: false,
      };
      addCallLogEntry(logEntry);
      setLastCall({ ...logEntry, id: "", timestamp: "" });
      setIsScreening(false);
      setCurrentCaller(null);
      return;
    }

    const userRules = "Block unknown numbers between 10pm and 8am. Emergency contacts should always be allowed.";

    const result = await screenCall({
      callerId,
      timeOfDay: getTimeOfDay(),
      contactPriority: getRandomPriority(),
      userRules,
      cannedResponse: autoReplyMessage,
    });
    
    const logEntry: Omit<CallLogEntry, "id" | "timestamp"> = {
      callerId,
      action: result.shouldSendCannedResponse ? "Auto-Replied" : "Allowed",
      reason: result.reason,
      wasAiUsed: true,
    };
    addCallLogEntry(logEntry);
    setLastCall({ ...logEntry, id: "", timestamp: "" });
    setIsScreening(false);
    setCurrentCaller(null);
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

        {isRiding && !isScreening && !currentCaller && (
          <div className="rounded-lg border p-4 text-center">
             <AlertDescription className="mb-4">
              Ride Mode is active. Press the button to simulate an incoming call.
            </AlertDescription>
            <Button onClick={simulateCall} disabled={isScreening}>
              <PhoneCall className="mr-2 h-4 w-4" />
              Simulate Incoming Call
            </Button>
          </div>
        )}

        {isRiding && (currentCaller || isScreening) && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm">
            <div className="w-full max-w-sm p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center ${isEmergencyCall ? 'bg-destructive/20' : 'bg-primary/20'}`}>
                    <PhoneIncoming className={`h-12 w-12 animate-pulse ${isEmergencyCall ? 'text-destructive' : 'text-primary'}`} />
                  </div>
                  <div className={`absolute inset-0 rounded-full border-4 ${isEmergencyCall ? 'border-destructive/30' : 'border-primary/30'} animate-ping`}></div>
                </div>
              </div>

              <p className="text-muted-foreground">Incoming call from...</p>
              <h2 className="text-3xl font-bold mb-6">{currentCaller}</h2>
              
              {isEmergencyCall ? (
                <div className="flex items-center justify-center gap-3 text-lg font-medium text-destructive">
                  <ShieldAlert className="h-5 w-5" />
                  <span>Emergency Contact!</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3 text-lg font-medium">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>AI Screening in progress...</span>
                </div>
              )}
            </div>
          </div>
        )}

        {lastCall && !isScreening && (
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 font-semibold">Last Call Result</h3>
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
                        : lastCall.action === "Emergency"
                        ? "text-red-600"
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
          </div>
        )}
      </CardContent>
    </Card>
  );
}
