// src/api/api.js
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";
export default API_BASE_URL;

console.log("API BASE URL:", process.env.REACT_APP_API_BASE_URL);
