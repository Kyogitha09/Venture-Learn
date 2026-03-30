import { useEffect, useState } from "react";
import AppShell from "../components/layout/AppShell.jsx";
import ChatList from "../components/messages/ChatList.jsx";
import ChatWindow from "../components/messages/ChatWindow.jsx";
import { getMessageThreads } from "../services/api.js";

function formatMessageTime(date = new Date()) {
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Messages() {
  const [threads, setThreads] = useState([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    let active = true;

    async function loadThreads() {
      const response = await getMessageThreads();

      if (active) {
        setThreads(response);
        setActiveId(response[0]?.id ?? "");
      }
    }

    loadThreads();

    return () => {
      active = false;
    };
  }, []);

  const activeThread = threads.find((thread) => thread.id === activeId) ?? null;

  function handleSendMessage(text) {
    const trimmedText = text.trim();

    if (!trimmedText || !activeThread) {
      return;
    }

    const nextMessage = {
      id: `local-${Date.now()}`,
      sender: "me",
      text: trimmedText,
      time: formatMessageTime(),
    };

    setThreads((current) =>
      current.map((thread) =>
        thread.id === activeThread.id
          ? {
              ...thread,
              preview: trimmedText,
              status: "Just now",
              messages: [...thread.messages, nextMessage],
            }
          : thread,
      ),
    );
  }

  return (
    <AppShell
      title="Messages"
      subtitle="A two-panel workspace for investors, founders, and community conversations."
    >
      <section className="chat-layout responsive-grid responsive-grid--chat">
        <ChatList threads={threads} activeId={activeId} onSelect={setActiveId} />
        <ChatWindow thread={activeThread} onSendMessage={handleSendMessage} />
      </section>
    </AppShell>
  );
}
