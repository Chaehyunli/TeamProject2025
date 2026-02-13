import React from "react";

export default function MainLogoForm({ size = "md", centered = false }) {
    const sizes = {
        sm: { icon: 28, text: "text-lg", gap: "gap-1.5" },
        md: { icon: 34, text: "text-2xl", gap: "gap-2" },
        lg: { icon: 44, text: "text-3xl", gap: "gap-2.5" },
    };
    const s = sizes[size] || sizes.md;

    return (
        <div className={centered ? "flex justify-center mb-10 mt-9" : ""}>
            <div className={`flex items-center ${s.gap}`}>
                {/* 로고 아이콘 */}
                <svg
                    width={s.icon}
                    height={s.icon}
                    viewBox="0 0 120 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* 배경 원 */}
                    <circle cx="60" cy="60" r="58" fill="#65A3FF" />

                    {/* 왼쪽 사람 */}
                    <circle cx="32" cy="42" r="9" fill="white" />
                    <path d="M18 72 C18 58, 46 58, 46 72" fill="white" />

                    {/* 가운데 사람 (메인) */}
                    <circle cx="60" cy="36" r="12" fill="white" />
                    <path d="M40 70 C40 54, 80 54, 80 70" fill="white" />

                    {/* 오른쪽 사람 */}
                    <circle cx="88" cy="42" r="9" fill="white" />
                    <path d="M74 72 C74 58, 102 58, 102 72" fill="white" />

                    {/* 하단 연결 바 */}
                    <rect x="20" y="76" rx="5" ry="5" width="80" height="10" fill="white" opacity="0.9" />

                    {/* CM 이니셜 */}
                    <text
                        x="60"
                        y="102"
                        textAnchor="middle"
                        fill="white"
                        fontSize="16"
                        fontWeight="bold"
                        fontFamily="Arial, sans-serif"
                    >
                        ClubMoa
                    </text>
                </svg>

                {/* 텍스트 로고 */}
                <span className={`${s.text} font-extrabold tracking-tight`}>
                    <span style={{ color: "#65A3FF" }}>동아리</span>
                    <span className="text-gray-800">모아</span>
                </span>
            </div>
        </div>
    );
}
