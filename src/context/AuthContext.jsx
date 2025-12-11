import { createContext, useState } from "react";
import { decodeToken } from "../api/decodeToken";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem("token");
        return token ? decodeToken(token) : null;
    });

    const login = (token) => {
        localStorage.setItem("token", token);
        const decoded = decodeToken(token);
        setUser(decoded);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
