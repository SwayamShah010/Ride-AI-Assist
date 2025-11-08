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

interface WhitelistTabProps {
  whitelist: string[];
  setWhitelist: (whitelist: string[]) => void;
}

const phoneRegex = new RegExp(
  /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/
);

export function WhitelistTab({ whitelist, setWhitelist }: WhitelistTabProps) {
  const [newNumber, setNewNumber] = useState("");
  const { toast } = useToast();

  const handleAdd = () => {
    if (!phoneRegex.test(newNumber)) {
      toast({
        variant: "destructive",
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number format.",
      });
      return;
    }
    if (whitelist.includes(newNumber)) {
      toast({
        variant: "destructive",
        title: "Number already exists",
        description: "This phone number is already on your whitelist.",
      });
      return;
    }

    setWhitelist([...whitelist, newNumber]);
    setNewNumber("");
    toast({
      title: "Contact added",
      description: `${newNumber} has been added to your whitelist.`,
    });
  };

  const handleRemove = (numberToRemove: string) => {
    setWhitelist(whitelist.filter((num) => num !== numberToRemove));
    toast({
      title: "Contact removed",
      description: `${numberToRemove} has been removed from your whitelist.`,
    });
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="p-0">
        <CardTitle>Contact Whitelist</CardTitle>
        <CardDescription>
          Calls from these numbers will always come through, even in ride mode.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-0 pt-4">
        <div className="flex w-full items-center space-x-2">
          <Input
            type="tel"
            placeholder="(555) 555-5555"
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <Button onClick={handleAdd} size="icon" className="flex-shrink-0">
            <UserPlus className="h-4 w-4" />
            <span className="sr-only">Add Number</span>
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-300px)] rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Phone Number</TableHead>
                <TableHead className="text-right w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {whitelist.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground h-24">
                    Your whitelist is empty.
                  </TableCell>
                </TableRow>
              ) : (
                whitelist.map((number) => (
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
