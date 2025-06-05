import { Outlet, useNavigate } from "react-router";
import { useEffect } from "react";
import { themeClasses } from "./theme";
import { ChatList } from "./components/ChatList";

export const Wrapper = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/");
  }, []);

  return (
    <article className="w-screen min-h-screen flex bg-[var(--bg-secondary)]">
      <aside className={`${themeClasses.sidebar} p-0`}>
        <ChatList />
      </aside>
      <main className="flex-1">
        <Outlet />
      </main>
    </article>
  );
};
