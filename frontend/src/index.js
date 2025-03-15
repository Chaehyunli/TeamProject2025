import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// npm start (서버 처음 실행)일 때만 localStorage 초기화
if (!sessionStorage.getItem("isServerStarted")) {
    console.log("🔄 서버 최초 실행 - localStorage 초기화됨");
    localStorage.clear();
    sessionStorage.setItem("isServerStarted", "true"); // 서버가 실행되었음을 표시
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
