import { useState } from "react";
import { NavLink } from "react-router";
// import type { Chat } from "../../types/chat";
import { useChatsQuery } from "../hooks/useChatsQuery";
// import { themeClasses } from "../theme";

export const ChatList = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Используем react-query для получения списка чатов, чтобы обеспечить кэширование и автоматическое обновление
  const { data: chats = [] } = useChatsQuery();

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-[var(--border-color)]">
        <input
          type="text"
          placeholder="Search chats..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] focus:outline-none focus:border-[var(--primary-blue)]"
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredChats.map((chat) => (
          <NavLink
            key={chat.id}
            to={`/chat/${chat.id}`}
            className={({ isActive }) =>
              `flex items-center p-4 border-b border-[var(--border-color)] hover:bg-[var(--bg-secondary)] transition-colors ${
                isActive ? "bg-[var(--bg-secondary)]" : ""
              }`
            }
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-[var(--text-primary)] font-medium truncate">
                  {chat.name}
                </h3>
                {chat.lastMessageTime && (
                  <span className="text-xs text-[var(--text-secondary)]">
                    {new Date(chat.lastMessageTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
              </div>
              {chat.lastMessage && (
                <p className="text-sm text-[var(--text-secondary)] truncate">
                  {chat.lastMessage}
                </p>
              )}
            </div>
            {chat.unreadCount && chat.unreadCount > 0 && (
              <div className="ml-2 bg-[var(--primary-blue)] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {chat.unreadCount}
              </div>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};
