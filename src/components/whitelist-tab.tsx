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
    <Card>
      <CardHeader>
        <CardTitle>Contact Whitelist</CardTitle>
        <CardDescription>
          Calls from these numbers will always come through, even in ride mode.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="tel"
            placeholder="(555) 555-5555"
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <Button onClick={handleAdd}>
            <UserPlus className="mr-2 h-4 w-4" /> Add
          </Button>
        </div>

        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Phone Number</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {whitelist.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground">
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
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove {number}</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
