import { useEffect, useState } from "react";
import { fetchUserList } from "../api/userApi";
import DirectMessageButton from "../components/DirectMessageButton";
import UserChatList from "./UserChatList";

const TestPage = () => {
    const [president, setPresident] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ✅ 개발자가 지정한 테스트용 회장 ID
    const targetUserId = 2;

    useEffect(() => {
        const loadUsers = async () => {
            try {
                setLoading(true);
                const users = await fetchUserList();

                // ✅ targetUserId와 일치하는 유저 찾기
                const foundPresident = users.find(user => user.userId === targetUserId);

                if (foundPresident) {
                    setPresident(foundPresident);
                } else {
                    setError("❌ 해당 ID를 가진 사용자를 찾을 수 없습니다.");
                }
            } catch (err) {
                setError("❌ 회원 목록을 불러오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        loadUsers();
    }, []);

    if (loading) {
        return <div className="p-10">⏳ 회원 목록을 불러오는 중...</div>;
    }

    // if (error) {
    //     return (
    //         <div className="p-6 py-[120px]">
    //             <p className="text-red-500">❌ 해당 ID를 가진 사용자를 찾을 수 없습니다.</p>
    //         </div>
    //     );
    // }

    return (
        <div className="p-6 py-[120px]">
            <h1 className="text-2xl font-bold">1:1 문의하기 테스트</h1>
            {error || !president ? (
                <p className="text-red-500 py-[20px]">❌ 해당 ID를 가진 사용자를 찾을 수 없습니다.</p>
            ) : (
                <>
                    <p>테스트 계정: {president.name}</p>
                    <DirectMessageButton presidentId={president.userId} receiverName={president.name} />
                    <UserChatList />
                </>
            )}
        </div>
    );
};

export default TestPage;
