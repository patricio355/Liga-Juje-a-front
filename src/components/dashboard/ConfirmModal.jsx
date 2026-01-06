import { useState } from "react";
import { FaTrash, FaExclamationTriangle } from "react-icons/fa";

export default function ConfirmModal({ mensaje, onConfirm, onCancel }) {
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        setLoading(true);
        try {
            // Esperamos a que la función onConfirm (que tiene el apiFetch) termine
            await onConfirm();
            // Una vez eliminado con éxito, el padre cerrará este modal
        } catch (error) {
            console.error("Error al eliminar:", error);
            setLoading(false); // Si falla, permitimos reintentar
        }
    };

    return (
        <div
            className="fixed inset-0 bg-[#0f172a]/90 backdrop-blur-sm flex items-center justify-center z-[250] p-4"
            onClick={onCancel}
        >
            <div
                className="bg-[#1e293b] w-full max-w-sm rounded-[2rem] border border-slate-700/50 shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaExclamationTriangle className="text-red-500 text-2xl" />
                    </div>

                    <h2 className="text-xl font-black text-white uppercase italic tracking-tighter mb-3">
                        ¿Estás seguro?
                    </h2>

                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed mb-8">
                        {mensaje}
                    </p>

                    <div className="flex gap-3">
                        <button
                            className="flex-1 h-12 bg-[#0f172a] text-slate-500 rounded-2xl text-[11px] font-black uppercase hover:text-white transition-all border border-slate-700/50"
                            onClick={onCancel}
                            disabled={loading}
                        >
                            Cancelar
                        </button>

                        <button
                            className="flex-[1.5] h-12 bg-red-600 hover:bg-red-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-red-900/20 flex items-center justify-center gap-2"
                            onClick={handleConfirm}
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="animate-pulse">Eliminando...</span>
                            ) : (
                                <><FaTrash size={12} /> Confirmar</>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}