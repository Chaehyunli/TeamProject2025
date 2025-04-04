import { useState, useEffect, useRef } from "react";
import {useParams, useNavigate, useLocation} from "react-router-dom";
import { useChat } from "../context/ChatContext";  // 🔥 ChatContext 가져오기
import backIcon from "../assets/backIcon.png";
import {
    fetchReceiverProfileImageUrl,
    connectWebSocket,
    sendMessage,
    disconnectWebSocket,
    loadChatHistory
} from "../api/chatApi";

const StompChatPage = () => {
    const { roomId } = useParams();
    const [roomName, setRoomName] = useState("");
    const { participants, fetchChatParticipants } = useChat();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const senderEmail = localStorage.getItem("email");
    // const stompClientRef = useRef(null);
    // const subscriptionRef = useRef(null);
    const isConnectedRef = useRef(false);
    const scrollRef = useRef(null);
    const [receiverImageUrl, setReceiverImageUrl] = useState(null); // GCP Presigned URL 캐싱
    const [receiverEmail, setReceiverEmail] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const previousPath = useRef(location.state?.previousPath || "");
    const isBackButtonRef = useRef(false);

    useEffect(() => {
        const handlePopState = () => {
            console.log("✅ 브라우저 뒤로가기 버튼 클릭 감지됨.");
            isBackButtonRef.current = true;
        };

        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, []);

    // console.log(`아이 시발시발십라시바ㅣㅁㄴ아ㅣ라ㅣㄴㅇ라ㅣㅁㄴㅇ라ㅣㅁㄴㅇㄹ${previousPath.current}`);

    // 전체로직 부분: 연결상태인가 체크하고 아니라면 연결과 함꼐, 챗 관련 정보들을 로드한다. 종료하면 연결해제한다.
    useEffect(() => {
        console.log("🔌 Connecting WebSocket...");
        connectWebSocket(roomId, (receivedMessage) => {
            setMessages((prevMessages) => [...prevMessages, receivedMessage]);

            // 상대방 정보 갱신하기 (초기에 로드 안되는 이슈 해결 목적으로)
            if (receivedMessage.senderEmail && receivedMessage.senderEmail !== senderEmail) {
                setReceiverEmail(receivedMessage.senderEmail);
                fetchChatParticipants(roomId);
            }
        }, isConnectedRef);

        fetchChatParticipants(roomId);
        loadChatHistory(roomId, senderEmail, setMessages, setReceiverEmail, setRoomName);

        return () => {
            console.log("🔌 Disconnecting WebSocket... 여기는 UseEffect 부분임");
            // disconnectWebSocket(roomId, isConnectedRef);
            handleBack();
        };
    }, [roomId]);

    // 부분 로직 ①. 상대방 프로필 정보 및 Presigned URL 가져오기
    useEffect(() => {
        if (!receiverEmail || !participants[receiverEmail]) return;

        const loadReceiverImageUrl = async () => {
            try {
                const imageUrl = await fetchReceiverProfileImageUrl(receiverEmail, participants);
                if (imageUrl) setReceiverImageUrl(imageUrl);
            } catch (error) {
                console.error("❌ Receiver Image URL 로딩 실패", error);
            }
        };

        loadReceiverImageUrl();
    }, [receiverEmail, participants]); // receiverImageUrl을 의존성에서 제외하여 불필요한 반복 호출 방지해야 한다.

    // 부분 로직 ②. 스크롤은 항상 최신 메시지 기준으로
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // 부분 로직 ④. Stomp Websocket Handler 를 통해 메시지를 보낸다.
    const handleSendMessage = () => {
        sendMessage(roomId, senderEmail, newMessage, isConnectedRef);
        setNewMessage("");
    };

    // 부분 로직 ⑥. 처음 입장 성공 시 최신 메시지 기준으로 넘어가짐
    const scrollToBottom = () => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // 부분 로직 ⑦. Back 으로부터 받아오는 데이터가 ISO 임. 이걸 hhmm 으로 바꾸기 위한 메서드
    function formatTimeFromISO(isoString) {
        return new Date(isoString).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
    }

    // 부분 로직 ⑧. 만약 Back 을 하게 되면 WebSocket 을 해제하는데, 이때 메시지를 읽고 my-chatpage 로 넘어감
    const handleBack = async () => {
        await disconnectWebSocket(roomId, isConnectedRef);   // 읽음처리
        // navigate("/my-chatpage", { state: { reload: true } }); // 그 다음 페이지 이동 & Reload 상태 넘기기

        // ✅ 이전 경로가 MyChatPage 였을 때만 reload 상태를 전달한다.
        if (previousPath.current === "/my-chatpage" && isBackButtonRef.current) {
            console.log("✅ 이전 경로가 MyChatPage입니다. navigate로 상태 전달.");
            navigate("/my-chatpage", { state: { reload: true } });
        }
    };

    return (
        <div className="flex flex-col items-center justify-center py-40">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden">
                <div
                    className="p-4 border-primary border-b border-b-white flex relative justify-center items-center bg-hoverBlueColor text-white font-semibold text-lg rounded-t-2xl">
                    <button
                        onClick={() => {
                            isBackButtonRef.current = true; 
                            handleBack(); // ✅ handleBack 함수 호출
                        }}
                        className="absolute left-4"
                    >
                        <img src={String(backIcon)} alt="뒤로가기" className="w-5 h-5"/>
                    </button>
                    {roomName || "Loading..."}
                </div>

                <div className="h-[600px] overflow-y-auto p-4 space-y-3">
                    {messages.map((msg, index) => {
                        const senderInfo = participants[msg.senderEmail] || {
                            name: "사용자",
                            profileImage: "https://via.placeholder.com/40"
                        };

                        return (
                            <div key={index}
                                 className={`flex ${msg.senderEmail === senderEmail ? "justify-end" : "justify-start"} items-start gap-2`}>
                                {msg.senderEmail !== senderEmail && (

                                    <div className="flex items-start gap-2">
                                        <img src={receiverImageUrl} alt="프로필"
                                             className="w-8 h-8 rounded-full border mt-0"/>
                                        <div className="flex flex-col">
                                            <div className="text-sm font-semibold">{senderInfo.name}</div>
                                            <div className="flex items-end gap-1">
                                                <div
                                                    className="bg-gray-200 rounded-xl p-3 w-fit max-w-xs break-words shadow">
                                                    <div className="text-sm">{msg.message}</div>
                                                </div>
                                                <span
                                                    className="text-xs text-extraText">{formatTimeFromISO(msg.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {msg.senderEmail === senderEmail && (
                                    <div className="flex items-end gap-1">
                                        <span
                                            className="text-xs text-gray-500">{formatTimeFromISO(msg.createdAt)}</span>
                                        <div
                                            className="bg-hoverBlueColor text-white rounded-xl p-3 w-fit max-w-xs break-words shadow">
                                            <div className="text-sm">{msg.message}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    <div ref={scrollRef}/>
                </div>

                <div className="bg-white p-3 border-t flex items-center rounded-b-2xl">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="메시지 입력"
                        className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none"
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    <button onClick={handleSendMessage} className="ml-3 bg-primary text-white px-4 py-2 rounded-lg">전송
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StompChatPage;
