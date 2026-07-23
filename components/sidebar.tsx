"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  MessageSquare,
  Plus,
  Settings,
  PanelLeft,
  MoreVertical,
  Trash2,
} from "lucide-react";

import { useState } from "react";
import { useSidebar } from "./providers/sidebar-provider";
import { removeConversation } from "@/app/server/conversation";

type Conversation = {
  id: string;
  title: string | null;
};

interface SidebarProps {
  conversations: Conversation[];
}

export default function Sidebar({ conversations }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const { open, setOpen } = useSidebar();

  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const chats = conversations.filter(
    (chat) =>
      chat.title &&
      chat.title.trim() !== "" &&
      chat.title !== "New Conversation",
  );

  async function handleDelete(id: string) {
    try {
      await removeConversation(id);

      setOpenMenu(null);

      router.refresh();

      if (pathname === `/chat/${id}`) {
        router.push("/chat");
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-50 rounded-lg border bg-white p-2 shadow hover:bg-gray-100"
      >
        <PanelLeft size={24} />
      </button>
    );
  }

  return (
    <aside className="w-72 h-screen border-r bg-white flex flex-col">
      {/* Header */}
      <div className="border-b p-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold">CHAT APP</h1>

        <button
          onClick={() => setOpen(false)}
          className="rounded-md p-2 hover:bg-gray-100"
        >
          <PanelLeft size={20} />
        </button>
      </div>

      {/* New Chat */}
      <div className="p-4">
        <Link
          href="/chat"
          className="flex items-center justify-center gap-2 rounded-lg bg-black text-white px-4 py-3 hover:bg-gray-800 transition"
        >
          <Plus size={18} />

          <span>New Chat</span>
        </Link>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        {chats.length === 0 ? (
          <div className="px-3 py-2 text-sm text-gray-500">
            No conversations yet
          </div>
        ) : (
          chats.map((chat) => {
            const active = pathname === `/chat/${chat.id}`;

            return (
              <div
                key={chat.id}
                className={`relative flex items-center gap-3 rounded-lg px-3 py-3 transition ${
                  active ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"
                }`}
              >
                <Link
                  href={`/chat/${chat.id}`}
                  className="flex items-center gap-3 flex-1 min-w-0"
                >
                  <MessageSquare size={18} />

                  <span className="truncate">{chat.title}</span>
                </Link>

                {/* Three dots */}
                <button
                  onClick={() =>
                    setOpenMenu(openMenu === chat.id ? null : chat.id)
                  }
                  className="p-1 rounded hover:bg-gray-200"
                >
                  <MoreVertical size={18} />
                </button>

                {/* Delete Menu */}
                {openMenu === chat.id && (
                  <div className="absolute right-2 top-12 z-50 bg-white border rounded-lg shadow-md">
                    <button
                      onClick={() => handleDelete(chat.id)}
                      className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="border-t p-4">
        <button className="flex items-center gap-2 text-gray-700 hover:text-black">
          <Settings size={18} />

          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}
