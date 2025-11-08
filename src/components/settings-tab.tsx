"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface SettingsTabProps {
  autoReplyMessage: string;
  setAutoReplyMessage: (message: string) => void;
}

const formSchema = z.object({
  message: z
    .string()
    .min(10, "Message must be at least 10 characters.")
    .max(160, "Message must not be longer than 160 characters."),
});

export function SettingsTab({
  autoReplyMessage,
  setAutoReplyMessage,
}: SettingsTabProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: autoReplyMessage,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setAutoReplyMessage(values.message);
    toast({
      title: "Settings saved",
      description: "Your auto-reply message has been updated.",
    });
  }

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="p-0">
        <CardTitle>Message Settings</CardTitle>
        <CardDescription>
          Customize the message that will be sent to callers when you are in
          ride mode.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 pt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Auto-Reply Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., I'm on my bike, I'll call you back soon!"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This message will be sent to non-whitelisted contacts.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Save Message</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
