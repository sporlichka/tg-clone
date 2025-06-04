import "./app.css";
import { Route, Routes } from "react-router";
import { Wrapper } from "./ui/wrapper.tsx";
import { ChatPage } from "./ui/pages/ChatPage.tsx";

export const App = () => {
  return (
    <Routes>
      <Route path={"/"} element={<Wrapper />}>
        <Route path="chat/:chatId" element={<ChatPage />} />
      </Route>
    </Routes>
  );
};
