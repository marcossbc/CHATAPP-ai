// import { db } from "@/app/db/drizzle";
// import { conversation, message } from "@/app/db/schema";
// import { UIMessage } from "ai";
// import { eq, desc } from "drizzle-orm";
// import { nanoid } from "nanoid";

// export async function loadChat(
//   conversationId: string
// ): Promise<UIMessage[]> {
//   const messages = await db
//     .select()
//     .from(message)
//     .where(eq(message.conversationId, conversationId))
//     .orderBy(desc(message.createdAt));

//   return messages.map((msg) => ({
//     id: msg.id,
//     role: msg.role as "user" | "assistant",
//     parts: [
//       {
//         type: "text",
//         text: msg.content,
//       },
//     ],
//   }));
// }

// export async function saveChat({
//   chatId,
//   messages,
// }: {
//   chatId: string;
//   messages: UIMessage[];
// }): Promise<void> {
//   // Check if conversation exists

//   const conv = await db
//     .select({ userId: conversation.userId })
//     .from(conversation)
//     .where(eq(conversation.id, chatId))
//     .limit(1);

//   if (!conv.length) {
//     return;
//   }

//   const userId = conv[0].userId;

//   /// getting existing messages to avoid duplicates

//   const existingMessages = await db
//     .select({ id: message.id })
//     .from(message)
//     .where(eq(message.conversationId, chatId));

//   const existingIds = new Set(existingMessages.map((msg) => msg.id));

//   // only new messages saved

//   const newMessages = messages.filter(
//     (msg) => !existingIds.has(msg.id)
//   );

//   if (!newMessages.length) {
//     return;
//   }

//   // transform messages to db format

//   const dbMessages = newMessages.map((msg) => {
//     const text =
//       msg.parts
//         .filter((part) => part.type === "text")
//         .map((part) => part.text)
//         .join("");

//     return {
//       id: msg.id ?? nanoid(),
//       conversationId: chatId,
//       userId,
//       role: msg.role,
//       content: text,
//     };
//   });

//   await db.insert(message).values(dbMessages);

//   // update conversation title

//   const firstMessage = newMessages.find((msg) => msg.role === "user");

//   if (firstMessage) {
//     const title =
//       firstMessage.parts
//         .filter((part) => part.type === "text")
//         .map((part) => part.text)
//         .join("")
//         .slice(0, 50) || "New Conversation";

//     await db
//       .update(conversation)
//       .set({
//         title,
//       })
//       .where(eq(conversation.id, chatId));
//   }
// }


import { db } from "@/app/db/drizzle"; // Xiriirka database-ka
import { conversation, message } from "@/app/db/schema"; // Tables-ka conversation iyo message
import { UIMessage } from "ai"; // Nooca message-ka AI SDK
import { eq, desc } from "drizzle-orm"; // eq = where, desc = newest first
import { nanoid } from "nanoid"; // Sameeya ID cusub

// ====================== LOAD CHAT ======================
// Shaqadani waxay database-ka kasoo qaadaysaa fariimihii hore
export async function loadChat(
  conversationId: string
): Promise<UIMessage[]> {

  // Soo qaado dhammaan messages-ka conversation-kan
  const messages = await db
    .select() // Soo qaado columns-ka oo dhan
    .from(message) // Ka keen table-ka message
    .where(eq(message.conversationId, conversationId)) // Kaliya conversation-kan
    .orderBy(desc(message.createdAt)); // Ku kala saar kii ugu dambeeyey marka hore

  // Messages-ka database-ka u beddel qaabka AI SDK uu rabo
  return messages.map((msg) => ({
    id: msg.id,
    role: msg.role as "user" | "assistant",

    // AI SDK v7 wuxuu isticmaalaa parts halkii uu ka isticmaali lahaa content
    parts: [
      {
        type: "text",
        text: msg.content,
      },
    ],
  }));
}

// ====================== SAVE CHAT ======================
// Shaqadani waxay kaydinaysaa messages-ka cusub
export async function saveChat({
  chatId,
  messages,
}: {
  chatId: string;
  messages: UIMessage[];
}): Promise<void> {

  // Hubi conversation-kan inuu jiro
  const conv = await db
    .select({
      userId: conversation.userId,
    })
    .from(conversation)
    .where(eq(conversation.id, chatId))
    .limit(1);

  // Haddii conversation-ka uusan jirin, jooji
  if (!conv.length) {
    return;
  }

  // Soo qaado userId-ga leh conversation-kan
  const userId = conv[0].userId;

  // ================== DUPLICATE CHECK ==================
  // Soo qaado message-yadii hore si aan mar labaad loo kaydin

  const existingMessages = await db
    .select({
      id: message.id,
    })
    .from(message)
    .where(eq(message.conversationId, chatId));

  // IDs-ka message-yadii hore geli Set
  const existingIds = new Set(
    existingMessages.map((msg) => msg.id)
  );

  // Kaliya dooro messages-ka cusub
  const newMessages = messages.filter(
    (msg) => !existingIds.has(msg.id)
  );

  // Haddii wax cusub aysan jirin, jooji
  if (!newMessages.length) {
    return;
  }

  // ================== DATABASE FORMAT ==================
  // UIMessage-ka AI u beddel qaabka database-ku rabo

  const dbMessages = newMessages.map((msg) => {

    // Soo saar text-ka ku jira parts
    const text = msg.parts
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join("");

    return {

      // Haddii message-ku uusan lahayn ID samee ID cusub
      id: msg.id ?? nanoid(),

      // Conversation-ka uu message-kan ka tirsan yahay
      conversationId: chatId,

      // User-ka leh conversation-kan
      userId,

      // user ama assistant
      role: msg.role,

      // Text-ka message-ka
      content: text,
    };
  });

  // Ku kaydi database-ka
  await db.insert(message).values(dbMessages);

  // ================== UPDATE TITLE ==================
  // Soo hel message-kii ugu horreeyey ee user-ka qoray

  const firstMessage = newMessages.find(
    (msg) => msg.role === "user"
  );

  if (firstMessage) {

    // Ka samee title qoraalka ugu horreeya
    const title =
      firstMessage.parts
        .filter((part) => part.type === "text")
        .map((part) => part.text)
        .join("")
        .slice(0, 50) || "New Conversation";

    // Cusboonaysii title-ka conversation-ka
    await db
      .update(conversation)
      .set({
        title,
      })
      .where(eq(conversation.id, chatId));
  }
}