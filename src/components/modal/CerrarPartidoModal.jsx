import { useEffect, useState } from "react";
import {
    FaTrophy, FaTimes, FaCheck,
    FaCalendarAlt, FaMapMarkerAlt, FaClock, FaEdit
} from "react-icons/fa";
import EditarInfoModal from "./EditarInfoModal";

export default function CerrarPartidoModal({ open, onClose, partido, onSuccess }) {
    // Log de seguimiento para depuración en consola
    console.log("Estado del Modal Cerrar:", { open, partido });

    const [golesLocal, setGolesLocal] = useState("");
    const [golesVisitante, setGolesVisitante] = useState("");
    const [loading, setLoading] = useState(false);
    const [modalEditarInfo, setModalEditarInfo] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (partido) {
            setGolesLocal(partido.golesLocal?.toString() || "");
            setGolesVisitante(partido.golesVisitante?.toString() || "");
        }
    }, [partido]);

    if (!open || !partido) return null;

    const handleGolesChange = (valor, setter) => {
        if (valor === "" || (parseInt(valor) >= 0)) setter(valor);
    };

    const cerrar = async () => {
        // CORRECCIÓN CRÍTICA: Se define el path y SE USA en el fetch
        const path = partido.esFaseFinal
            ? `/api/partidos/${partido.partidoId || partido.id}/cerrar-fase-final`
            : `/api/partidos/${partido.partidoId || partido.id}/cerrar`;

        try {
            setLoading(true);
            const res = await fetch(`${API_URL}${path}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    golesLocal: Number(golesLocal) || 0,
                    golesVisitante: Number(golesVisitante) || 0,
                }),
            });

            if (!res.ok) {
                const errorData = await res.text();
                // Si el backend lanza el NullPointerException, lo capturamos aquí
                throw new Error(errorData || "Error en el servidor al cerrar partido");
            }

            if (onSuccess) await onSuccess();
            onClose();
        } catch (e) {
            console.error("Error al cerrar:", e);
            alert(e.message || "Error al registrar el resultado.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="fixed inset-0 z-[500] bg-[#040714]/95 backdrop-blur-md flex items-center justify-center p-4" onClick={onClose}>
                <div className="relative bg-[#0a0f2c] border border-cyan-500/30 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>

                    {/* Header */}
                    <div className="bg-[#0d143d] px-10 py-8 border-b border-slate-800 flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                                <FaTrophy className="text-cyan-500" size={24} />
                                {partido.esFaseFinal ? "Cerrar Eliminatoria" : "Cerrar Planilla"}
                            </h2>
                        </div>
                        <button onClick={onClose} className="p-3 bg-[#040714] rounded-2xl text-slate-500 hover:text-white border border-slate-800">
                            <FaTimes size={20} />
                        </button>
                    </div>

                    {/* Info del Partido */}
                    <div className="bg-[#0d143d]/30 px-10 py-5 border-b border-slate-800 flex flex-col items-center gap-4">
                        <div className="flex flex-wrap justify-center gap-6">
                            <div className="flex items-center gap-2">
                                <FaCalendarAlt className="text-cyan-500/50" size={12}/>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{partido.fecha || "PENDIENTE"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaClock className="text-cyan-500/50" size={12}/>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{partido.hora || "PENDIENTE"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaMapMarkerAlt className="text-cyan-500/50" size={12}/>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{partido.canchaNombre || partido.cancha || "PENDIENTE"}</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setModalEditarInfo(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-cyan-600/10 border border-cyan-500/30 rounded-xl text-[9px] font-black text-cyan-400 uppercase tracking-[0.2em] hover:bg-cyan-600 hover:text-white transition-all"
                        >
                            <FaEdit size={10} /> Corregir Información
                        </button>
                    </div>

                    {/* Marcador */}
                    <div className="p-10">
                        <div className="flex justify-between items-center gap-6 mb-10">
                            <div className="flex-1 flex flex-col items-center">
                                <p className="text-white font-black text-[11px] uppercase text-center mb-4 italic leading-tight h-8 flex items-center">
                                    {partido.equipoLocalNombre || partido.local}
                                </p>
                                <input
                                    type="number"
                                    placeholder="0"
                                    className="w-20 h-20 bg-[#040714] border-2 border-slate-800 rounded-3xl text-center text-3xl font-black text-white focus:border-cyan-500 outline-none shadow-inner"
                                    value={golesLocal}
                                    onChange={(e) => handleGolesChange(e.target.value, setGolesLocal)}
                                />
                            </div>
                            <div className="text-slate-800 font-black text-xl pt-8">VS</div>
                            <div className="flex-1 flex flex-col items-center">
                                <p className="text-white font-black text-[11px] uppercase text-center mb-4 italic leading-tight h-8 flex items-center">
                                    {partido.equipoVisitanteNombre || partido.visitante}
                                </p>
                                <input
                                    type="number"
                                    placeholder="0"
                                    className="w-20 h-20 bg-[#040714] border-2 border-slate-800 rounded-3xl text-center text-3xl font-black text-white focus:border-cyan-500 outline-none shadow-inner"
                                    value={golesVisitante}
                                    onChange={(e) => handleGolesChange(e.target.value, setGolesVisitante)}
                                />
                            </div>
                        </div>

                        {/* BLOQUEO DE EMPATE PARA FASE FINAL */}
                        {partido.esFaseFinal && golesLocal !== "" && golesVisitante !== "" && Number(golesLocal) === Number(golesVisitante) && (
                            <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/50 mb-4 animate-pulse">
                                <p className="text-[9px] text-red-500 text-center uppercase font-black tracking-widest">
                                    ⚠️ No se permiten empates en llaves eliminatorias.
                                </p>
                            </div>
                        )}

                        <div className="bg-[#040714] p-5 rounded-2xl border border-slate-800 border-dashed">
                            <p className="text-[9px] text-cyan-500/50 text-center uppercase font-black tracking-[0.2em]">⚠️ Verifique los datos antes de finalizar.</p>
                        </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex p-6 gap-4 bg-[#0d143d]/50 border-t border-slate-800">
                        <button onClick={onClose} className="flex-1 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest text-slate-500 border border-slate-800 hover:bg-slate-800 hover:text-white transition-all">
                            Cancelar
                        </button>
                        <button
                            onClick={cerrar}
                            disabled={loading || (partido.esFaseFinal && Number(golesLocal) === Number(golesVisitante))}
                            className="flex-[1.8] py-4 bg-cyan-600 hover:bg-cyan-500 rounded-[1.5rem] text-[10px] font-black uppercase text-white shadow-lg disabled:opacity-30 flex items-center justify-center gap-3 transition-all"
                        >
                            {loading ? "Cerrando..." : <><FaCheck size={14} /> Finalizar</>}
                        </button>
                    </div>
                </div>
            </div>

            {modalEditarInfo && (
                <EditarInfoModal
                    open={modalEditarInfo}
                    partido={partido}
                    onClose={() => setModalEditarInfo(false)}
                    onSuccess={() => {
                        if (onSuccess) onSuccess();
                        setModalEditarInfo(false);
                    }}
                />
            )}
        </>
    );
}