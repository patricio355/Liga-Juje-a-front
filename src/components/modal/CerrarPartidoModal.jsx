import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
    FaTrophy, FaTimes, FaCheck,
    FaCalendarAlt, FaMapMarkerAlt, FaClock, FaEdit,
    FaPlus, FaMinus
} from "react-icons/fa";
import EditarInfoModal from "./EditarInfoModal";

export default function CerrarPartidoModal({ open, onClose, partido, onSuccess }) {
    // Inicializamos en 0 por defecto
    const [golesLocal, setGolesLocal] = useState(0);
    const [golesVisitante, setGolesVisitante] = useState(0);
    const [golesLocalPenales, setGolesLocalPenales] = useState(0);
    const [golesVisitantePenales, setGolesVisitantePenales] = useState(0);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [modalEditarInfo, setModalEditarInfo] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (partido) {
            setGolesLocal(partido.golesLocal ?? 0);
            setGolesVisitante(partido.golesVisitante ?? 0);
            setGolesLocalPenales(partido.golesLocalPenales ?? 0);
            setGolesVisitantePenales(partido.golesVisitantePenales ?? 0);
        }
    }, [partido]);

    if (!open || !partido) return null;

    const handleGolesChange = (valor, setter) => {
        if (valor === "" || valor === null || valor === undefined) {
            setter(0);
            return;
        }
        const num = parseInt(valor, 10);
        if (!isNaN(num) && num >= 0) {
            setter(num);
        }
    };

    const incrementar = (setter, valor) => {
        setter(prev => prev + 1);
    };

    const decrementar = (setter, valor) => {
        setter(prev => prev > 0 ? prev - 1 : 0);
    };

    const esEmpateFaseFinal = partido.esFaseFinal &&
        Number(golesLocal) === Number(golesVisitante);

    const penalesInvalidos = esEmpateFaseFinal && (
        Number(golesLocalPenales) === Number(golesVisitantePenales)
    );

    const cerrar = async () => {
        const path = partido.esFaseFinal
            ? `/api/partidos/${partido.partidoId || partido.id}/cerrar-fase-final`
            : `/api/partidos/${partido.partidoId || partido.id}/cerrar`;

        try {
            setLoading(true);
            setError(null);
            const res = await fetch(`${API_URL}${path}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    golesLocal: Number(golesLocal),
                    golesVisitante: Number(golesVisitante),
                    golesLocalPenales: esEmpateFaseFinal ? Number(golesLocalPenales) : 0,
                    golesVisitantePenales: esEmpateFaseFinal ? Number(golesVisitantePenales) : 0,
                }),
            });

            if (!res.ok) {
                const errorData = await res.text();
                throw new Error(errorData || "Error en el servidor al cerrar partido");
            }

            if (onSuccess) await onSuccess();
            onClose();
        } catch (e) {
            console.error("Error al cerrar:", e);
            setError(e.message || "Error al registrar el resultado.");
        } finally {
            setLoading(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[500] bg-black/90 backdrop-blur-md flex items-center justify-center p-4" onClick={onClose}>
            <div className="relative bg-[#05070a] border border-white/10 w-full max-w-lg rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,1)] overflow-hidden animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>

                {/* Header Estilo Dark */}
                <div className="bg-[#0a0c10] px-8 py-6 border-b border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-slate-400/10 p-2.5 rounded-xl text-slate-400">
                            <FaTrophy size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black uppercase italic tracking-tighter text-white">
                                {partido.esFaseFinal ? "Cerrar Eliminatoria." : "Cerrar Planilla."}
                            </h2>
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                                Registro de resultado oficial
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white/5 rounded-full text-slate-500 hover:text-white transition-colors">
                        <FaTimes size={16} />
                    </button>
                </div>

                {/* Info del Partido */}
                <div className="bg-white/5 px-8 py-5 border-b border-white/5 flex flex-col items-center gap-4">
                    <div className="flex flex-wrap justify-center gap-6">
                        <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-slate-500" size={10}/>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{partido.fecha || "PENDIENTE"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaClock className="text-slate-500" size={10}/>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{partido.hora || "PENDIENTE"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaMapMarkerAlt className="text-slate-500" size={10}/>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate max-w-[150px]">{partido.canchaNombre || partido.cancha || "PENDIENTE"}</span>
                        </div>
                    </div>

                    {!partido.esFaseFinal && (
                        <button
                            type="button"
                            onClick={() => setModalEditarInfo(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] hover:bg-white/10 hover:text-white transition-all"
                        >
                            <FaEdit size={10} /> Corregir Información
                        </button>
                    )}
                </div>

                {/* Marcador */}
                <div className="p-8">
                    <div className="flex justify-between items-center gap-4 mb-8 bg-black/40 p-6 rounded-[2rem] border border-white/5">
                        <div className="flex-1 flex flex-col items-center min-w-0">
                            <p className="text-white font-black text-[10px] uppercase text-center mb-4 break-words w-full leading-tight h-8 flex items-center justify-center">
                                {partido.equipoLocalNombre || partido.local}
                            </p>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    className="w-16 h-16 bg-black border-2 border-white/10 rounded-2xl text-center text-2xl font-black text-white focus:border-slate-400 outline-none shadow-2xl transition-all"
                                    value={golesLocal}
                                    onChange={(e) => handleGolesChange(e.target.value, setGolesLocal)}
                                />
                                <div className="flex flex-col gap-1">
                                    <button
                                        type="button"
                                        onClick={() => incrementar(setGolesLocal, golesLocal)}
                                        className="w-7 h-7 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center text-white transition-all active:scale-95"
                                    >
                                        <FaPlus size={10} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => decrementar(setGolesLocal, golesLocal)}
                                        className="w-7 h-7 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center text-white transition-all active:scale-95"
                                    >
                                        <FaMinus size={10} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="text-slate-800 font-black text-xl pt-8 shrink-0">VS</div>

                        <div className="flex-1 flex flex-col items-center min-w-0">
                            <p className="text-white font-black text-[10px] uppercase text-center mb-4 break-words w-full leading-tight h-8 flex items-center justify-center">
                                {partido.equipoVisitanteNombre || partido.visitante}
                            </p>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    className="w-16 h-16 bg-black border-2 border-white/10 rounded-2xl text-center text-2xl font-black text-white focus:border-slate-400 outline-none shadow-2xl transition-all"
                                    value={golesVisitante}
                                    onChange={(e) => handleGolesChange(e.target.value, setGolesVisitante)}
                                />
                                <div className="flex flex-col gap-1">
                                    <button
                                        type="button"
                                        onClick={() => incrementar(setGolesVisitante, golesVisitante)}
                                        className="w-7 h-7 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center text-white transition-all active:scale-95"
                                    >
                                        <FaPlus size={10} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => decrementar(setGolesVisitante, golesVisitante)}
                                        className="w-7 h-7 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center text-white transition-all active:scale-95"
                                    >
                                        <FaMinus size={10} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECCIÓN DE PENALES */}
                    {esEmpateFaseFinal && (
                        <div className="mb-8 p-6 bg-slate-400/5 border border-white/5 rounded-[2rem] animate-in slide-in-from-top duration-300">
                            <p className="text-[10px] text-center font-black text-slate-500 uppercase tracking-[0.3em] mb-4">
                                Definición por Penales
                            </p>
                            <div className="flex justify-center items-center gap-6">
                                <div className="flex flex-col items-center gap-2">
                                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter">Local</span>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            min="0"
                                            className="w-14 h-14 bg-black border-2 border-white/10 rounded-2xl text-center text-xl font-black text-white focus:border-slate-400 outline-none"
                                            value={golesLocalPenales}
                                            onChange={(e) => handleGolesChange(e.target.value, setGolesLocalPenales)}
                                        />
                                        <div className="flex flex-col gap-1">
                                            <button
                                                type="button"
                                                onClick={() => incrementar(setGolesLocalPenales, golesLocalPenales)}
                                                className="w-6 h-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center text-white transition-all active:scale-95"
                                            >
                                                <FaPlus size={8} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => decrementar(setGolesLocalPenales, golesLocalPenales)}
                                                className="w-6 h-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center text-white transition-all active:scale-95"
                                            >
                                                <FaMinus size={8} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter">Visitante</span>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            min="0"
                                            className="w-14 h-14 bg-black border-2 border-white/10 rounded-2xl text-center text-xl font-black text-white focus:border-slate-400 outline-none"
                                            value={golesVisitantePenales}
                                            onChange={(e) => handleGolesChange(e.target.value, setGolesVisitantePenales)}
                                        />
                                        <div className="flex flex-col gap-1">
                                            <button
                                                type="button"
                                                onClick={() => incrementar(setGolesVisitantePenales, golesVisitantePenales)}
                                                className="w-6 h-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center text-white transition-all active:scale-95"
                                            >
                                                <FaPlus size={8} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => decrementar(setGolesVisitantePenales, golesVisitantePenales)}
                                                className="w-6 h-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center text-white transition-all active:scale-95"
                                            >
                                                <FaMinus size={8} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {Number(golesLocalPenales) === Number(golesVisitantePenales) && (
                                <p className="text-[8px] text-red-500/80 text-center mt-3 font-bold uppercase tracking-tighter">
                                    * La tanda de penales debe tener un ganador
                                </p>
                            )}
                        </div>
                    )}

                    <div className="bg-black/20 p-4 rounded-2xl border border-white/5 border-dashed text-center">
                        <p className="text-[9px] text-slate-500 uppercase font-black tracking-[0.2em]">
                            Verifique los datos antes de finalizar el acta.
                        </p>
                    </div>
                </div>

                {/* Acciones Footer */}
                <div className="flex flex-col p-6 shrink-0 bg-[#0a0c10] border-t border-white/5">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 mb-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center">
                            {error}
                        </div>
                    )}
                    <div className="flex gap-4">
                        <button onClick={onClose} className="flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 border border-white/5 hover:bg-white/5 transition-all">
                            Cancelar
                        </button>
                        <button
                            onClick={cerrar}
                            disabled={loading || penalesInvalidos}
                            className="flex-[1.5] py-4 bg-gradient-to-r from-slate-200 to-slate-400 hover:from-white hover:to-slate-100 text-black rounded-2xl text-[10px] font-black uppercase shadow-xl disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all"
                        >
                            {loading ? "Sincronizando..." : <><FaCheck size={14} /> Finalizar Acta</>}
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
        </div>,
        document.body
    );
}