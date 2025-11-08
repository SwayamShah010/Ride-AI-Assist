"use client";

import { Bike } from "lucide-react";

export function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background animate-splash-out">
      <div className="flex animate-splash-logo-in items-center gap-4">
        <div className="rounded-full bg-primary p-4 text-primary-foreground">
          <Bike className="h-12 w-12" />
        </div>
        <h1 className="font-headline text-4xl font-bold tracking-tight">
          Ride AI Assist
        </h1>
      </div>
    </div>
  );
}
