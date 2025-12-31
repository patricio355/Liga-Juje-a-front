import { useState, useContext, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
    FaUserCircle, FaBars, FaTimes,
    FaSignOutAlt, FaThLarge, FaHome
} from "react-icons/fa"; // FaThLarge reemplaza al inexistente FaLayout

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

    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target) &&
                buttonRef.current && !buttonRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav className="relative w-full bg-[#0a1a11]/90 backdrop-blur-md px-6 py-4 flex justify-between items-center z-[100] border-b border-emerald-500/20 shadow-xl">
            {/* LOGO */}
            <Link to="/" className="flex items-center gap-3 group">
                <div className="w-11 h-11 bg-emerald-500 rounded-xl flex items-center justify-center text-black text-2xl shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                    ⚽
                </div>
                <div className="text-white font-black text-xl leading-5 tracking-tighter uppercase italic">
                    Ligas <br /> <span className="text-emerald-500">Jujeñas</span>
                </div>
            </Link>

            <div className="flex items-center gap-4">
                {user && (
                    <div className="hidden md:flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                        <FaUserCircle className="text-emerald-500" />
                        <span className="font-bold text-[10px] text-emerald-400 uppercase">{user.sub}</span>
                    </div>
                )}
                <button
                    ref={buttonRef}
                    className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-all"
                    onClick={() => setOpen(!open)}
                >
                    {open ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
            </div>

            {/* MENÚ DESPLEGABLE */}
            {open && (
                <div ref={menuRef} className="absolute right-6 top-[calc(100%+10px)] bg-[#12172d] border border-emerald-500/30 shadow-2xl rounded-2xl p-2 w-52 z-[110] animate-in fade-in zoom-in duration-200">
                    <div className="flex flex-col gap-1">
                        <Link to="/" className="flex items-center gap-3 text-gray-300 px-4 py-3 rounded-xl hover:bg-emerald-500 hover:text-black font-bold transition-all" onClick={() => setOpen(false)}>
                            <FaHome /> Home
                        </Link>
                        {user ? (
                            <>
                                <Link to="/dashboard" className="flex items-center gap-3 text-gray-300 px-4 py-3 rounded-xl hover:bg-emerald-500 hover:text-black font-bold transition-all" onClick={() => setOpen(false)}>
                                    <FaThLarge /> Dashboard
                                </Link>
                                <button onClick={handleLogout} className="flex items-center gap-3 text-red-400 px-4 py-3 rounded-xl hover:bg-red-500/10 font-bold transition-all text-left w-full">
                                    <FaSignOutAlt /> Salir
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="flex items-center gap-3 text-emerald-500 px-4 py-3 rounded-xl hover:bg-emerald-500/10 font-bold" onClick={() => setOpen(false)}>
                                Iniciar sesión
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}