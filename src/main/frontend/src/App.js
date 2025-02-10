// import React, { useState } from "react";
//
// function App() {
//     const [formData, setFormData] = useState({ name: "", email: "" });
//     const [message, setMessage] = useState("");
//
//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value,
//         });
//     };
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await fetch("http://localhost:8080/api/v1/users", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify(formData),
//             });
//
//             const result = await response.text();
//             setMessage(result); // 서버 응답 메시지 표시
//         } catch (error) {
//             setMessage("오류가 발생했습니다: " + error.message);
//         }
//     };
//
//     return (
//         <div>
//             <h1>사용자 입력 폼</h1>
//             <form onSubmit={handleSubmit}>
//                 <div>
//                     <label>이름:</label>
//                     <input
//                         type="text"
//                         name="name"
//                         value={formData.name}
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>
//                 <div>
//                     <label>이메일:</label>
//                     <input
//                         type="email"
//                         name="email"
//                         value={formData.email}
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>
//                 <button type="submit">제출</button>
//             </form>
//             {message && <p>{message}</p>}
//         </div>
//     );
// }
//
// export default App;
//
//
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
// import UserForm from "./components/UserForm";
import EmailVerificationForm from "./components/EmailVerificationForm";

function App() {
    return (
        <Router> {/* BrowserRouter 대신 Router 사용 */}
            <nav style={navStyle}>
                <Link to="/">사용자 입력</Link> | <Link to="/email-verification">이메일 인증</Link>
            </nav>

            <Routes>
                {/*<Route path="/" element={<UserForm />} />*/}
                <Route path="/email-verification" element={<EmailVerificationForm />} />
            </Routes>
        </Router>
    );
}

// 네비게이션 바 스타일
const navStyle = {
    marginBottom: "20px",
    padding: "10px",
    background: "#f0f0f0",
    textAlign: "center",
};

export default App;
