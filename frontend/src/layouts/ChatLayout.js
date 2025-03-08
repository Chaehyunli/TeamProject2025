import React from "react";
import { ChatProvider } from "../context/ChatContext";
import { Outlet } from "react-router-dom"; 

const ChatLayout = () => {
    return (
        <ChatProvider>
            <Outlet />  {/* 🔥 하위 라우트가 여기에 렌더링됨 */}
        </ChatProvider>
    );
};

export default ChatLayout;