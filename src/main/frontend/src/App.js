import React, { useState } from "react";

function App() {
    const [formData, setFormData] = useState({ name: "", email: "" });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/api/v1/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const result = await response.text();
            setMessage(result); // 서버 응답 메시지 표시
        } catch (error) {
            setMessage("오류가 발생했습니다: " + error.message);
        }
    };

    return (
        <div>
            <h1>사용자 입력 폼</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>이름:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>이메일:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">제출</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default App;


