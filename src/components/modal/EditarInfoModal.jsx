import { useState, useEffect } from "react";
import { FaTimes, FaClock, FaMapMarkerAlt, FaUserTie, FaCheckCircle, FaEdit } from "react-icons/fa";
import { apiFetch } from "../../api/api";

export default function EditarInfoModal({ open, partido, onClose, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [arbitros, setArbitros] = useState([]);
    const [formData, setFormData] = useState({ cancha: "", hora: "", arbitro: "" });

    useEffect(() => {
        if (open) {
            apiFetch("/api/usuarios/arbitros")
                .then(data => setArbitros(data || []))
                .catch(err => console.error("Error al cargar árbitros:", err));
        }
    }, [open]);

    useEffect(() => {
        if (open && partido && arbitros.length > 0) {
            setFormData({
                cancha: partido.cancha || "",
                hora: partido.hora || "",
                arbitro: partido.arbitro || ""
            });
        }
    }, [open, partido, arbitros]);

    if (!open) return null;

    const guardarCambios = async () => {
        if (!formData.hora || !formData.cancha) {
            alert("Por favor, completa la cancha y el horario.");
            return;
        }

        setLoading(true);
        try {
            // Actualización en el backend
            await apiFetch(`/api/programacion/detalles/${partido.partidoId}`, {
                method: "PUT",
                body: JSON.stringify(formData)
            });

            // 1. Notificar al padre para recargar datos
            onSuccess();

            // 2. CERRAR EL MODAL
            onClose();

        } catch (error) {
            console.error("Error al guardar:", error);
            alert("No se pudieron guardar los cambios. Intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[300] bg-[#0f172a]/95 backdrop-blur-md flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-[#1e293b] w-full max-w-md rounded-[3rem] border border-slate-700/50 shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-700/30 flex justify-between items-center bg-[#111827]/40">
                    <div className="flex items-center gap-3">
                        <FaEdit className="text-blue-500" />
                        <h2 className="text-[11px] font-black uppercase italic tracking-widest text-white">Programación de Partido</h2>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                        <FaTimes />
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                                <FaMapMarkerAlt size={8}/> Cancha / Predio
                            </label>
                            <input
                                value={formData.cancha}
                                onChange={e => setFormData({...formData, cancha: e.target.value})}
                                className="w-full h-12 bg-[#0f172a] border border-slate-700/50 px-4 rounded-2xl text-sm text-white focus:border-blue-500 outline-none transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                                    <FaClock size={8}/> Horario
                                </label>
                                <input
                                    type="time"
                                    value={formData.hora}
                                    onChange={e => setFormData({...formData, hora: e.target.value})}
                                    className="w-full h-12 bg-[#0f172a] border border-slate-700/50 px-4 rounded-2xl text-sm text-white focus:border-blue-500 outline-none"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                                    <FaUserTie size={8}/> Árbitro
                                </label>
                                <select
                                    value={formData.arbitro}
                                    onChange={e => setFormData({...formData, arbitro: e.target.value})}
                                    className="w-full h-12 bg-[#0f172a] border border-slate-700/50 px-4 rounded-2xl text-sm text-white focus:border-blue-500 outline-none cursor-pointer appearance-none"
                                >
                                    <option value="">Sin asignar</option>
                                    {arbitros.map((arb) => (
                                        <option key={arb.id} value={arb.nombre}>
                                            {arb.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={guardarCambios}
                        disabled={loading}
                        className={`w-full h-14 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-3 ${
                            loading ? "bg-slate-700 text-slate-400" : "bg-blue-600 text-white hover:bg-blue-500 shadow-blue-900/20"
                        }`}
                    >
                        {loading ? "Actualizando..." : <><FaCheckCircle /> Guardar Cambios</>}
                    </button>
                </div>
            </div>
        </div>
    );
}