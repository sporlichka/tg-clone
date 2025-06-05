import { useQuery } from "@tanstack/react-query";
import { DEFAULT_CHATS } from "../../types/chat";
import type { Chat } from "../../types/chat";

// Получаем чаты из localStorage или используем дефолтные
const getChats = (): Chat[] => {
  const stored = localStorage.getItem("chats");
  if (!stored) {
    // Если чатов нет, инициализируем localStorage дефолтными чатами
    localStorage.setItem("chats", JSON.stringify(DEFAULT_CHATS));
    return DEFAULT_CHATS;
  }
  return JSON.parse(stored);
};

export const useChatsQuery = () => {
  // Используем react-query для кэширования и синхронизации списка чатов
  return useQuery<Chat[]>({
    queryKey: ["chats"],
    queryFn: getChats,
    staleTime: 1000 * 60 * 5, // 5 минут
  });
};
