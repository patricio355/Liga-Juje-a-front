import { useState, useContext } from "react";
import { editarUsuario } from "../../api/usuarios.api";
import { AuthContext } from "../../context/AuthContext";
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from "react-icons/fa";

export default function ModalEditarUsuario({ usuario, onClose, onUpdated }) {
    const { user: currentUser } = useContext(AuthContext);

    // 1. Expandimos el permiso para incluir al Encargado de Torneo
    const userRole = currentUser?.role?.toUpperCase().trim().replace("ROLE_", "") || "";
    const puedeGestionarEstado = userRole === "ADMIN" || userRole === "ENCARGADOTORNEO";

    const [nombre, setNombre] = useState(usuario.nombre || "");
    const [email, setEmail] = useState(usuario.email || "");
    const [rol] = useState(usuario.rol || "");
    const [dni, setDni] = useState(usuario.dni || "");
    const [telefono, setTelefono] = useState(usuario.telefono || "");
    const [domicilio, setDomicilio] = useState(usuario.domicilio || "");
    const [activo, setActivo] = useState(usuario.activo ?? true);

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const labelsRoles = {
        ADMIN: "Administrador",
        ENCARGADOTORNEO: "Encargado de Torneo",
        ENCARGADOEQUIPO: "Encargado de Equipo",
        ARBITRO: "Árbitro",
        VEEDOR: "Veedor"
    };

    const validar = () => {
        if (!nombre.trim()) return "El nombre no puede estar vacío";
        if (!email.trim()) return "El email no puede estar vacío";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return "Formato de email inválido";
        return null;
    };

    const guardar = async (e) => {
        if(e) e.preventDefault();
        setError(null);

        const errorValidacion = validar();
        if (errorValidacion) {
            setError(errorValidacion);
            return;
        }

        setLoading(true);

        try {
            await editarUsuario(usuario.id, {
                nombre: nombre.trim(),
                email: email.trim(),
                rol,
                dni: dni.trim() || null,
                telefono: telefono.trim() || null,
                domicilio: domicilio.trim() || null,
                activo: activo
            });

            onUpdated();
            onClose();

        } catch (e) {
            setError(e.message || "Error al editar usuario");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-[#040714]/95 backdrop-blur-md flex items-center justify-center z-[100] p-4" onClick={onClose}>
            <form
                className="bg-[#0a0f2c] border border-cyan-400/30 rounded-[2rem] w-full max-w-lg shadow-[0_0_60px_-15px_rgba(6,182,212,0.4)] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                onSubmit={guardar}
            >
                {/* HEADER */}
                <div className="bg-gradient-to-r from-[#0d143d] to-[#05091e] px-8 py-6 border-b border-cyan-400/10 flex justify-between items-center">
                    <p className="text-2xl font-bold text-white tracking-tighter">
                        Editar Perfil <span className="text-cyan-500">.</span>
                    </p>

                    {!activo && (
                        <span className="bg-red-500/20 text-red-500 text-[10px] font-black px-3 py-1 rounded-full border border-red-500/30 uppercase tracking-tighter animate-pulse">
                            Acceso Revocado
                        </span>
                    )}
                </div>

                <div className="p-8">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 mb-6 rounded-xl text-sm font-semibold text-center italic">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-5">

                        {/* SECCIÓN DE ESTADO: Ahora visible para Admin y Encargado */}
                        {puedeGestionarEstado && (
                            <div className="col-span-2 bg-[#040714] p-4 rounded-2xl border border-slate-800 flex items-center justify-between mb-2">
                                <div>
                                    <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Estado de Cuenta</p>
                                    <p className="text-[10px] text-slate-400">Determina si el usuario puede iniciar sesión</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setActivo(!activo)}
                                    className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                                        activo
                                            ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                                            : "bg-red-500/10 text-red-500 border border-red-500/30"
                                    }`}
                                >
                                    {activo ? <FaCheckCircle /> : <FaTimesCircle />}
                                    {activo ? "Habilitado" : "Suspendido"}
                                </button>
                            </div>
                        )}

                        {/* AVISO DE CAMBIO DE ROL (Opcional pero recomendado) */}
                        {!activo && puedeGestionarEstado && (
                            <div className="col-span-2 flex items-center gap-2 text-amber-500/80 text-[9px] font-bold uppercase tracking-widest px-1">
                                <FaExclamationTriangle />
                                <span>Al activar, el usuario recuperará sus credenciales de acceso</span>
                            </div>
                        )}

                        <div className="col-span-2 space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Nombre Completo</label>
                            <input
                                className="w-full px-5 py-3.5 bg-[#040714] border border-slate-800 rounded-xl outline-none focus:border-cyan-400 text-base text-white transition-all shadow-inner"
                                value={nombre}
                                onChange={e => setNombre(e.target.value)}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email</label>
                            <input
                                className="w-full px-5 py-3.5 bg-[#040714] border border-slate-800 rounded-xl outline-none focus:border-cyan-400 text-base text-white transition-all shadow-inner"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Rango Actual</label>
                            <div className="w-full px-5 py-3.5 bg-[#1a1f3d]/30 border border-slate-800/50 rounded-xl text-base font-bold text-cyan-400/60 cursor-not-allowed italic">
                                {labelsRoles[rol] || rol}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">DNI (Opcional)</label>
                            <input
                                className="w-full px-5 py-3.5 bg-[#040714] border border-slate-800 rounded-xl outline-none focus:border-cyan-400 text-base text-white transition-all shadow-inner"
                                value={dni}
                                onChange={e => setDni(e.target.value)}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Teléfono</label>
                            <input
                                className="w-full px-5 py-3.5 bg-[#040714] border border-slate-800 rounded-xl outline-none focus:border-cyan-400 text-base text-white transition-all shadow-inner"
                                value={telefono}
                                onChange={e => setTelefono(e.target.value)}
                            />
                        </div>

                        <div className="col-span-2 space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Domicilio</label>
                            <input
                                className="w-full px-5 py-3.5 bg-[#040714] border border-slate-800 rounded-xl outline-none focus:border-cyan-400 text-base text-white transition-all shadow-inner"
                                value={domicilio}
                                onChange={e => setDomicilio(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 mt-10">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 px-6 rounded-xl text-sm font-bold uppercase tracking-widest text-slate-500 border border-slate-800 hover:bg-slate-800/50 hover:text-white transition-all"
                            disabled={loading}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-4 px-6 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-sm font-bold uppercase tracking-widest text-white transition-all shadow-lg active:scale-95"
                        >
                            {loading ? "PROCESANDO..." : "GUARDAR CAMBIOS"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}