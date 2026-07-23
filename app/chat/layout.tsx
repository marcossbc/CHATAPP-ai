import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/app/lib/auth";
import { getConversations } from "@/app/lib/chat";
import Sidebar from "@/components/sidebar";
import { SidebarProvider } from "@/components/providers/sidebar-provider";

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const conversations = await getConversations(session.user.id);

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar conversations={conversations} />

        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}