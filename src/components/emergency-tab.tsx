
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { ShieldAlert } from "lucide-react";

interface EmergencyTabProps {
  emergencyContacts: string[];
  setEmergencyContacts: (contacts: string[]) => void;
}

const phoneRegex = new RegExp(/^(\+91[\s]?)?\d{10}$/);

export function EmergencyTab({ emergencyContacts, setEmergencyContacts }: EmergencyTabProps) {
  const [newNumber, setNewNumber] = useState("");
  const { toast } = useToast();

  const handleAdd = () => {
    if (!phoneRegex.test(newNumber)) {
      toast({
        variant: "destructive",
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit number (e.g., 9876543210 or +91 9876543210).",
      });
      return;
    }
    if (emergencyContacts.includes(newNumber)) {
      toast({
        variant: "destructive",
        title: "Number already exists",
        description: "This phone number is already on your emergency list.",
      });
      return;
    }

    setEmergencyContacts([...emergencyContacts, newNumber]);
    setNewNumber("");
    toast({
      title: "Contact added",
      description: `${newNumber} has been added to your emergency contacts.`,
    });
  };

  const handleRemove = (numberToRemove: string) => {
    setEmergencyContacts(emergencyContacts.filter((num) => num !== numberToRemove));
    toast({
      title: "Contact removed",
      description: `${numberToRemove} has been removed from your emergency contacts.`,
    });
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="p-0">
        <CardTitle>Emergency Contacts</CardTitle>
        <CardDescription>
          Calls from these numbers are critical and will always bypass all screening.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-0 pt-4">
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            Calls from emergency contacts will always ring your phone, even when Ride Mode is on.
          </AlertDescription>
        </Alert>

        <div className="flex w-full items-center space-x-2">
          <Input
            type="tel"
            placeholder="e.g. 9876543210"
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <Button onClick={handleAdd} size="icon" className="flex-shrink-0">
            <UserPlus className="h-4 w-4" />
            <span className="sr-only">Add Number</span>
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-360px)] rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Phone Number</TableHead>
                <TableHead className="text-right w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {emergencyContacts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground h-24">
                    No emergency contacts added.
                  </TableCell>
                </TableRow>
              ) : (
                emergencyContacts.map((number) => (
                  <TableRow key={number}>
                    <TableCell className="font-medium">{number}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemove(number)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Remove {number}</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
