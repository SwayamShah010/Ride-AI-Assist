
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
import { Bot, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface CallLogTabProps {
  callLog: CallLogEntry[];
  clearCallLog: () => void;
}

export function CallLogTab({ callLog, clearCallLog }: CallLogTabProps) {
  const { toast } = useToast();
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
      case "Emergency":
        return "destructive";
      case "Error":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const handleClear = () => {
    clearCallLog();
    toast({
      title: "Call Log Cleared",
      description: "Your call history has been successfully cleared.",
    });
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="flex-row items-center justify-between p-4">
        <div className="space-y-1">
          <CardTitle>Call Log</CardTitle>
          <CardDescription>
            A history of recent calls screened by Ride AI Assist.
          </CardDescription>
        </div>
        {callLog.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Clear History
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your entire call log history.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleClear}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
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
                      {new Date(entry.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell className="font-medium p-2">
                      {entry.callerId}
                    </TableCell>
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
