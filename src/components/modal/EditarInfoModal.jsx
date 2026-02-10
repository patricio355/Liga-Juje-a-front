import { useState, useEffect, useRef } from "react";
import {
    FaTimes, FaClock, FaMapMarkerAlt, FaUserTie,
    FaCheckCircle, FaEdit, FaCalendarAlt, FaChevronDown
} from "react-icons/fa";
import { apiFetch } from "../../api/api";

export default function EditarInfoModal({ open, partido, onClose, onSuccess }) {
    const horasArray = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
    const minutosArray = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];

    const [loading, setLoading] = useState(false);
    const [arbitros, setArbitros] = useState([]);
    const [canchasBack, setCanchasBack] = useState([]);

    const [showCanchas, setShowCanchas] = useState(false);
    const dropdownRef = useRef(null);

    const [horaH, setHoraH] = useState("17");
    const [horaM, setHoraM] = useState("00");

    const [formData, setFormData] = useState({
        cancha: "",
        hora: "",
        arbitro: "",
        fecha: ""
    });

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowCanchas(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (open) {
            apiFetch("/api/usuarios/arbitros").then(setArbitros).catch(console.error);
            apiFetch("/api/canchas").then(setCanchasBack).catch(console.error);
        }
    }, [open]);

    useEffect(() => {
        if (open && partido) {
            const h = partido.hora?.split(":")[0] || "17";
            const m = partido.hora?.split(":")[1] || "00";
            setHoraH(h);
            setHoraM(m);
            setFormData({
                cancha: partido.canchaNombre || partido.cancha || "",
                hora: `${h}:${m}`,
                arbitro: partido.arbitro || "",
                fecha: partido.fecha || ""
            });
        }
    }, [open, partido]);

    if (!open) return null;

    const guardarCambios = async (e) => {
        if (e) e.preventDefault();

        // Validación de longitud mínima para evitar crear canchas con nombres accidentales
        if (!formData.fecha || formData.cancha.trim().length < 3) {
            alert("Por favor completa la fecha y un nombre de cancha válido (mínimo 3 caracteres).");
            return;
        }

        setLoading(true);
        try {
            const idFinal = partido.partidoId || partido.id;
            await apiFetch(`/api/programacion/detalles/${idFinal}`, {
                method: "PUT",
                body: JSON.stringify({
                    ...formData,
                    cancha: formData.cancha.trim().toUpperCase(), // .trim() agregado para limpieza
                    hora: `${horaH}:${horaM}`
                })
            });
            onSuccess();
            onClose();
        } catch (error) {
            alert("Error: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const canchasFiltradas = canchasBack.filter(c =>
        c.nombre.toLowerCase().includes(formData.cancha.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-[600] bg-black/95 backdrop-blur-md flex items-center justify-center p-4" onClick={onClose}>
            <form
                className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] w-full max-w-lg shadow-[0_0_50px_-12px_rgba(255,255,255,0.1)] overflow-hidden animate-in fade-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
                onSubmit={guardarCambios}
            >
                {/* Header */}
                <div className="bg-[#111] px-10 py-8 border-b border-white/5 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3 uppercase">
                            <FaEdit className="text-white" size={20} /> Programación
                        </h2>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1.5">Ajustes de logística</p>
                    </div>
                    <button onClick={onClose} type="button" className="p-3 bg-black rounded-2xl text-slate-500 hover:text-white border border-white/10 transition-all hover:bg-[#1a1a1a]">
                        <FaTimes size={20} />
                    </button>
                </div>

                <div className="p-10 space-y-7">
                    {/* FECHA */}
                    <div className="space-y-2.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 ml-1">
                            <FaCalendarAlt className="text-white"/> Fecha del Encuentro
                        </label>
                        <input
                            type="date"
                            value={formData.fecha}
                            onChange={e => setFormData({...formData, fecha: e.target.value})}
                            className="w-full h-14 bg-black border border-white/10 px-6 rounded-2xl text-sm font-bold text-white focus:border-white/30 outline-none [color-scheme:dark] transition-all"
                        />
                    </div>

                    {/* CANCHA DROPDOWN */}
                    <div className="space-y-2.5 relative" ref={dropdownRef}>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 ml-1">
                            <FaMapMarkerAlt className="text-white"/> Cancha / Predio
                        </label>

                        <div className="relative">
                            <input
                                type="text"
                                value={formData.cancha}
                                onChange={(e) => {
                                    setFormData({...formData, cancha: e.target.value});
                                    setShowCanchas(true);
                                }}
                                onClick={() => setShowCanchas(true)}
                                placeholder="BUSCAR O ESCRIBIR..."
                                className="w-full h-14 bg-black border border-white/10 px-6 pr-12 rounded-2xl text-sm font-bold text-white focus:border-white/30 outline-none transition-all uppercase placeholder:text-slate-800"
                            />
                            <FaChevronDown className={`absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 transition-transform ${showCanchas ? 'rotate-180' : ''}`} />
                        </div>

                        {showCanchas && (
                            <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-[#111] border border-white/10 rounded-2xl shadow-2xl z-[500] max-h-48 overflow-y-auto custom-scrollbar overflow-hidden">
                                {canchasFiltradas.length > 0 ? (
                                    canchasFiltradas.map((c) => (
                                        <button
                                            key={c.id}
                                            type="button"
                                            onClick={() => {
                                                setFormData({...formData, cancha: c.nombre});
                                                setShowCanchas(false);
                                            }}
                                            className="w-full text-left px-6 py-4 text-[11px] font-black text-slate-400 hover:bg-white hover:text-black border-b border-white/5 last:border-0 transition-all uppercase"
                                        >
                                            {c.nombre}
                                        </button>
                                    ))
                                ) : (
                                    <div className="px-6 py-4 text-[9px] font-black text-slate-600 uppercase">
                                        No registrado. Se guardará como nuevo.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* HORA */}
                        <div className="space-y-2.5">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 ml-1">
                                <FaClock className="text-white"/> Horario
                            </label>
                            <div className="flex gap-2 items-center bg-black border border-white/10 p-2 rounded-2xl">
                                <select
                                    value={horaH}
                                    onChange={e => setHoraH(e.target.value)}
                                    className="flex-1 h-10 bg-transparent text-sm font-black text-white outline-none text-center appearance-none cursor-pointer"
                                >
                                    {horasArray.map(h => <option key={h} value={h} className="bg-black text-white">{h}</option>)}
                                </select>
                                <span className="text-white/30 font-black">:</span>
                                <select
                                    value={horaM}
                                    onChange={e => setHoraM(e.target.value)}
                                    className="flex-1 h-10 bg-transparent text-sm font-black text-white outline-none text-center appearance-none cursor-pointer"
                                >
                                    {minutosArray.map(m => <option key={m} value={m} className="bg-black text-white">{m}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* ÁRBITRO */}
                        <div className="space-y-2.5">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 ml-1">
                                <FaUserTie className="text-white"/> Referí
                            </label>
                            <select
                                value={formData.arbitro}
                                onChange={e => setFormData({...formData, arbitro: e.target.value})}
                                className="w-full h-14 bg-black border border-white/10 px-4 rounded-2xl text-[11px] font-black text-white focus:border-white/30 outline-none appearance-none cursor-pointer uppercase"
                            >
                                <option value="" className="bg-black text-white">SIN ASIGNAR</option>
                                {arbitros.map(arb => (
                                    <option key={arb.id} value={arb.nombre} className="bg-black text-white">{arb.nombre.toUpperCase()}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* BOTONES ACCIÓN */}
                    <div className="flex gap-4 pt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-5 rounded-[1.5rem] text-[11px] font-black uppercase text-slate-500 border border-white/5 hover:bg-white/5 hover:text-white transition-all active:scale-95"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[1.8] py-5 bg-white hover:bg-slate-200 rounded-[1.5rem] text-[11px] font-black uppercase text-black transition-all shadow-[0_10px_30px_-10px_rgba(255,255,255,0.3)] active:scale-95 disabled:opacity-20 flex items-center justify-center gap-2"
                        >
                            {loading ? <span className="animate-pulse">Sincronizando...</span> : <><FaCheckCircle size={16}/> Confirmar Cambios</>}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}