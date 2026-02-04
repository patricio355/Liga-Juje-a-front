import { useState, useContext, useEffect } from "react";
import { createPortal } from "react-dom";
import { editarUsuario } from "../../api/usuarios.api";
import { AuthContext } from "../../context/AuthContext";
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaTimes, FaUserEdit } from "react-icons/fa";

export default function ModalEditarUsuario({ usuario, onClose, onUpdated }) {
    const { user: currentUser } = useContext(AuthContext);

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

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
    }, []);

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

    return createPortal(
        <div
            className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-[999999] p-2 md:p-6 italic"
            onClick={onClose}
        >
            <form
                className="bg-[#05070a] border border-white/10 rounded-[2.5rem] w-full max-w-xl shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden flex flex-col max-h-[95vh] relative animate-in fade-in zoom-in duration-200"
                onClick={(e) => e.stopPropagation()}
                onSubmit={guardar}
            >
                {/* Header Fijo */}
                <div className="bg-[#0a0c10] px-8 py-6 border-b border-white/5 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-black text-white tracking-tighter uppercase flex items-center gap-3">
                            <FaUserEdit className="text-slate-400" size={22} /> Editar Perfil
                        </h2>
                        {!activo && (
                            <span className="bg-red-900/20 text-red-500 text-[9px] font-black px-3 py-1 rounded-full border border-red-900/30 uppercase tracking-[0.2em] animate-pulse">
                                Inactivo
                            </span>
                        )}
                    </div>
                    <button type="button" onClick={onClose} className="text-slate-600 hover:text-white transition-colors p-2 bg-white/5 rounded-full">
                        <FaTimes size={18} />
                    </button>
                </div>

                {/* Body con Scroll Interno */}
                <div className="p-6 md:p-10 overflow-y-auto custom-scrollbar bg-[#05070a] flex-1">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 mb-6 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-6">

                        {/* SECCIÓN DE ESTADO */}
                        {puedeGestionarEstado && (
                            <div className="col-span-2 bg-black p-5 rounded-3xl border border-white/5 flex items-center justify-between mb-2 shadow-inner">
                                <div>
                                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Permisos de Acceso</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setActivo(!activo)}
                                    className={`relative flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[9px] uppercase tracking-[0.2em] transition-all duration-300 ${
                                        activo
                                            ? "bg-white/5 text-slate-300 border border-white/10 hover:bg-white hover:text-black"
                                            : "bg-red-900/10 text-red-500 border border-red-900/20"
                                    }`}
                                >
                                    {activo ? <FaCheckCircle /> : <FaTimesCircle />}
                                    {activo ? "Habilitado" : "Suspendido"}
                                </button>
                            </div>
                        )}

                        {!activo && puedeGestionarEstado && (
                            <div className="col-span-2 flex items-center gap-3 text-red-500/60 text-[9px] font-black uppercase tracking-[0.15em] px-2 mb-2">
                                <FaExclamationTriangle size={12} />
                                <span>La cuenta se encuentra actualmente bloqueada</span>
                            </div>
                        )}

                        <div className="col-span-2 space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nombre Completo</label>
                            <input
                                className="w-full px-6 py-4 bg-black border border-white/10 rounded-2xl outline-none focus:border-slate-400 text-sm font-black text-white italic uppercase placeholder:text-slate-900 transition-all"
                                value={nombre}
                                onChange={e => setNombre(e.target.value.toUpperCase())}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Oficial</label>
                            <input
                                className="w-full px-6 py-4 bg-black border border-white/10 rounded-2xl outline-none focus:border-slate-400 text-xs font-medium text-slate-300 lowercase transition-all"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Rango del Miembro</label>
                            <div className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-xs font-black text-slate-500 uppercase tracking-widest cursor-not-allowed">
                                {labelsRoles[rol] || rol}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Documento (DNI)</label>
                            <input
                                className="w-full px-6 py-4 bg-black border border-white/10 rounded-2xl outline-none focus:border-slate-400 text-xs font-black text-white italic transition-all"
                                value={dni}
                                onChange={e => setDni(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Teléfono</label>
                            <input
                                className="w-full px-6 py-4 bg-black border border-white/10 rounded-2xl outline-none focus:border-slate-400 text-xs font-medium text-slate-300 transition-all"
                                value={telefono}
                                onChange={e => setTelefono(e.target.value)}
                            />
                        </div>

                        <div className="col-span-2 space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Domicilio Declarado</label>
                            <input
                                className="w-full px-6 py-4 bg-black border border-white/10 rounded-2xl outline-none focus:border-slate-400 text-xs font-black text-white italic uppercase transition-all"
                                value={domicilio}
                                onChange={e => setDomicilio(e.target.value.toUpperCase())}
                            />
                        </div>
                    </div>
                </div>

                {/* Footer Fijo */}
                <div className="p-8 bg-[#0a0c10] border-t border-white/5 flex gap-4 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 border border-white/5 hover:bg-white/5 transition-all shadow-lg"
                        disabled={loading}
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-5 bg-gradient-to-r from-slate-200 to-slate-400 hover:from-white hover:to-slate-300 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-black transition-all shadow-[0_10px_30px_rgba(0,0,0,0.5)] active:scale-95 disabled:opacity-50"
                    >
                        {loading ? "ACTUALIZANDO..." : "GUARDAR CAMBIOS"}
                    </button>
                </div>
            </form>
        </div>,
        document.body
    );
}