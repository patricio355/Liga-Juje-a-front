import { useState, useEffect } from "react";
import { FaExclamationTriangle, FaSpinner, FaTrashAlt } from "react-icons/fa";

export default function ConfirmarEliminacionModal({ open, onClose, onConfirm, titulo, mensaje, loading, requiereEscritura = false }) {
    const [inputNombre, setInputNombre] = useState("");
    const PALABRA_CONTROL = "CONFIRMAR";

    useEffect(() => {
        if (open) setInputNombre("");
    }, [open]);

    if (!open) return null;

    // Si requiereEscritura es false, esValido siempre es true.
    // Si es true, debe coincidir con la palabra de control.
    const esValido = !requiereEscritura || inputNombre.toUpperCase() === PALABRA_CONTROL;

    return (
        <div
            className="fixed inset-0 bg-[#040714]/95 backdrop-blur-md flex items-center justify-center z-[500] p-4"
            onClick={loading ? null : onClose}
        >
            <div
                className="bg-[#0a0f2c] border border-red-500/30 rounded-[2.5rem] max-w-md w-full p-10 shadow-2xl relative overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-500/10 rounded-full blur-3xl"></div>

                <div className="flex flex-col items-center text-center relative z-10">
                    <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500 mb-6 border border-red-500/20 shadow-lg">
                        <FaExclamationTriangle size={36} />
                    </div>

                    <h3 className="text-2xl font-bold text-white uppercase tracking-tight mb-3">{titulo}</h3>
                    <p className="text-slate-400 text-sm mb-8 leading-relaxed">{mensaje}</p>

                    {/* CAMPO DE TEXTO CONDICIONAL */}
                    {requiereEscritura && (
                        <div className="w-full mb-8 animate-in fade-in zoom-in duration-300">
                            <p className="text-[10px] text-slate-500 uppercase font-black mb-2 tracking-widest text-left italic">
                                Escribe <span className="text-red-400">"{PALABRA_CONTROL}"</span> para continuar:
                            </p>
                            <input
                                type="text"
                                value={inputNombre}
                                onChange={(e) => setInputNombre(e.target.value)}
                                className="w-full bg-[#040714] border border-slate-800 rounded-xl px-4 py-4 text-white text-center text-sm focus:outline-none focus:border-red-500/50 transition-all font-mono tracking-widest uppercase"
                                placeholder="Escribe aquí..."
                                autoFocus
                                disabled={loading}
                            />
                        </div>
                    )}

                    <div className="flex gap-4 w-full">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all active:scale-95"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={loading || !esValido}
                            className={`flex-[1.5] py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 active:scale-95 ${
                                esValido && !loading
                                    ? "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/40"
                                    : "bg-slate-900 text-slate-700 border border-slate-800 cursor-not-allowed"
                            }`}
                        >
                            {loading ? (
                                <>
                                    <FaSpinner className="animate-spin" />
                                    <span>Eliminando...</span>
                                </>
                            ) : (
                                <>
                                    <FaTrashAlt />
                                    <span>Confirmar</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}