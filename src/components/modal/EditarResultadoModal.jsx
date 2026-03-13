import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { apiFetch } from "../../api/api";
import { FaSave, FaFutbol, FaTimes, FaPlus, FaMinus } from "react-icons/fa";

export default function EditarResultadoModal({ open, onClose, partido, onSuccess }) {
    const [golesLocal, setGolesLocal] = useState(0);
    const [golesVisitante, setGolesVisitante] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (partido) {
            setGolesLocal(partido.golesLocal ?? 0);
            setGolesVisitante(partido.golesVisitante ?? 0);
        }
        if (open) document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
    }, [partido, open]);

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

    const incrementar = (setter) => {
        setter(prev => prev + 1);
    };

    const decrementar = (setter) => {
        setter(prev => prev > 0 ? prev - 1 : 0);
    };

    const guardarCambios = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                golesLocal: golesLocal,
                golesVisitante: golesVisitante
            }).toString();

            await apiFetch(`/api/partidos/${partido.partidoId}/editar-resultado?${queryParams}`, {
                method: "PUT"
            });

            if (onSuccess) await onSuccess();
            onClose();
        } catch (error) {
            console.error("Error al editar resultado:", error);
            alert("No se pudo actualizar el resultado.");
        } finally {
            setLoading(false);
        }
    };

    return createPortal(
        <div
            className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-[999999] p-2 md:p-4"
            onClick={onClose}
        >
            <div
                className="bg-[#05070a] border border-white/10 rounded-[2rem] md:rounded-[2.5rem] w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,1)] overflow-hidden animate-in fade-in zoom-in duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-[#0a0c10] px-6 py-5 md:px-8 md:py-6 border-b border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-slate-400/10 p-2 rounded-xl text-slate-400">
                            <FaFutbol size={18} />
                        </div>
                        <div>
                            <h2 className="text-lg md:text-xl font-black uppercase italic tracking-tighter text-white leading-none">
                                Corregir Resultado
                            </h2>
                            <p className="text-[8px] md:text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">

                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-500 hover:text-white transition-colors p-2 bg-white/5 rounded-full"
                    >
                        <FaTimes size={14} />
                    </button>
                </div>

                <form onSubmit={guardarCambios} className="p-5 md:p-8 space-y-6 md:space-y-8">
                    {/* Marcador Responsivo */}
                    <div className="flex items-center justify-center gap-4 md:gap-8 bg-white/5 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-white/5 shadow-inner">

                        {/* Equipo Local */}
                        <div className="flex-1 flex flex-col items-center gap-3 md:gap-4">
                            <p className="text-[10px] md:text-xs font-black uppercase text-white tracking-widest text-center leading-tight">
                                {partido.local || partido.equipoLocalNombre}
                            </p>
                            <div className="flex items-center gap-1.5">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    value={golesLocal}
                                    onChange={e => handleGolesChange(e.target.value, setGolesLocal)}
                                    className="w-14 h-14 md:w-16 md:h-16 bg-black border-2 border-white/10 rounded-xl md:rounded-2xl text-center text-2xl md:text-3xl font-black text-white focus:border-slate-400 outline-none transition-all shadow-2xl"
                                />
                                <div className="flex flex-col gap-1">
                                    <button
                                        type="button"
                                        onClick={() => incrementar(setGolesLocal)}
                                        className="w-7 h-7 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center text-white transition-all active:scale-95"
                                    >
                                        <FaPlus size={10} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => decrementar(setGolesLocal)}
                                        className="w-7 h-7 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center text-white transition-all active:scale-95"
                                    >
                                        <FaMinus size={10} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* VS */}
                        <div className="text-slate-700 font-black text-lg md:text-xl shrink-0">VS</div>

                        {/* Equipo Visitante */}
                        <div className="flex-1 flex flex-col items-center gap-3 md:gap-4">
                            <p className="text-[10px] md:text-xs font-black uppercase text-white tracking-widest text-center leading-tight">
                                {partido.visitante || partido.equipoVisitanteNombre}
                            </p>
                            <div className="flex items-center gap-1.5">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    value={golesVisitante}
                                    onChange={e => handleGolesChange(e.target.value, setGolesVisitante)}
                                    className="w-14 h-14 md:w-16 md:h-16 bg-black border-2 border-white/10 rounded-xl md:rounded-2xl text-center text-2xl md:text-3xl font-black text-white focus:border-slate-400 outline-none transition-all shadow-2xl"
                                />
                                <div className="flex flex-col gap-1">
                                    <button
                                        type="button"
                                        onClick={() => incrementar(setGolesVisitante)}
                                        className="w-7 h-7 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center text-white transition-all active:scale-95"
                                    >
                                        <FaPlus size={10} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => decrementar(setGolesVisitante)}
                                        className="w-7 h-7 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center text-white transition-all active:scale-95"
                                    >
                                        <FaMinus size={10} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="order-2 sm:order-1 flex-1 py-3 md:py-4 bg-white/5 hover:bg-white/10 text-slate-500 rounded-xl md:rounded-2xl font-black uppercase text-[9px] md:text-[10px] tracking-[0.2em] transition-all border border-white/5"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="order-1 sm:order-2 flex-1 py-3 md:py-4 bg-gradient-to-r from-slate-200 to-slate-400 hover:from-white hover:to-slate-100 text-black rounded-xl md:rounded-2xl font-black uppercase text-[9px] md:text-[10px] tracking-[0.2em] transition-all shadow-[0_10px_30px_rgba(0,0,0,0.3)] flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? "..." : "CONFIRMAR"}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}