import type { Message } from "../types/chat";

const STORAGE_KEY_PREFIX = "chat_messages_";

export const getMessages = (chatId: string): Message[] => {
  const key = `${STORAGE_KEY_PREFIX}${chatId}`;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
};

export const saveMessage = (chatId: string, message: Message): void => {
  const key = `${STORAGE_KEY_PREFIX}${chatId}`;
  const messages = getMessages(chatId);
  messages.push(message);
  localStorage.setItem(key, JSON.stringify(messages));
};

export const saveMessages = (chatId: string, messages: Message[]): void => {
  const key = `${STORAGE_KEY_PREFIX}${chatId}`;
  localStorage.setItem(key, JSON.stringify(messages));
};

export const clearMessages = (chatId: string): void => {
  const key = `${STORAGE_KEY_PREFIX}${chatId}`;
  localStorage.removeItem(key);
};
