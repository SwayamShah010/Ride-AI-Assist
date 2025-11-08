'use server';

/**
 * @fileOverview This file defines the Genkit flow for intelligent call screening.
 *
 * - intelligentCallScreening - A function that uses AI to decide whether to send an auto-reply to an incoming call.
 * - IntelligentCallScreeningInput - The input type for the intelligentCallScreening function.
 * - IntelligentCallScreeningOutput - The return type for the intelligentCallScreening function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IntelligentCallScreeningInputSchema = z.object({
  callerId: z.string().describe('The phone number of the incoming call.'),
  timeOfDay: z.string().describe('The current time of day (e.g., morning, afternoon, evening, night).'),
  contactPriority: z.string().describe('The priority of the contact (e.g., emergency, high, normal, low).'),
  userRules: z.string().describe('User-defined rules for call screening (e.g., block all calls after 10 PM, allow emergency contacts).'),
  cannedResponse: z.string().describe('The canned auto-reply message to be sent.'),
});
export type IntelligentCallScreeningInput = z.infer<typeof IntelligentCallScreeningInputSchema>;

const IntelligentCallScreeningOutputSchema = z.object({
  shouldSendCannedResponse: z.boolean().describe('Whether or not the canned response should be sent.'),
  reason: z.string().describe('The reason for the decision.'),
});
export type IntelligentCallScreeningOutput = z.infer<typeof IntelligentCallScreeningOutputSchema>;

export async function intelligentCallScreening(input: IntelligentCallScreeningInput): Promise<IntelligentCallScreeningOutput> {
  return intelligentCallScreeningFlow(input);
}

const callScreeningPrompt = ai.definePrompt({
  name: 'callScreeningPrompt',
  input: {schema: IntelligentCallScreeningInputSchema},
  output: {schema: IntelligentCallScreeningOutputSchema},
  prompt: `You are an AI call screening assistant.  Your job is to decide whether or not to send a canned response to an incoming call, or to allow the call to proceed.

  Here is some information about the call:
  Caller ID: {{{callerId}}}
  Time of day: {{{timeOfDay}}}
  Contact priority: {{{contactPriority}}}
  User-defined rules: {{{userRules}}}

  Here is the canned response:
  {{cannedResponse}}

  Based on this information, should the canned response be sent?  Explain your reasoning.

  Return a JSON object with the following format:
  {
    "shouldSendCannedResponse": true or false,
    "reason": "The reason for the decision."
  }`,
});

const intelligentCallScreeningFlow = ai.defineFlow(
  {
    name: 'intelligentCallScreeningFlow',
    inputSchema: IntelligentCallScreeningInputSchema,
    outputSchema: IntelligentCallScreeningOutputSchema,
  },
  async input => {
    const {output} = await callScreeningPrompt(input);
    return output!;
  }
);
