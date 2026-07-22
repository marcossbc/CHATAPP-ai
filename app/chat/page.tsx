// import { redirect } from "next/dist/server/api-utils";
import { headers } from "next/headers";
import { createConversation } from "../lib/chat";
import { auth } from "../lib/auth";
import { redirect } from "next/navigation";

export default async function NewChatPage() {
  // Get the authenticated session
  const session = await auth.api.getSession({
    headers: await headers()
})

  console.log('session found, redirecting to chat', session);


  if (!session) {
    // session not found, redirect to login
    console.log('session not found, redirecting to login', session);
    redirect('/login');
  }

  // Create a new conversation and redirect to it
  const conversationId = await createConversation(session.user.id);
  redirect(`/chat/${conversationId}`);
}
