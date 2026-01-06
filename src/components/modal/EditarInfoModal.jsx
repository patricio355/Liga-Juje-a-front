import { useState, useEffect } from "react";
import { FaTimes, FaClock, FaMapMarkerAlt, FaUserTie, FaCheckCircle, FaEdit, FaCalendarAlt } from "react-icons/fa";
import { apiFetch } from "../../api/api";

export default function EditarInfoModal({ open, partido, onClose, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [arbitros, setArbitros] = useState([]);
    const [canchasBack, setCanchasBack] = useState([]);

    // Estados para la hora (desplegable)
    const [horaH, setHoraH] = useState("17");
    const [horaM, setHoraM] = useState("00");

    const [formData, setFormData] = useState({
        cancha: "",
        hora: "",
        arbitro: "",
        fecha: "" // Nuevo campo para la fecha
    });

    // 1. Cargar Catálogos (Árbitros y Canchas)
    useEffect(() => {
        if (open) {
            apiFetch("/api/usuarios/arbitros")
                .then(data => setArbitros(data || []))
                .catch(err => console.error("Error árbitros:", err));

            apiFetch("/api/canchas")
                .then(data => setCanchasBack(data || []))
                .catch(err => console.error("Error canchas:", err));
        }
    }, [open]);

    // 2. Inicializar datos del partido seleccionado
    useEffect(() => {
        if (open && partido) {
            const h = partido.hora ? partido.hora.split(":")[0] : "17";
            const m = partido.hora ? partido.hora.split(":")[1] : "00";

            setHoraH(h);
            setHoraM(m);
            setFormData({
                cancha: partido.canchaNombre || partido.cancha || "",
                hora: `${h}:${m}`,
                arbitro: partido.arbitro || "",
                fecha: partido.fecha || "" // Se asume formato yyyy-MM-dd
            });
        }
    }, [open, partido]);

    if (!open) return null;

    const idFinal = partido.partidoId || partido.id;

    const guardarCambios = async () => {
        // Validaciones
        if (!formData.fecha) {
            alert("Por favor, selecciona una fecha.");
            return;
        }
        if (formData.cancha.trim().length < 4) {
            alert("El nombre de la cancha debe tener al menos 4 caracteres.");
            return;
        }

        const dataEnviar = {
            ...formData,
            hora: `${horaH}:${horaM}`
        };

        setLoading(true);
        try {
            await apiFetch(`/api/programacion/detalles/${idFinal}`, {
                method: "PUT",
                body: JSON.stringify(dataEnviar)
            });
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error al guardar:", error);
            alert("No se pudieron guardar los cambios.");
        } finally {
            setLoading(false);
        }
    };

    const horas = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
    const minutos = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];

    return (
        <div className="fixed inset-0 z-[300] bg-[#0f172a]/95 backdrop-blur-md flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-[#1e293b] w-full max-w-md rounded-[2.5rem] border border-slate-700/50 shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <div className="px-8 py-5 border-b border-slate-700/30 flex justify-between items-center bg-[#111827]/40">
                    <div className="flex items-center gap-3">
                        <FaEdit className="text-emerald-500" />
                        <h2 className="text-[11px] font-black uppercase italic tracking-widest text-white">Programación</h2>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors"><FaTimes /></button>
                </div>

                <div className="p-8 space-y-5">

                    {/* FECHA */}
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                            <FaCalendarAlt size={8}/> Fecha del Encuentro
                        </label>
                        <input
                            type="date"
                            value={formData.fecha}
                            onChange={e => setFormData({...formData, fecha: e.target.value})}
                            className="w-full h-12 bg-[#0f172a] border border-slate-700/50 px-4 rounded-xl text-sm text-white focus:border-emerald-500 outline-none transition-all [color-scheme:dark]"
                        />
                    </div>

                    {/* CANCHA */}
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                            <FaMapMarkerAlt size={8}/> Cancha / Predio
                        </label>
                        <input
                            list="lista-canchas"
                            value={formData.cancha}
                            onChange={e => setFormData({...formData, cancha: e.target.value})}
                            placeholder="Escribe o selecciona..."
                            className="w-full h-12 bg-[#0f172a] border border-slate-700/50 px-4 rounded-xl text-sm text-white focus:border-emerald-500 outline-none transition-all"
                        />
                        <datalist id="lista-canchas">
                            {canchasBack.map((c, idx) => (
                                <option key={c.id || idx} value={c.nombre} />
                            ))}
                        </datalist>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* HORA */}
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                                <FaClock size={8}/> Horario
                            </label>
                            <div className="flex gap-1">
                                <select
                                    value={horaH}
                                    onChange={e => setHoraH(e.target.value)}
                                    className="flex-1 h-12 bg-[#0f172a] border border-slate-700/50 rounded-xl text-sm text-white outline-none focus:border-emerald-500 px-2 cursor-pointer appearance-none text-center"
                                >
                                    {horas.map(h => <option key={h} value={h}>{h}</option>)}
                                </select>
                                <div className="flex items-center text-white font-bold">:</div>
                                <select
                                    value={horaM}
                                    onChange={e => setHoraM(e.target.value)}
                                    className="flex-1 h-12 bg-[#0f172a] border border-slate-700/50 rounded-xl text-sm text-white outline-none focus:border-emerald-500 px-2 cursor-pointer appearance-none text-center"
                                >
                                    {minutos.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* ÁRBITRO */}
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                                <FaUserTie size={8}/> Árbitro
                            </label>
                            <select
                                value={formData.arbitro}
                                onChange={e => setFormData({...formData, arbitro: e.target.value})}
                                className="w-full h-12 bg-[#0f172a] border border-slate-700/50 px-4 rounded-xl text-sm text-white focus:border-emerald-500 outline-none cursor-pointer"
                            >
                                <option value="">Sin asignar</option>
                                {arbitros.map((arb) => (
                                    <option key={arb.id} value={arb.nombre}>{arb.nombre}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={guardarCambios}
                        disabled={loading}
                        className={`w-full h-14 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 mt-4 ${
                            loading ? "bg-slate-700 text-slate-400" : "bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-900/20"
                        }`}
                    >
                        {loading ? "Actualizando..." : <><FaCheckCircle /> Guardar Cambios</>}
                    </button>
                </div>
            </div>
        </div>
    );
}