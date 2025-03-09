import React from "react";
import { ChatProvider } from "../context/ChatContext";
import { Outlet } from "react-router-dom"; 

const ChatLayout = () => {
    return (
        <ChatProvider>
            <Outlet />
        </ChatProvider>
    );
};

export default ChatLayout;