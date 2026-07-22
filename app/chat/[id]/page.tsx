import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/app/lib/auth';
import { getConversationById, loadChat } from '@/app/lib/chat';
import Chat from '@/components/Chat';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ChatPage({ params }: PageProps) {
  const { id } = await params;
  
  // Get the authenticated session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    // session not found, redirect to login
    console.log('session not found, redirecting to login', session);
    redirect('/login');
  }

  // Validate conversation ownership
  const conversation = await getConversationById(id, session.user.id);
  if (!conversation) {
    redirect('/chat');
  }

  // Load messages for this conversation (Vercel guide pattern)
  const initialMessages = await loadChat(id);

  return (
    <Chat
  conversationId={id}
  initialMessages={initialMessages}
  conversationTitle={conversation.title ?? undefined}
/>
  );
}