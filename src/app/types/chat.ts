export type ChatType = "ai" | "user";

export interface Chat {
  id: string;
  name: string;
  type: ChatType;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

export interface Message {
  id: string;
  chatId: string;
  content: string;
  timestamp: string;
  isOutgoing: boolean;
  isTyping?: boolean;
}

export const DEFAULT_CHATS: Chat[] = [
  {
    id: "ai-chat",
    name: "AI Assistant",
    type: "ai",
    lastMessage: "Hello! How can I help you today?",
    lastMessageTime: new Date().toISOString(),
  },
  {
    id: "user-1",
    name: "Default User 1",
    type: "user",
    lastMessage: "Hi there!",
    lastMessageTime: new Date().toISOString(),
  },
  {
    id: "user-2",
    name: "Default User 2",
    type: "user",
    lastMessage: "Hello!",
    lastMessageTime: new Date().toISOString(),
  },
];
