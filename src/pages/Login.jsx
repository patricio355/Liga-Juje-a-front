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
        <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-emerald-500/30">
            <Navbar />

            {/* Se redujo pt-32 a pt-16 para subir la posición del formulario */}
            <div className="flex items-center justify-center p-4 pt-16">
                <div className="w-full max-w-md">

                    {sessionExpired && (
                        <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center gap-4 animate-pulse">
                            <FaExclamationTriangle className="text-amber-500 text-xl shrink-0" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-amber-200 leading-tight">
                                Vuelve a iniciar Sesión
                            </p>
                        </div>
                    )}

                    <div className="bg-[#1e293b] p-10 rounded-[2.5rem] shadow-2xl border border-slate-700/50 relative overflow-hidden">

                        <div className="text-center mb-10">
                            <div className="inline-flex p-4 bg-[#0f172a] rounded-2xl mb-4 border border-slate-700/50 text-emerald-500 shadow-inner">
                                <FaFutbol className="text-3xl" />
                            </div>
                            <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic leading-none">
                                Ligas <span className="text-emerald-500">Jujeñas</span>
                            </h1>
                            <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.4em] mt-3 opacity-60">
                                Terminal de Administración
                            </p>
                        </div>

                        {error && (
                            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-[10px] font-black uppercase tracking-widest text-center italic">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Correo Electrónico</label>
                                <div className="relative">
                                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        autoComplete="email"
                                        placeholder="correo@gmail.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full h-14 bg-[#0f172a] border border-slate-700/50 p-3 pl-12 rounded-xl focus:outline-none focus:border-emerald-500 transition-all text-sm text-white shadow-inner"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="password" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Clave de Acceso</label>
                                <div className="relative">
                                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full h-14 bg-[#0f172a] border border-slate-700/50 p-3 pl-12 rounded-xl focus:outline-none focus:border-emerald-500 transition-all text-sm text-white shadow-inner"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] transition-all shadow-xl shadow-emerald-900/20 active:scale-95 disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
                            </button>
                        </form>

                        <div className="mt-10 text-center border-t border-slate-700/30 pt-8">
                            <p className="text-slate-600 text-[10px] font-black uppercase italic tracking-[0.2em] opacity-40">
                                Gestión Deportiva v1 • Oficial
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}