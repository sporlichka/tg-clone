import { useState, useRef, useEffect } from "react";
import type { Chat, Message } from "../../types/chat";
import { themeClasses } from "../theme";

interface ChatInterfaceProps {
  chat: Chat;
  messages: Message[];
  onSendMessage: (content: string) => void;
  isTyping?: boolean;
}

export const ChatInterface = ({
  chat,
  messages,
  onSendMessage,
  isTyping = false,
}: ChatInterfaceProps) => {
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      onSendMessage(messageInput.trim());
      setMessageInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className={themeClasses.chatHeader}>
        <h2 className="text-lg font-medium text-[var(--text-primary)]">
          {chat.name}
        </h2>
        {chat.type === "ai" && (
          <div className="ml-2 flex items-center">
            <div className={themeClasses.onlineIndicator} />
            <span className="ml-2 text-sm text-[var(--text-secondary)]">
              Online
            </span>
          </div>
        )}
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isOutgoing ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] p-3 ${
                message.isOutgoing
                  ? themeClasses.messageOut
                  : themeClasses.messageIn
              }`}
            >
              <p className="text-[var(--text-primary)]">{message.content}</p>
              <span className="text-xs text-[var(--text-secondary)] mt-1 block">
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className={`max-w-[70%] p-3 ${themeClasses.messageIn}`}>
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-[var(--text-secondary)] rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-[var(--text-secondary)] rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-[var(--text-secondary)] rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={themeClasses.inputArea}>
        <div className="flex items-end gap-2">
          <textarea
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 resize-none rounded-lg border border-[var(--border-color)] p-3 focus:outline-none focus:border-[var(--primary-blue)] min-h-[40px] max-h-[120px]"
            rows={1}
          />
          <button
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
            className="bg-[var(--primary-blue)] text-white p-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--dark-blue)] transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
