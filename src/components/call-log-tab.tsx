
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { CallLogEntry } from "@/lib/types";
import { Bot } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CallLogTabProps {
  callLog: CallLogEntry[];
}

export function CallLogTab({ callLog }: CallLogTabProps) {
  const getBadgeVariant = (
    action: CallLogEntry["action"]
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (action) {
      case "Allowed":
        return "secondary";
      case "Auto-Replied":
        return "default";
      case "Whitelisted":
        return "outline";
      case "Error":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="p-4">
        <CardTitle>Call Log</CardTitle>
        <CardDescription>
          A history of recent calls screened by Ride AI Assist.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-270px)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] p-2">Time</TableHead>
                <TableHead className="p-2">Caller ID</TableHead>
                <TableHead className="p-2 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {callLog.length > 0 ? (
                callLog.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="text-muted-foreground text-xs whitespace-nowrap p-2">
                      {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </TableCell>
                    <TableCell className="font-medium p-2">{entry.callerId}</TableCell>
                    <TableCell className="p-2 text-right">
                      <Badge variant={getBadgeVariant(entry.action)}>
                        {entry.action}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No call history yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
