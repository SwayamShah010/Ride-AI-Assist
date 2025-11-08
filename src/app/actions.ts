"use server";

import {
  intelligentCallScreening,
  type IntelligentCallScreeningInput,
} from "@/ai/flows/intelligent-call-screening";

export async function screenCall(input: IntelligentCallScreeningInput) {
  try {
    const result = await intelligentCallScreening(input);
    return result;
  } catch (error) {
    console.error("Error screening call:", error);
    return {
      shouldSendCannedResponse: false,
      reason: "An error occurred during AI screening.",
    };
  }
}
