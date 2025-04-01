import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getNoticeDetail, updateNotice } from '../api/clubApi';
import { uploadImageToGCP } from '../api/uploadApi';
import UpdateNoticeForm from '../components/UpdateNoticeForm';

const UpdateNoticePage = () => {
    const navigate = useNavigate();
    const { clubId, noticeId } = useParams();

    const [originalData, setOriginalData] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        contents: "",
        thumbUrl: ""
    });

    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const fetchNotice = async () => {
            try {
                const response = await getNoticeDetail(clubId, noticeId);
                setOriginalData(response);
                setFormData({
                    title: response.title,
                    contents: response.contents,
                    thumbUrl: response.thumbUrl || ""
                });
            } catch (error) {
                console.error('공지사항 정보 불러오기 실패:', error);
                alert("공지사항 정보를 불러오는 데 실패했습니다.");
            }
        };

        fetchNotice();
    }, [clubId, noticeId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (fileOrEmptyString) => {
        if (fileOrEmptyString === '') {
            setFormData(prev => ({
                ...prev,
                thumbUrl: '',
            }));
            return;
        }

        if (fileOrEmptyString instanceof File) {
            if (!["image/png", "image/jpeg"].includes(fileOrEmptyString.type)) {
                alert("PNG 또는 JPEG 파일만 업로드할 수 있습니다.");
                return;
            }

            if (fileOrEmptyString.size > 10 * 1024 * 1024) {
                alert("파일 크기는 최대 10MB까지 업로드 가능합니다.");
                return;
            }

            setFormData(prev => ({
                ...prev,
                thumbUrl: fileOrEmptyString
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!originalData) return;

        const isSameText =
            formData.title === originalData.title &&
            formData.contents === originalData.contents;

        const isSameImage =
            typeof formData.thumbUrl === "string" &&
            formData.thumbUrl === originalData.thumbUrl;

        if (isSameText && isSameImage) {
            alert("변경된 내용이 없습니다.");
            return;
        }

        setActionLoading(true);

        try {
            let imageUrl = formData.thumbUrl;

            if (imageUrl instanceof File) {
                imageUrl = await uploadImageToGCP(imageUrl);
            }

            await updateNotice(clubId, noticeId, {
                title: formData.title,
                contents: formData.contents,
                thumbUrl: imageUrl || null,
            });

            alert("공지사항이 수정되었습니다.");
            navigate(`/clubs/${clubId}/notices/${noticeId}`);
        } catch (error) {
            console.error('공지사항 수정 실패:', error);
            alert("공지사항 수정에 실패했습니다. 다시 시도해주세요.");
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h2 className="text-2xl font-bold mb-6">공지사항 수정</h2>
            <UpdateNoticeForm
                formData={formData}
                handleChange={handleChange}
                handleFileChange={handleFileChange}
                handleSubmit={handleSubmit}
                actionLoading={actionLoading}
                onCancel={() => navigate(`/clubs/${clubId}/notices/${noticeId}`)}
            />
        </div>
    );
};

export default UpdateNoticePage;
