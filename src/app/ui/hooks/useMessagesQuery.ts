import { useQuery, useMutation } from "@tanstack/react-query";
import { getMessages, saveMessage } from "../../services/storage";
import { sendMessageToGroq } from "../../services/groq";
import type { Message } from "../../types/chat";

export const useMessagesQuery = (chatId?: string) => {
  // Используем react-query для кэширования и синхронизации сообщений чата
  return useQuery<Message[]>({
    queryKey: ["messages", chatId],
    queryFn: () => (chatId ? getMessages(chatId) : []),
    enabled: !!chatId,
    staleTime: 1000 * 60 * 2, // 2 минуты
  });
};

export const useSendMessageMutation = (
  chatId?: string,
  refetch?: () => void,
) => {
  // Используем mutation для отправки обычного сообщения
  return useMutation({
    mutationFn: async (content: string) => {
      if (!chatId) return;
      const newMessage: Message = {
        id: Date.now().toString(),
        chatId,
        content,
        timestamp: new Date().toISOString(),
        isOutgoing: true,
      };
      saveMessage(chatId, newMessage);
    },
    onSuccess: () => {
      refetch && refetch();
    },
  });
};

export const useSendAiMessageMutation = (
  chatId?: string,
  refetch?: () => void,
) => {
  // Используем mutation для отправки сообщения AI (сначала сохраняем outgoing, потом получаем ответ и сохраняем его)
  return useMutation({
    mutationFn: async (content: string) => {
      if (!chatId) return;
      const newMessage: Message = {
        id: Date.now().toString(),
        chatId,
        content,
        timestamp: new Date().toISOString(),
        isOutgoing: true,
      };
      saveMessage(chatId, newMessage);
      // Получаем ответ от AI
      const aiResponse = await sendMessageToGroq(content);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        chatId,
        content: aiResponse,
        timestamp: new Date().toISOString(),
        isOutgoing: false,
      };
      saveMessage(chatId, aiMessage);
    },
    onSuccess: () => {
      refetch && refetch();
    },
  });
};
