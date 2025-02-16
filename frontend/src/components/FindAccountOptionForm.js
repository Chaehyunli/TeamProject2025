import { useRef, useEffect } from "react";

export default function FindAccountOptionForm({ activeTab, setActiveTab }) {
    const underlineRef = useRef(null);
    const buttonRefs = useRef({ id: null, pw: null });

    useEffect(() => {
        // 애니메이션 타이밍 최적화를 위해 requestAnimationFrame 사용
        requestAnimationFrame(() => {
            if (buttonRefs.current[activeTab] && underlineRef.current) {
                const { offsetLeft, offsetWidth } = buttonRefs.current[activeTab];
                underlineRef.current.style.transform = `translateX(${offsetLeft}px)`;
                underlineRef.current.style.width = `${offsetWidth}px`;
            }
        });
    }, [activeTab]);

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
