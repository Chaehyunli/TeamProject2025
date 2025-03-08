import DirectMessageButton from "../components/DirectMessageButton";

const TestPage = () => {
    // ✅ 임의의 동아리 회장 데이터 (테스트용)
    const president = {
        userId: 1, // 가상의 회장 ID
        email: "president@example.com", // 가상의 회장 이메일
        name: "홍길동", // 회장 이름 (UI 확인용)
    };

    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold">1:1 문의하기 테스트</h1>
            <p>테스트 계정: {president.name} ({president.email})</p>

            {/* ✅ DirectMessageButton에 테스트 데이터 전달 */}
            {/*<DirectMessageButton presidentId={president.userId} presidentEmail={president.email} />*/}
            <DirectMessageButton presidentId={president.userId} presidentName={president.name}/>
        </div>
    );
};

export default TestPage;
