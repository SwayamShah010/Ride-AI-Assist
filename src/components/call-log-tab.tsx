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
  TableCaption,
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
      <CardHeader>
        <CardTitle>Call Log</CardTitle>
        <CardDescription>
          A history of recent calls screened by RideReply.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96 rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Caller ID</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {callLog.length > 0 ? (
                callLog.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="text-muted-foreground whitespace-nowrap">
                      {entry.timestamp}
                    </TableCell>
                    <TableCell className="font-medium">{entry.callerId}</TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(entry.action)}>
                        {entry.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <div className="flex items-start gap-2">
                        {entry.wasAiUsed && <Bot className="h-4 w-4 flex-shrink-0 mt-0.5 text-primary" />}
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
                    No call history yet. Activate ride mode to start screening.
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
