import { useRef, useEffect } from "react";

export default function FindAccountOptionForm({ activeTab, setActiveTab }) {
    const underlineRef = useRef(null);
    const buttonRefs = useRef({ id: null, pw: null });

    useEffect(() => {
        // setTimeout을 사용하여 DOM 업데이트가 완료된 후 실행하도록 보장
        setTimeout(() => {
            if (buttonRefs.current[activeTab] && underlineRef.current) {
                const { offsetLeft, offsetWidth } = buttonRefs.current[activeTab];

                underlineRef.current.style.left = `${offsetLeft}px`;
                underlineRef.current.style.width = `${offsetWidth}px`;
            }
        }, 0); // 0ms 딜레이를 줘서 렌더링 이후 실행됨

    }, [activeTab]); // activeTab 변경 시 실행됨

    return (
        <div className="relative flex justify-start gap-x-6 mb-8">
            {/* 아이디 찾기 버튼 */}
            <button
                ref={(el) => (buttonRefs.current.id = el)}
                className={`text-lg font-semibold transition px-1 py-1 ${
                    activeTab === "id" ? "text-black" : "text-gray-500"
                }`}
                onClick={() => setActiveTab("id")}
            >
                아이디 찾기
            </button>

            {/* 비밀번호 찾기 버튼 */}
            <button
                ref={(el) => (buttonRefs.current.pw = el)}
                className={`text-lg font-semibold transition px-1 py-1 ${
                    activeTab === "pw" ? "text-black" : "text-gray-500"
                }`}
                onClick={() => setActiveTab("pw")}
            >
                비밀번호 찾기
            </button>

            {/* 밑줄 애니메이션 */}
            <span
                ref={underlineRef}
                className="absolute -bottom-1 h-[3.5px] bg-blue-400 transition-all duration-300 ease-in-out"
            ></span>
        </div>
    );
}
