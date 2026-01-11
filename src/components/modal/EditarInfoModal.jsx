import { useState, useEffect, useRef } from "react";
import {
    FaTimes, FaClock, FaMapMarkerAlt, FaUserTie,
    FaCheckCircle, FaEdit, FaCalendarAlt, FaChevronDown
} from "react-icons/fa";
import { apiFetch } from "../../api/api";

export default function EditarInfoModal({ open, partido, onClose, onSuccess }) {
    // Definimos las constantes de tiempo fuera de las funciones para que siempre estén disponibles
    const horasArray = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
    const minutosArray = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];

    const [loading, setLoading] = useState(false);
    const [arbitros, setArbitros] = useState([]);
    const [canchasBack, setCanchasBack] = useState([]);

    // Estados para el Dropdown personalizado de Canchas
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

    // Cerrar el dropdown de canchas al hacer clic afuera
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowCanchas(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Cargar catálogos iniciales
    useEffect(() => {
        if (open) {
            apiFetch("/api/usuarios/arbitros").then(setArbitros).catch(console.error);
            apiFetch("/api/canchas").then(setCanchasBack).catch(console.error);
        }
    }, [open]);

    // Cargar datos del partido al abrir
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
        if (!formData.fecha || formData.cancha.trim().length < 3) {
            alert("Por favor completa la fecha y una cancha válida.");
            return;
        }

        setLoading(true);
        try {
            const idFinal = partido.partidoId || partido.id;
            await apiFetch(`/api/programacion/detalles/${idFinal}`, {
                method: "PUT",
                body: JSON.stringify({
                    ...formData,
                    cancha: formData.cancha.toUpperCase(),
                    hora: `${horaH}:${horaM}`
                })
            });
            onSuccess();
            onClose();
        } catch (error) {
            alert("No se pudieron guardar los cambios.");
        } finally {
            setLoading(false);
        }
    };

    // Filtrar canchas según escritura
    const canchasFiltradas = canchasBack.filter(c =>
        c.nombre.toLowerCase().includes(formData.cancha.toLowerCase())
    );

    return (
        /* CAMBIO ÚNICO: Se subió el z-index de 400 a 600 para que pise al modal de cierre */
        <div className="fixed inset-0 z-[600] bg-[#040714]/95 backdrop-blur-md flex items-center justify-center p-4" onClick={onClose}>
            <form
                className="bg-[#0a0f2c] border border-cyan-500/30 rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
                onSubmit={guardarCambios}
            >
                {/* Header */}
                <div className="bg-[#0d143d] px-10 py-8 border-b border-slate-800 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                            <FaEdit className="text-cyan-500" size={24} /> Programación
                        </h2>
                        <p className="text-[10px] font-bold text-cyan-500 uppercase tracking-[0.2em] mt-1">Lugar, Día y Horario</p>
                    </div>
                    <button onClick={onClose} type="button" className="p-3 bg-[#040714] rounded-2xl text-slate-500 hover:text-white border border-slate-800 transition-all">
                        <FaTimes size={20} />
                    </button>
                </div>

                <div className="p-10 space-y-6">
                    {/* FECHA */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <FaCalendarAlt className="text-cyan-500"/> Fecha del Encuentro
                        </label>
                        <input
                            type="date"
                            value={formData.fecha}
                            onChange={e => setFormData({...formData, fecha: e.target.value})}
                            className="w-full h-14 bg-[#040714] border border-slate-800 px-6 rounded-2xl text-sm font-bold text-white focus:border-cyan-500 outline-none [color-scheme:dark]"
                        />
                    </div>

                    {/* CANCHA DROPDOWN PERSONALIZADO */}
                    <div className="space-y-2 relative" ref={dropdownRef}>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <FaMapMarkerAlt className="text-cyan-500"/> Cancha / Predio
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
                                placeholder="BUSCAR O ESCRIBIR NOMBRE..."
                                className="w-full h-14 bg-[#040714] border border-slate-800 px-6 pr-12 rounded-2xl text-sm font-bold text-white focus:border-cyan-500 outline-none transition-all uppercase placeholder:text-slate-800"
                            />
                            <FaChevronDown className={`absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 transition-transform ${showCanchas ? 'rotate-180' : ''}`} />
                        </div>

                        {showCanchas && (
                            <div className="absolute top-[calc(100%+5px)] left-0 w-full bg-[#0d143d] border border-slate-800 rounded-2xl shadow-2xl z-[500] max-h-48 overflow-y-auto custom-scrollbar">
                                {canchasFiltradas.length > 0 ? (
                                    canchasFiltradas.map((c) => (
                                        <button
                                            key={c.id}
                                            type="button"
                                            onClick={() => {
                                                setFormData({...formData, cancha: c.nombre});
                                                setShowCanchas(false);
                                            }}
                                            className="w-full text-left px-6 py-4 text-[11px] font-black text-slate-300 hover:bg-cyan-600 hover:text-white border-b border-slate-800/50 last:border-0 transition-colors uppercase italic"
                                        >
                                            {c.nombre}
                                        </button>
                                    ))
                                ) : (
                                    <div className="px-6 py-4 text-[9px] font-black text-cyan-500/50 uppercase italic">
                                        No existe en la lista. Se guardará como nueva.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* HORA */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <FaClock className="text-cyan-500"/> Horario
                            </label>
                            <div className="flex gap-2 items-center bg-[#040714] border border-slate-800 p-1.5 rounded-2xl">
                                <select
                                    value={horaH}
                                    onChange={e => setHoraH(e.target.value)}
                                    className="flex-1 h-10 bg-transparent text-sm font-black text-white outline-none text-center appearance-none cursor-pointer"
                                >
                                    {horasArray.map(h => <option key={h} value={h} className="bg-[#0a0f2c]">{h}</option>)}
                                </select>
                                <span className="text-cyan-500 font-bold">:</span>
                                <select
                                    value={horaM}
                                    onChange={e => setHoraM(e.target.value)}
                                    className="flex-1 h-10 bg-transparent text-sm font-black text-white outline-none text-center appearance-none cursor-pointer"
                                >
                                    {minutosArray.map(m => <option key={m} value={m} className="bg-[#0a0f2c]">{m}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* ÁRBITRO */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <FaUserTie className="text-cyan-500"/> Árbitro Principal
                            </label>
                            <select
                                value={formData.arbitro}
                                onChange={e => setFormData({...formData, arbitro: e.target.value})}
                                className="w-full h-13 bg-[#040714] border border-slate-800 px-4 rounded-2xl text-[11px] font-bold text-white focus:border-cyan-500 outline-none appearance-none cursor-pointer"
                            >
                                <option value="" className="bg-[#0a0f2c]">SIN ASIGNAR</option>
                                {arbitros.map(arb => (
                                    <option key={arb.id} value={arb.nombre} className="bg-[#0a0f2c]">{arb.nombre.toUpperCase()}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* BOTONES XL */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-5 rounded-[1.5rem] text-[11px] font-black uppercase text-slate-500 border border-slate-800 hover:bg-slate-800 hover:text-white transition-all active:scale-95"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[1.8] py-5 bg-cyan-600 hover:bg-cyan-500 rounded-[1.5rem] text-[11px] font-black uppercase text-white transition-all shadow-[0_0_25px_-5px_rgba(6,182,212,0.4)] active:scale-95 disabled:opacity-30 flex items-center justify-center gap-2"
                        >
                            {loading ? <span className="animate-pulse">Sincronizando...</span> : <><FaCheckCircle size={16}/> Aplicar Cambios</>}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}