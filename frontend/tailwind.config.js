module.exports = {
    // 템플릿 파일의 경로 설정 👀
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#65A3FF', // 기본 파란색
                hoverBlueColor: '#3B82F6', // bg-primary의 Button hover 시 약간 더 진한 파란색
                hoverWhiteColor: '#f3f4f6', // bg-White의 Button hover 시 약간의 회색
                extraText: '#717171', // 부가적 텍스트 eg) 동아리 검색
                hoverGrayColor: '#374151', // text-extraText hover 시
                warningText: '#EF4444', // 경고 텍스트
                warningButton: '#FF5050', // 경고 버튼
                hoverWarningButton: '#DC2626' // 경고 버튼 hover 시 더 진한 빨간색
            },
            fontFamily: {
                sans: ['Pretendard', 'sans-serif'], // 전체 기본 폰트
            }
        },
    },
    plugins: [],
}