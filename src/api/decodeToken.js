import { jwtDecode } from "jwt-decode";

export const decodeToken = (token) => {
    try {
        return jwtDecode(token); // 👈 SOLO lee el payload
    } catch (e) {
        console.error("Token inválido", e);
        return null;
    }
};