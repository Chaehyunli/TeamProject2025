import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/v1/upload";

// Presigned URL 요청 및 파일 업로드 함수
export const uploadImageToGCP = async (file) => {
    try {
        // 1. presigned URL 요청
        const presignedRes = await axios.get(`${API_BASE_URL}/presigned-url`, {
            params: { fileName: file.name },
            withCredentials: true
        });
        const { url, objectName } = presignedRes.data.data;

        // 2. presigned URL로 PUT 요청하여 파일 업로드
        await axios.put(url, file, {
            headers: {
                "Content-Type": file.type
            }
        });

        // 3. 업로드 후 저장된 파일의 URL은 presigned URL을 통해 가져와야 하므로 객체명을 반환
        return objectName;
    } catch (error) {
        console.error("파일 업로드 실패:", error);
        throw error;
    }
};

// Presigned GET URL을 통해 보호된 이미지 로드
export const ProtectedImage = ({ objectName, alt = "Image", className = "w-32 h-32 object-cover rounded-lg" }) => {
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!objectName) return;

        const fetchImageUrl = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/presigned-url/download`, {
                    params: { objectName },
                    withCredentials: true
                });

                setImageUrl(res.data.data.url);
            } catch (error) {
                console.error("❌ 이미지 URL 가져오기 실패:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchImageUrl();
    }, [objectName]);

    if (loading) return <div>🔄 이미지 로딩 중...</div>;
    return imageUrl ? <img src={imageUrl} alt={alt} className={className} /> : <div>❌ 이미지 로드 실패</div>;
};