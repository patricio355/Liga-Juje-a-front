import { useState, useContext, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    function handleLogout() {
        logout();
        navigate("/");
    }

    // Cerrar menú al hacer click afuera
    useEffect(() => {
        function handleClickOutside(e) {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(e.target)
            ) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav className="relative w-full bg-[#E8E5FF] px-6 py-4 flex justify-between items-center z-50">

            {/* LOGO → lleva al home */}
            <Link to="/" className="flex items-center gap-3 cursor-pointer">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white text-xl font-bold">
                    ⚽
                </div>
                <div className="text-black font-extrabold text-xl leading-5">
                    LIGAS <br /> JUJEÑAS
                </div>
            </Link>

            {/* USUARIO (solo si está logueado) */}
            {user && (
                <div className="hidden md:flex items-center gap-2 bg-gray-800 px-3 py-1 rounded-full shadow mr-3">
                    <span className="text-white text-xl">👤</span>
                    <span className="font-medium text-white">{user.sub}</span>
                </div>
            )}

            {/* ICONO MENÚ */}
            <div
                ref={buttonRef}
                className="space-y-1 cursor-pointer z-50"
                onClick={() => setOpen(!open)}
            >
                <div className="w-8 h-[3px] bg-black"></div>
                <div className="w-8 h-[3px] bg-black"></div>
                <div className="w-8 h-[3px] bg-black"></div>
            </div>

            {/* MENÚ DESPLEGABLE */}
            {open && (
                <div
                    ref={menuRef}
                    className="absolute right-4 top-full mt-2 bg-white shadow-lg rounded-lg p-4 w-44 z-50"
                >
                    {/* HOME */}
                    <Link
                        to="/"
                        className="block text-black py-1 text-lg hover:text-blue-600"
                        onClick={() => setOpen(false)}
                    >
                        Home
                    </Link>

                    {/* LOGIN */}
                    {!user && (
                        <Link
                            to="/login"
                            className="block text-black py-1 text-lg hover:text-blue-600"
                            onClick={() => setOpen(false)}
                        >
                            Iniciar sesión
                        </Link>
                    )}

                    {/* DASHBOARD SI ESTÁ LOGUEADO */}
                    {user && (
                        <Link
                            to="/dashboard"
                            className="block text-black py-1 text-lg hover:text-blue-600"
                            onClick={() => setOpen(false)}
                        >
                            Dashboard
                        </Link>
                    )}

                    {/* CERRAR SESIÓN */}
                    {user && (
                        <button
                            onClick={() => {
                                handleLogout();
                                setOpen(false);
                            }}
                            className="block text-left text-black py-1 text-lg hover:text-red-600 w-full"
                        >
                            Cerrar sesión
                        </button>
                    )}
                </div>
            )}
        </nav>
    );
}
