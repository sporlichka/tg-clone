import { useState, useEffect } from "react";
import { useParams } from "react-router";
import type { Message } from "../../types/chat";
import { DEFAULT_CHATS } from "../../types/chat";
import { ChatInterface } from "../components/ChatInterface";
import { getMessages, saveMessage } from "../../services/storage";
import { sendMessageToGroq } from "../../services/groq";
import {
  useMessagesQuery,
  useSendMessageMutation,
  useSendAiMessageMutation,
} from "../hooks/useMessagesQuery";
import { useChatsQuery } from "../hooks/useChatsQuery";

export const ChatPage = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const { data: chats = [] } = useChatsQuery();
  const chat = chats.find((c) => c.id === chatId);
  const { data: messages = [], refetch } = useMessagesQuery(chatId);
  const sendMessageMutation = useSendMessageMutation(chatId, refetch);
  const sendAiMessageMutation = useSendAiMessageMutation(chatId, refetch);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (chatId) {
      // Load messages from localStorage when chat changes
      const storedMessages = getMessages(chatId);
      refetch();
    }
  }, [chatId, refetch]);

  const handleSendMessage = async (content: string) => {
    if (!chatId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      chatId,
      content,
      timestamp: new Date().toISOString(),
      isOutgoing: true,
    };

    // Save and update messages
    saveMessage(chatId, newMessage);
    refetch();

    if (chat?.type === "ai") {
      setIsTyping(true);
      try {
        await sendAiMessageMutation.mutateAsync(content);
      } catch (error) {
        console.error("Error getting AI response:", error);
        // Handle error - maybe show an error message to the user
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          chatId,
          content: "Sorry, I couldn't process your message. Please try again.",
          timestamp: new Date().toISOString(),
          isOutgoing: false,
        };
        saveMessage(chatId, errorMessage);
        refetch();
      } finally {
        setIsTyping(false);
      }
    } else {
      await sendMessageMutation.mutateAsync(content);
    }
  };

  if (!chat) {
    return (
      <div className="h-full flex items-center justify-center text-[var(--text-secondary)]">
        Chat not found
      </div>
    );
  }

  return (
    <ChatInterface
      chat={chat}
      messages={messages}
      onSendMessage={handleSendMessage}
      isTyping={isTyping}
    />
  );
};
