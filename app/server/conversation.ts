"use server";

import { headers } from "next/headers";
import { auth } from "../lib/auth";
import { deleteConversation } from "../lib/chat";

export async function removeConversation(conversationId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  await deleteConversation(conversationId, session.user.id);

  return {
    success: true,
  };
}