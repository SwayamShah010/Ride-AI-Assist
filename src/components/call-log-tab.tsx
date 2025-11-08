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
    <Card>
      <CardHeader className="p-4">
        <CardTitle>Call Log</CardTitle>
        <CardDescription>
          A history of recent calls screened by Ride AI Assist.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-250px)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[110px]">Timestamp</TableHead>
                <TableHead>Caller ID</TableHead>
                <TableHead>Action</TableHead>
                <TableHead className="hidden sm:table-cell">Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {callLog.length > 0 ? (
                callLog.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="text-muted-foreground text-xs whitespace-nowrap p-2">
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </TableCell>
                    <TableCell className="font-medium p-2">{entry.callerId}</TableCell>
                    <TableCell className="p-2">
                      <Badge variant={getBadgeVariant(entry.action)}>
                        {entry.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs p-2 hidden sm:table-cell">
                      <div className="flex items-start gap-2">
                        {entry.wasAiUsed && <Bot className="h-3 w-3 flex-shrink-0 mt-0.5 text-primary" />}
                        <span>{entry.reason}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
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
