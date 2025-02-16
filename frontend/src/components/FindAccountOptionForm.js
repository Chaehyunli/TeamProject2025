import { useState, useRef, useEffect } from "react";
import {useNavigate} from "react-router-dom";

export default function FindAccountOptionForm({ onSelectOption }) {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("pw");
    const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });

    const buttonRefs = useRef({ id: null, pw: null });

    useEffect(() => {
        if (buttonRefs.current[activeTab]) {
            const { offsetLeft, offsetWidth } = buttonRefs.current[activeTab];
            setUnderlineStyle({ left: offsetLeft, width: offsetWidth });
        }
    }, [activeTab]);

    const handleClick = (option, path) => {
        setActiveTab(option);
        if (onSelectOption) onSelectOption(option);

        navigate(path);
    };

    return (
        <div className="relative flex justify-start gap-x-6 mb-8">
            {/* 아이디 찾기 버튼 */}
            <button
                ref={(el) => (buttonRefs.current.id = el)}
                className={`text-lg font-semibold transition px-1 py-1 ${
                    activeTab === "id" ? "text-black" : "text-gray-500"
                }`}
                onClick={() => handleClick("id", "/account/find/")}
            >
                아이디 찾기
            </button>

            {/* 비밀번호 찾기 버튼 */}
            <button
                ref={(el) => (buttonRefs.current.pw = el)}
                className={`text-lg font-semibold transition px-1 py-1 ${
                    activeTab === "pw" ? "text-black" : "text-gray-500"
                }`}
                onClick={() => handleClick("pw", "/account/find/pw")}
            >
                비밀번호 찾기
            </button>

            {/* 밑줄 애니메이션 */}
            <span
                className="absolute -bottom-1 h-[3.5px] bg-blue-400 transition-all duration-300"
                style={{
                    width: `${underlineStyle.width}px`,
                    left: `${underlineStyle.left}px`,
                }}
            ></span>
        </div>
    );
}
