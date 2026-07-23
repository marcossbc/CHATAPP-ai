"use client";

import { Button } from "@/components/ui/button";
import { Image, Send } from "lucide-react";
import { useState } from "react";

interface ChatInputProps {
  sendMessage: (message: { text: string }) => void;
  status: string;
}

export default function ChatInput({ sendMessage, status }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [imageMode, setImageMode] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!input.trim()) return;

    if (imageMode) {
      const res = await fetch("/api/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: input,
        }),
      });

      const data = await res.json();

      console.log("IMAGE:", data.url);

      setInput("");
      setImageMode(false);

      return;
    }

    sendMessage({
      text: input,
    });

    setInput("");
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
      <div className="flex gap-3">
        <input
          className="flex-1 p-3 border rounded-xl"
          value={input}
          placeholder={
            imageMode
              ? "Describe the image you want..."
              : "Type your message..."
          }
          onChange={(e) => setInput(e.target.value)}
          disabled={status !== "ready"}
        />

        <Button
          type="button"
          onClick={() => setImageMode(!imageMode)}
          className={imageMode ? "bg-black text-white" : ""}
        >
          <Image size={18} />
        </Button>

        <Button type="submit" disabled={status !== "ready" || !input.trim()}>
          <Send size={18} />
        </Button>
      </div>
    </form>
  );
}
