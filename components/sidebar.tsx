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
  User as UserIcon,
} from "lucide-react";

import { useState } from "react";
import { useSidebar } from "./providers/sidebar-provider";
import { removeConversation } from "@/app/server/conversation";
import { useSession } from "@/app/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  const { data: session } = useSession();

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
        className="fixed top-4 left-4 z-50 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-md p-2.5 shadow-sm hover:bg-gray-50 transition-all"
      >
        <PanelLeft size={20} className="text-gray-700" />
      </button>
    );
  }

  return (
    <aside className="w-72 h-screen border-r border-rose-100 bg-white flex flex-col shadow-sm select-none">
      {/* Header */}
      <div className="p-5 flex items-center justify-between border-b border-rose-50">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-rose-500 flex items-center justify-center text-white font-bold text-lg shadow-sm shadow-rose-200">
            C
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            CHAT APP
          </h1>
        </div>

        <button
          onClick={() => setOpen(false)}
          className="rounded-lg p-2 text-gray-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
        >
          <PanelLeft size={18} />
        </button>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <Link
          href="/chat"
          className="flex items-center justify-center gap-2 rounded-xl bg-rose-500 text-white px-4 py-3 hover:bg-rose-600 active:scale-[0.98] transition-all shadow-sm shadow-rose-200 font-medium"
        >
          <Plus size={18} />
          <span>New Chat</span>
        </Link>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-3 space-y-1 custom-scrollbar">
        {chats.length === 0 ? (
          <div className="px-3 py-6 text-center text-sm text-gray-400 font-normal">
            No conversations yet
          </div>
        ) : (
          chats.map((chat) => {
            const active = pathname === `/chat/${chat.id}`;

            return (
              <div
                key={chat.id}
                className={`relative group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all ${
                  active
                    ? "bg-rose-50/80 text-rose-600 font-medium shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Link
                  href={`/chat/${chat.id}`}
                  className="flex items-center gap-3 flex-1 min-w-0"
                >
                  <MessageSquare
                    size={18}
                    className={active ? "text-rose-500" : "text-gray-400"}
                  />
                  <span className="truncate text-sm">{chat.title}</span>
                </Link>

                {/* Three dots menu button */}
                <button
                  onClick={() =>
                    setOpenMenu(openMenu === chat.id ? null : chat.id)
                  }
                  className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-rose-100/50 text-gray-400 hover:text-gray-600 transition-all"
                >
                  <MoreVertical size={16} />
                </button>

                {/* Delete Popover Menu */}
                {openMenu === chat.id && (
                  <div className="absolute right-2 top-10 z-50 bg-white border border-rose-100 rounded-xl shadow-lg p-1 min-w-[120px] animate-in fade-in zoom-in-95 duration-150">
                    <button
                      onClick={() => handleDelete(chat.id)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer / User Profile & Settings */}
      <div className="border-t border-rose-100 p-3 bg-gray-50/50">
        <div className="flex items-center justify-between gap-2 p-2 rounded-xl hover:bg-white transition-all border border-transparent hover:border-rose-100">
          {/* User Profile Info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Avatar className="h-9 w-9 border border-rose-200 shadow-sm flex-shrink-0">
              <AvatarImage src={session?.user?.image || ""} />
              <AvatarFallback className="bg-rose-500 text-white font-semibold text-xs">
                {session?.user?.name?.charAt(0) || <UserIcon size={14} />}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col min-w-0 leading-tight">
              <span className="text-sm font-semibold text-gray-900 truncate">
                {session?.user?.name || "User"}
              </span>
              <span className="text-xs text-gray-500 truncate">
                {session?.user?.email || "user@example.com"}
              </span>
            </div>
          </div>

          {/* Settings Button */}
          <button
            title="Settings"
            className="p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex-shrink-0"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}