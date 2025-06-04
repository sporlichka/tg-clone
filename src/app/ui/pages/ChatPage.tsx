import { useState, useEffect } from "react";
import { useParams } from "react-router";
import type { Message } from "../../types/chat";
import { DEFAULT_CHATS } from "../../types/chat";
import { ChatInterface } from "../components/ChatInterface";
import { getMessages, saveMessage } from "../../services/storage";
import { sendMessageToGroq } from "../../services/groq";

export const ChatPage = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const chat = DEFAULT_CHATS.find((c) => c.id === chatId);

  useEffect(() => {
    if (chatId) {
      // Load messages from localStorage when chat changes
      const storedMessages = getMessages(chatId);
      setMessages(storedMessages);
    }
  }, [chatId]);

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
    setMessages((prev) => [...prev, newMessage]);

    if (chat?.type === "ai") {
      setIsTyping(true);
      try {
        // Get AI response from Groq
        const aiResponse = await sendMessageToGroq(content);

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          chatId,
          content: aiResponse,
          timestamp: new Date().toISOString(),
          isOutgoing: false,
        };

        // Save and update AI response
        saveMessage(chatId, aiMessage);
        setMessages((prev) => [...prev, aiMessage]);
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
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsTyping(false);
      }
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
