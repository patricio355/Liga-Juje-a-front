import { useState, useEffect, useContext } from "react";
import { apiFetch } from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import { FaTrophy, FaUserAlt, FaCheckCircle, FaTimes, FaLock } from "react-icons/fa";

export default function ModalEditarTorneo({ torneo, onClose, onSuccess }) {
    const { user } = useContext(AuthContext);
    const esAdmin = user?.role === "ROLE_ADMIN";

    const [nombre, setNombre] = useState("");
    const [division, setDivision] = useState("A");
    const [encargadoEmail, setEncargadoEmail] = useState("");
    const [estado, setEstado] = useState("activo");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (torneo) {
            setNombre(torneo.nombre || "");
            setDivision(torneo.division || "A");
            setEncargadoEmail(torneo.encargadoEmail || "");
            setEstado(torneo.estado?.toLowerCase() || "activo");
        }
    }, [torneo]);

    const actualizarTorneo = async () => {
        if (!nombre.trim()) {
            setError("El nombre es obligatorio");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const payload = {
                nombre,
                division,
                estado,
                // NO enviamos el "tipo" en el payload para evitar cambios accidentales
            };

            if (esAdmin) payload.encargadoEmail = encargadoEmail;

            await apiFetch(`/api/torneos/${torneo.id}`, {
                method: "PUT",
                body: JSON.stringify(payload),
            });

            if (onSuccess) onSuccess();
            onClose();

        } catch (e) {
            setError(e.message || "Error al actualizar torneo");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-[#0f172a]/90 backdrop-blur-sm flex items-center justify-center z-[200] p-4" onClick={onClose}>
            <div
                className="bg-[#1e293b] w-full max-w-md rounded-[2.5rem] border border-slate-700/50 shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-[#111827]/50 px-8 py-6 border-b border-slate-700/50 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 rounded-lg">
                            <FaTrophy className="text-emerald-500" />
                        </div>
                        <h2 className="text-xs font-black uppercase italic tracking-widest text-white leading-none">Configurar Torneo</h2>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                        <FaTimes size={18} />
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-[10px] font-bold uppercase text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-5">
                        {/* Modalidad Bloqueada (Informativo) */}
                        <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-700/30 flex items-center justify-between">
                            <div>
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Modalidad Actual</p>
                                <p className="text-xs font-bold text-emerald-400 uppercase italic tracking-widest">
                                    {torneo?.tipo || "CERRADO"}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600 bg-slate-800/50 px-3 py-1 rounded-full">
                                <FaLock size={10} />
                                <span className="text-[9px] font-bold uppercase">No editable</span>
                            </div>
                        </div>

                        {/* Nombre */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 text-emerald-500/80">Nombre del Torneo</label>
                            <input
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                className="w-full h-12 bg-[#0f172a] border border-slate-700/50 px-4 rounded-xl focus:border-emerald-500 text-sm text-slate-200 outline-none transition-all shadow-inner"
                            />
                        </div>

                        {/* Fila Dual: División y Estado */}
                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">División</label>
                                <select
                                    value={division}
                                    onChange={(e) => setDivision(e.target.value)}
                                    className="w-full h-12 bg-[#0f172a] border border-slate-700/50 px-4 rounded-xl text-sm text-slate-200 outline-none appearance-none focus:border-emerald-500 cursor-pointer"
                                >
                                    {["A", "B", "C", "D", "E"].map(d => <option key={d} value={d}>División {d}</option>)}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Estado</label>
                                <select
                                    value={estado}
                                    onChange={(e) => setEstado(e.target.value)}
                                    className="w-full h-12 bg-[#0f172a] border border-slate-700/50 px-4 rounded-xl text-sm text-slate-200 outline-none appearance-none focus:border-emerald-500 cursor-pointer"
                                >
                                    <option value="activo">Activo</option>
                                    <option value="inactivo">Inactivo</option>
                                </select>
                            </div>
                        </div>

                        {/* Responsable (Solo Admin) */}
                        {esAdmin && (
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <FaUserAlt size={10} className="text-emerald-500" /> Email del Responsable
                                </label>
                                <input
                                    value={encargadoEmail}
                                    onChange={(e) => setEncargadoEmail(e.target.value)}
                                    placeholder="admin@torneo.com"
                                    className="w-full h-12 bg-[#0f172a] border border-slate-700/50 px-4 rounded-xl text-sm text-slate-200 outline-none focus:border-emerald-500 transition-all"
                                />
                            </div>
                        )}
                    </div>

                    {/* Botones */}
                    <div className="flex gap-4 pt-4">
                        <button
                            className="flex-1 h-12 bg-[#0f172a] text-slate-500 rounded-2xl text-[11px] font-black uppercase hover:text-white transition-all border border-slate-700/50 shadow-lg"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                        <button
                            className="flex-[1.5] h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-emerald-900/20 flex items-center justify-center gap-2"
                            onClick={actualizarTorneo}
                            disabled={loading}
                        >
                            {loading ? <span className="animate-pulse">Guardando...</span> : <><FaCheckCircle size={14} /> Aplicar Cambios</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}