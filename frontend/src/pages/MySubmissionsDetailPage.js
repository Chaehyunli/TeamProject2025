import React from "react";
import { useParams } from "react-router-dom";

const MySubmissionsDetailPage = () => {
    const { applyId } = useParams(); // URL에서 applyId 가져오기

    return (
        <div className="w-full max-w-3xl mx-auto mt-10 p-24 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-semibold mb-4">나의 지원서 상세 페이지</h2>
            <p>지원서 ID: {applyId}</p>
        </div>
    );
};

export default MySubmissionsDetailPage;
