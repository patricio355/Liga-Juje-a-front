import { useState } from "react";
import { apiFetch } from "../../api/api";
import { FaShieldAlt, FaMapMarkerAlt, FaEnvelope, FaCheckCircle, FaTimes, FaToggleOn } from "react-icons/fa";

export default function ModalEquipoEditar({ equipo, onClose, onUpdated }) {
    // 1. PRIMERO declaramos todos los Hooks (siempre al inicio del componente)
    // Usamos encadenamiento opcional (?.) para evitar errores si equipo es null inicialmente
    const [nombre, setNombre] = useState(equipo?.nombre || "");
    const [localidad, setLocalidad] = useState(equipo?.localidad || "");
    const [escudo, setEscudo] = useState(equipo?.escudo || "");
    const [estado, setEstado] = useState(equipo?.estado ?? true);
    const [encargadoEmail, setEncargadoEmail] = useState(equipo?.encargadoEmail || "");

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // 2. DESPUÉS de los hooks, colocamos la validación de salida
    if (!equipo) return null;

    const guardar = async () => {
        setLoading(true);
        setError(null);
        try {
            await apiFetch(`/api/equipos/${equipo.id}`, {
                method: "PUT",
                body: JSON.stringify({
                    nombre,
                    localidad,
                    escudo,
                    estado,
                    encargadoEmail: encargadoEmail.trim() || null
                })
            });
            onUpdated();
            onClose();
        } catch (e) {
            setError(e.message || "Error al editar equipo");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-[#0f172a]/90 backdrop-blur-sm flex items-center justify-center z-[300] p-4" onClick={onClose}>
            <div
                className="bg-[#1e293b] w-full max-w-md rounded-[2.5rem] border border-slate-700/50 shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-[#111827]/50 px-8 py-6 border-b border-slate-700/50 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                            <FaShieldAlt />
                        </div>
                        <h2 className="text-xs font-black uppercase italic tracking-widest text-white leading-none">Editar Equipo</h2>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                        <FaTimes size={18} />
                    </button>
                </div>

                <div className="p-8 space-y-5">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-[10px] font-bold uppercase text-center">
                            {error}
                        </div>
                    )}

                    {/* Formulario */}
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Nombre Oficial</label>
                        <input
                            value={nombre}
                            onChange={e => setNombre(e.target.value)}
                            className="w-full h-12 bg-[#0f172a] border border-slate-700/50 px-4 rounded-xl text-sm text-white focus:border-emerald-500 outline-none transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                                <FaMapMarkerAlt size={8}/> Localidad
                            </label>
                            <input
                                value={localidad}
                                onChange={e => setLocalidad(e.target.value)}
                                className="w-full h-12 bg-[#0f172a] border border-slate-700/50 px-4 rounded-xl text-sm text-white focus:border-emerald-500 outline-none"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                                <FaToggleOn size={8}/> Estado
                            </label>
                            <select
                                value={estado ? "true" : "false"}
                                onChange={e => setEstado(e.target.value === "true")}
                                className="w-full h-12 bg-[#0f172a] border border-slate-700/50 px-4 rounded-xl text-sm text-white focus:border-emerald-500 outline-none appearance-none"
                            >
                                <option value="true">Activo</option>
                                <option value="false">Inactivo</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 text-emerald-500/80">URL del Escudo</label>
                        <input
                            value={escudo}
                            onChange={e => setEscudo(e.target.value)}
                            className="w-full h-12 bg-[#0f172a] border border-slate-700/50 px-4 rounded-xl text-sm text-white focus:border-emerald-500 outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                            <FaEnvelope size={8}/> Email Responsable
                        </label>
                        <input
                            value={encargadoEmail}
                            onChange={e => setEncargadoEmail(e.target.value)}
                            className="w-full h-12 bg-[#0f172a] border border-slate-700/50 px-4 rounded-xl text-sm text-white focus:border-emerald-500 outline-none"
                            placeholder="responsable@equipo.com"
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            className="flex-1 h-12 bg-[#0f172a] text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all border border-slate-700/50"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                        <button
                            className="flex-[1.5] h-12 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            onClick={guardar}
                            disabled={loading}
                        >
                            {loading ? "..." : <><FaCheckCircle size={14} /> Actualizar</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}