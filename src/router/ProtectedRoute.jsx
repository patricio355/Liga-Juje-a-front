import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoute({ children }) {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const checkToken = () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const decoded = jwtDecode(token);
                const isExpired = decoded.exp < (Date.now() / 1000);

                if (isExpired) {
                    logout(); // Limpia el contexto y storage
                    navigate("/login"); // Redirige al login
                }
            } catch (error) {
                logout();
                navigate("/login");
            }
        };

        // Verificamos apenas entra a la ruta
        if (user) {
            checkToken();
        }
    }, [user, logout, navigate]); // Se ejecuta si el usuario cambia

    // Si no hay usuario en el contexto, bloqueamos el acceso inmediatamente
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Si hay usuario, permitimos ver el contenido (el useEffect se encarga de sacarlo si expiró)
    return children;
}