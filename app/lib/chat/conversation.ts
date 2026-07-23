import { db } from "@/app/db/drizzle";
import { conversation, message } from "@/app/db/schema";
import { nanoid } from "nanoid";
import { eq, desc, and } from "drizzle-orm";

export async function createConversation(userId: string, title?: string) {
  const conversationId = nanoid();

  await db.insert(conversation).values({
    id: conversationId,
    title: title || "New Conversation",
    userId,
  });

  return conversationId;
}

export async function getConversations(userId: string) {
  return await db
    .select()
    .from(conversation)
    .where(eq(conversation.userId, userId))
    .orderBy(desc(conversation.updatedAt));
}

export async function getConversationById(
  conversationId: string,
  userId: string
) {
  const result = await db
    .select()
    .from(conversation)
    .where(eq(conversation.id, conversationId))
    .limit(1);

  const conv = result[0];

  if (!conv || conv.userId !== userId) {
    return null;
  }

  return conv;
}

/* ===========================
   DELETE CONVERSATION
=========================== */

export async function deleteConversation(
  conversationId: string,
  userId: string
) {
  // Hubi in conversation-kan user-kan leeyahay
  const conv = await getConversationById(conversationId, userId);

  if (!conv) {
    throw new Error("Conversation not found");
  }

  // Marka hore delete garee messages-ka
  await db
    .delete(message)
    .where(eq(message.conversationId, conversationId));

  // Kadib delete garee conversation-ka
  await db
    .delete(conversation)
    .where(
      and(
        eq(conversation.id, conversationId),
        eq(conversation.userId, userId)
      )
    );

  return {
    success: true,
  };
}