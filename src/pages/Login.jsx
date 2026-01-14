import { useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar.jsx";
import { FaEnvelope, FaLock, FaFutbol, FaExclamationTriangle, FaSpinner } from "react-icons/fa";

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
                body: JSON.stringify({
                    email: email.trim(),
                    password: password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 403) {
                    setError(data.message || "Tu cuenta está desactivada.");
                } else if (response.status === 401 || response.status === 400) {
                    setError("Email o contraseña incorrectos.");
                } else {
                    setError("Ocurrió un error inesperado.");
                }
                setIsSubmitting(false);
                return;
            }

            login(data.token);
            window.location.replace("/dashboard");

        } catch (err) {
            setError("No hay conexión con el servidor. Verifica tu internet.");
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#05070a] text-slate-300 font-sans selection:bg-slate-700 selection:text-white relative overflow-hidden">

            {/* Fondo con profundidad idéntico al Home */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,_#1e293b_0%,_transparent_50%)] opacity-40"></div>
            </div>

            <div className="relative z-10">
                <Navbar />

                <div className="flex items-center justify-center p-4 pt-16 min-h-[85vh]">
                    <div className="w-full max-w-md">

                        {sessionExpired && (
                            <div className="mb-6 p-4 bg-slate-800/50 border border-slate-600/50 rounded-2xl flex items-center gap-4 animate-pulse">
                                <FaExclamationTriangle className="text-yellow-500 text-xl shrink-0" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-200 leading-tight">
                                    Sesión caducada. Por seguridad, vuelve a entrar.
                                </p>
                            </div>
                        )}

                        <div className="bg-[#0a0c10] p-10 rounded-[2.5rem] shadow-[0_0_60px_rgba(0,0,0,0.8)] border border-slate-800 relative overflow-hidden group">

                            {/* Efecto de luz superior */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-500/50 to-transparent"></div>
                            <div className="absolute -top-24 -left-24 w-48 h-48 bg-slate-500/5 blur-[80px] rounded-full"></div>

                            <div className="text-center mb-10 relative z-10">
                                <div className="inline-flex p-4 bg-[#111316] rounded-2xl mb-4 border border-slate-700 shadow-inner">
                                    <FaFutbol className="text-3xl text-slate-200" />
                                </div>
                                <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic leading-none">
                                    Ligas <span className="bg-gradient-to-r from-slate-200 via-slate-400 to-slate-500 bg-clip-text text-transparent">Jujeñas</span>
                                </h1>
                                <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.4em] mt-3">
                                    Terminal de Administración
                                </p>
                            </div>

                            {error && (
                                <div className="mb-8 p-4 bg-red-900/10 border border-red-900/30 rounded-xl flex items-center gap-3">
                                    <FaExclamationTriangle className="text-red-500 shrink-0" />
                                    <span className="text-red-400 text-[10px] font-black uppercase tracking-widest leading-relaxed italic">
                                        {error}
                                    </span>
                                </div>
                            )}

                            <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                                {/* Campo: Correo Electrónico */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                        Correo Electrónico
                                    </label>
                                    <div className="relative group/input">
                                        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-slate-200 transition-colors" />
                                        <input
                                            type="email"
                                            name="email"
                                            autoComplete="email"
                                            placeholder="admin@ligajujeña.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full h-14 bg-[#111316] border border-slate-800 p-3 pl-12 rounded-xl focus:outline-none focus:border-slate-500 focus:bg-[#16181b] transition-all text-sm text-slate-200 shadow-inner placeholder:text-slate-700"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Campo: Clave de Acceso */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                        Contraseña
                                    </label>
                                    <div className="relative group/input">
                                        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-slate-200 transition-colors" />
                                        <input
                                            type="password"
                                            name="password"
                                            autoComplete="current-password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full h-14 bg-[#111316] border border-slate-800 p-3 pl-12 rounded-xl focus:outline-none focus:border-slate-500 focus:bg-[#16181b] transition-all text-sm text-slate-200 shadow-inner placeholder:text-slate-700"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    // Botón blanco/plateado para contraste máximo sobre negro
                                    className="w-full h-14 bg-gradient-to-r from-slate-100 to-slate-300 hover:from-white hover:to-slate-200 text-slate-900 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95 disabled:opacity-50 disabled:active:scale-100 mt-4 flex items-center justify-center gap-2 border border-white/50"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <FaSpinner className="animate-spin text-lg" />
                                            Verificando...
                                        </>
                                    ) : "Iniciar Sesión"}
                                </button>
                            </form>

                            <div className="mt-10 text-center border-t border-slate-800 pt-8">
                                <p className="text-slate-600 text-[10px] font-black uppercase italic tracking-[0.2em]">
                                    Sistema de administración • v1.0
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}