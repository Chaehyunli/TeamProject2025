import React from "react";

{/* 상단 배너, 나중에 고정 이미지나 swiper 사용해서 자동 슬라이드 등 다양하게 변경 가능 */}
const BannerHeader = ({ imageUrl, title, height = "h-48" }) => {
    return (
        <div className={`w-full ${height} bg-cover bg-center rounded-lg shadow-md mb-6 mt-24`}
             style={{ backgroundImage: `url('${imageUrl}')` }}>
            <div className="flex items-center justify-center h-full rounded-lg">
                <h1 className="text-white text-3xl font-bold">{title}</h1>
            </div>
        </div>
    );
};

export default BannerHeader;
