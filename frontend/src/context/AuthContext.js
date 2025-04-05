import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({
        userId: localStorage.getItem("userId"),
        username: localStorage.getItem("username"),
        name: localStorage.getItem("name"),
        profileImage: localStorage.getItem("profileImage"),
        email: localStorage.getItem("email"),
    });

    const loginUser = (userData) => {
        localStorage.setItem("userId", userData.userId);
        localStorage.setItem("username", userData.username);
        localStorage.setItem("name", userData.name);
        localStorage.setItem("profileImage", userData.profileImage);
        localStorage.setItem("email", userData.email);

        setUser(userData);
    };

    const logoutUser = () => {
        localStorage.clear();
        setUser({ userId: null, username: null, name: null, profileImage: null, email: null });
    };

    return (
        <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
