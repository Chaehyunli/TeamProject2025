import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";
import axios from "axios";
import { useChat } from "../context/ChatContext";  // 🔥 ChatContext 가져오기
import backIcon from "../assets/backIcon.png";
import { fetchChatHistory, markMessagesAsRead } from "../api/chatApi";

const StompChatPage = () => {
    const { roomId } = useParams();
    const { participants, fetchChatParticipants } = useChat();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const senderEmail = localStorage.getItem("email");
    const stompClientRef = useRef(null);
    const subscriptionRef = useRef(null);
    const isConnectedRef = useRef(false);
    const scrollRef = useRef(null);
    const location = useLocation();
    const receiverNameFromNavigate = location.state?.receiverName || "알 수 없음";

    const [receiverEmail, setReceiverEmail] = useState("");
    const [receiverName, setReceiverName] = useState(receiverNameFromNavigate);

    const API_BASE_URL = "http://localhost:8080";

    useEffect(() => {
        if (!isConnectedRef.current) {
            console.log("🔌 Connecting WebSocket...");
            connectWebsocket();
        }

        fetchChatParticipants(roomId);

        const loadChatHistory = async () => {
            try {
                const chatHistory = await fetchChatHistory(roomId);
                console.log("📜 채팅 내역:", chatHistory);
                setMessages(chatHistory);

                const foundReceiverEmail = chatHistory.find(msg => msg.senderEmail !== senderEmail)?.senderEmail || "unknown";
                setReceiverEmail(foundReceiverEmail);
            } catch (error) {
                console.error("❌ Failed to fetch chat history", error);
            }
        };

        loadChatHistory();

        return () => {
            console.log("🔌 Disconnecting WebSocket... 여기는 UseEffect 부분임");
            disconnectWebSocket();
        };
    }, [roomId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const updatedReceiverName = participants[receiverEmail]?.name || receiverNameFromNavigate;
        if (updatedReceiverName !== receiverName) {
            setReceiverName(updatedReceiverName);
        }
    }, [participants, receiverEmail, receiverNameFromNavigate]);

    const connectWebsocket = () => {
        if (isConnectedRef.current) return;

        console.log("🔗 Connecting WebSocket...");
        isConnectedRef.current = true;

        const sockJs = new SockJS(`${API_BASE_URL}/connect`);
        const stompClient = Stomp.over(sockJs);
        stompClientRef.current = stompClient;

        stompClient.connect({}, (frame) => {
                console.log("✅ STOMP WebSocket 연결 성공", frame.headers);

                if (subscriptionRef.current) {
                    subscriptionRef.current.unsubscribe();
                    subscriptionRef.current = null;
                }

                subscriptionRef.current = stompClient.subscribe(
                    `/topic/${roomId}`,
                    (message) => {
                        console.log("📩 메시지 수신:", message.body);
                        const receivedMessage = JSON.parse(message.body);
                        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
                    }
                );
            },
            (error) => {
                console.error("❌ WebSocket 연결 실패", error);
                isConnectedRef.current = false;
            }
        );
    };

    const sendMessage = () => {
        if (!isConnectedRef.current || newMessage.trim() === "") return;

        const message = { senderEmail, message: newMessage };

        stompClientRef.current.send(
            `/publish/${roomId}`,
            JSON.stringify(message),
            { "content-length": new TextEncoder().encode(JSON.stringify(message)).length }
        );

        setNewMessage("");
    };

    const disconnectWebSocket = async () => {
        if (!stompClientRef.current || !isConnectedRef.current) return;

        console.log("🔌 Disconnecting WebSocket .. 여긴 method 내부 코드임. ㄹㅇ");

        try {
            subscriptionRef.current?.unsubscribe();
            subscriptionRef.current = null;

            await new Promise(resolve => {
                if (stompClientRef.current && stompClientRef.current.connected) {
                    stompClientRef.current.disconnect(() => {
                        console.log("✅ WebSocket 해제 완료.");
                        isConnectedRef.current = false;
                        stompClientRef.current = null;
                        resolve();
                    });
                } else {
                    console.log("⚠️ WebSocket 연결이 이미 끊어져 있음.");
                    resolve();
                }
            });

            // ✅ 읽음 처리 API 요청 추가
            await markMessagesAsRead(roomId);

        } catch (error) {
            console.error("❌ WebSocket 해제 중 오류 발생", error);
        }
    };

    const scrollToBottom = () => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    function formatTimeFromISO(isoString) {
        return new Date(isoString).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
    }

    return (
        <div className="flex flex-col items-center justify-center py-10">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden">
                <div
                    className="p-4 border-blue-500 border-b border-b-white flex relative justify-center items-center bg-blue-900 text-white font-semibold text-lg rounded-t-2xl">
                    <button onClick={() => window.history.back()} className="absolute left-4">
                        <img src={String(backIcon)} alt="뒤로가기" className="w-5 h-5"/>
                    </button>
                    {receiverName}
                </div>


                <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[600px]">
                    {messages.map((msg, index) => {
                        const senderInfo = participants[msg.senderEmail] || {
                            name: "사용자",
                            profileUrl: "https://via.placeholder.com/40"
                        };

                        return (
                            <div key={index} className={`flex ${msg.senderEmail === senderEmail ? "justify-end" : "justify-start"} items-start gap-2`}>
                                {msg.senderEmail !== senderEmail && (
                                    <div className="flex items-start gap-2">
                                        <img src={senderInfo.profileUrl} alt="프로필" className="w-8 h-8 rounded-full border mt-0" />
                                        <div className="flex flex-col">
                                            <div className="text-sm font-semibold">{senderInfo.name}</div>
                                            <div className="flex items-end gap-1">
                                                <div className="bg-gray-200 rounded-xl p-3 w-fit max-w-xs break-words shadow">
                                                    <div className="text-sm">{msg.message}</div>
                                                </div>
                                                <span className="text-xs text-gray-500">{formatTimeFromISO(msg.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {msg.senderEmail === senderEmail && (
                                    <div className="flex items-end gap-1">
                                        <span className="text-xs text-gray-500">{formatTimeFromISO(msg.createdAt)}</span>
                                        <div className="bg-blue-500 text-white rounded-xl p-3 w-fit max-w-xs break-words shadow">
                                            <div className="text-sm">{msg.message}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    <div ref={scrollRef} />
                </div>

                <div className="bg-white p-3 border-t flex items-center rounded-b-2xl">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="메시지 입력"
                        className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none"
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <button onClick={sendMessage} className="ml-3 bg-blue-500 text-white px-4 py-2 rounded-lg">전송</button>
                </div>
            </div>
        </div>
    );
};

export default StompChatPage;
