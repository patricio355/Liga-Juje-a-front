import { useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar.jsx";
import { FaEnvelope, FaLock, FaFutbol, FaExclamationTriangle } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
    const { login } = useContext(AuthContext);
    const location = useLocation();

    const query = new URLSearchParams(location.search);
    const sessionExpired = query.get("session") === "expired";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleLogin(e) {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                setError("Credenciales inválidas. Revisa tu email y contraseña.");
                setIsSubmitting(false);
                return;
            }

            const data = await response.json();
            login(data.token);
            window.location.replace("/dashboard");
        } catch (err) {
            setError("No hay conexión con el servidor de la liga.");
            setIsSubmitting(false);
        }
    }

    return (
        /* Fondo degradado estilo noche de Champions */
        <div className="min-h-screen bg-[#050814] bg-gradient-to-b from-[#050814] via-[#0a1128] to-[#050814] text-slate-200 font-sans selection:bg-blue-500/30">
            <Navbar />

            <div className="flex items-center justify-center p-4 pt-16">
                <div className="w-full max-w-md">

                    {sessionExpired && (
                        <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-2xl flex items-center gap-4 animate-pulse">
                            <FaExclamationTriangle className="text-blue-400 text-xl shrink-0" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-100 leading-tight">
                                Vuelve a iniciar Sesión
                            </p>
                        </div>
                    )}

                    {/* Tarjeta con borde plateado/azul suave */}
                    <div className="bg-[#0e1630] p-10 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,102,255,0.1)] border border-blue-900/40 relative overflow-hidden">

                        {/* Brillo decorativo superior */}
                        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-600/10 blur-[80px] rounded-full"></div>

                        <div className="text-center mb-10 relative z-10">
                            <div className="inline-flex p-4 bg-[#050814] rounded-2xl mb-4 border border-blue-800/30 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                                <FaFutbol className="text-3xl" />
                            </div>
                            <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic leading-none">
                                Ligas <span className="text-blue-500 bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">Jujeñas</span>
                            </h1>
                            <p className="text-blue-400/60 text-[9px] font-black uppercase tracking-[0.4em] mt-3">
                                Terminal de Administración
                            </p>
                        </div>

                        {error && (
                            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-[10px] font-black uppercase tracking-widest text-center italic">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-[10px] font-black text-blue-300/40 uppercase tracking-widest ml-1">Correo Electrónico</label>
                                <div className="relative">
                                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-700" />
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        autoComplete="email"
                                        placeholder="correo@gmail.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full h-14 bg-[#050814] border border-blue-900/50 p-3 pl-12 rounded-xl focus:outline-none focus:border-blue-500 transition-all text-sm text-white shadow-inner placeholder:text-blue-900"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="password" className="text-[10px] font-black text-blue-300/40 uppercase tracking-widest ml-1">Clave de Acceso</label>
                                <div className="relative">
                                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-700" />
                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full h-14 bg-[#050814] border border-blue-900/50 p-3 pl-12 rounded-xl focus:outline-none focus:border-blue-500 transition-all text-sm text-white shadow-inner placeholder:text-blue-900"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Botón en Azul Champions con brillo */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-14 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-indigo-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] transition-all shadow-[0_10px_30px_rgba(37,99,235,0.2)] active:scale-95 disabled:opacity-50 mt-4 flex items-center justify-center gap-2 border border-blue-400/20"
                            >
                                {isSubmitting ? "Autenticando..." : "Entrar al Sistema"}
                            </button>
                        </form>

                        <div className="mt-10 text-center border-t border-blue-900/30 pt-8">
                            <p className="text-blue-800 text-[10px] font-black uppercase italic tracking-[0.2em]">
                                UEFA Premium Design • Oficial 2026
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}