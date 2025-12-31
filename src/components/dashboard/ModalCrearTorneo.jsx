import { useContext, useState } from "react";
import { apiFetch } from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import { FaTrophy, FaUserAlt, FaCheckCircle, FaTimes, FaQuestionCircle } from "react-icons/fa";

export default function ModalCrearTorneo({ onClose, onCreated }) {
    const { user } = useContext(AuthContext);
    const esAdmin = user?.role === "ROLE_ADMIN";

    const [nombre, setNombre] = useState("");
    const [division, setDivision] = useState("A");
    const [encargadoEmail, setEncargadoEmail] = useState("");
    const [estado, setEstado] = useState("activo");
    const [tipo, setTipo] = useState("CERRADO");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const crearTorneo = async () => {
        if (!nombre.trim()) {
            setError("El nombre es obligatorio");
            return;
        }
        setLoading(true);
        setError(null);

        try {
            const payload = { nombre, division, estado, tipo };
            if (esAdmin) payload.encargadoEmail = encargadoEmail;

            await apiFetch("/api/torneos", {
                method: "POST",
                body: JSON.stringify(payload),
            });

            onCreated();
            onClose();
        } catch (e) {
            setError(e.message || "Error al crear torneo");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-[#0f172a]/90 backdrop-blur-sm flex items-center justify-center z-[200] p-4" onClick={onClose}>
            <div
                className="bg-[#1e293b] w-full max-w-md rounded-[2rem] border border-slate-700/50 shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-[#111827]/50 px-8 py-5 border-b border-slate-700/50 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <FaTrophy className="text-emerald-500" />
                        <h2 className="text-xs font-black uppercase italic tracking-widest text-white leading-none">Crear Torneo</h2>
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
                        {/* Nombre */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nombre</label>
                            <input
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                placeholder="Ej: Torneo Apertura 2024"
                                className="w-full h-12 bg-[#0f172a] border border-slate-700/50 px-4 rounded-xl focus:border-emerald-500 text-sm text-slate-200 outline-none transition-all placeholder:text-slate-700"
                            />
                        </div>

                        {/* Fila Dual: División y Modalidad */}
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
                                <div className="flex items-center gap-2 ml-1">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Modalidad</label>
                                    <div className="group relative">
                                        <FaQuestionCircle className="text-slate-600 hover:text-emerald-500 cursor-help transition-colors" size={12} />
                                        <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-56 p-4 bg-[#0f172a] border border-slate-700 rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50 transform scale-95 group-hover:scale-100">
                                            <p className="text-[9px] leading-relaxed text-slate-300 uppercase font-black tracking-tight">
                                                <span className="text-emerald-500">ABIERTO:</span> Podrás agregar equipos con el torneo inciado, tambien controlarás el fixture manual (Ideal para torneos barriales). <br/><br/>
                                                <span className="text-amber-500">CERRADO:</span> No recibe equipos una vez iniciado el torneo, el fixture se genera automaticamente al confirmar todos los equipos (Ideal para torneos profesionales).
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <select
                                    value={tipo}
                                    onChange={(e) => setTipo(e.target.value)}
                                    className="w-full h-12 bg-[#0f172a] border border-slate-700/50 px-4 rounded-xl text-sm text-slate-200 outline-none focus:border-emerald-500 appearance-none cursor-pointer"
                                >
                                    <option value="ABIERTO">Abierto</option>
                                    <option value="CERRADO">Cerrado</option>
                                </select>
                            </div>
                        </div>

                        {/* Estado Inicial */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Estado Inicial</label>
                            <select
                                value={estado}
                                onChange={(e) => setEstado(e.target.value)}
                                className="w-full h-12 bg-[#0f172a] border border-slate-700/50 px-4 rounded-xl text-sm text-slate-200 outline-none appearance-none focus:border-emerald-500 cursor-pointer"
                            >
                                <option value="activo">Publicado (Activo)</option>
                                <option value="inactivo">Borrador (Inactivo)</option>
                            </select>
                        </div>

                        {/* Responsable */}
                        {esAdmin && (
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <FaUserAlt size={10} className="text-emerald-500" /> Email Responsable
                                </label>
                                <input
                                    value={encargadoEmail}
                                    onChange={(e) => setEncargadoEmail(e.target.value)}
                                    placeholder="ejemplo@liga.com"
                                    className="w-full h-12 bg-[#0f172a] border border-slate-700/50 px-4 rounded-xl text-sm text-slate-200 outline-none focus:border-emerald-500"
                                />
                            </div>
                        )}
                    </div>

                    {/* Botones */}
                    <div className="flex gap-4 pt-4">
                        <button
                            className="flex-1 h-12 bg-[#0f172a] text-slate-500 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:text-white transition-all border border-slate-700/50"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                        <button
                            className="flex-1 h-12 bg-emerald-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2"
                            onClick={crearTorneo}
                            disabled={loading}
                        >
                            {loading ? "..." : <><FaCheckCircle size={14} /> Guardar Torneo</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}