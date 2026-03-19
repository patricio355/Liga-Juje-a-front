import { useState } from "react";
import { apiFetch } from "../../api/api";
import {
    FaLayerGroup, FaCheckCircle, FaTimes, FaPlusCircle
} from "react-icons/fa";

export default function ModalCrearZona({ torneo, onClose, onCreated }) {
    const [nombre, setNombre] = useState("");
    const [descripcion] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const crearZona = async (e) => {
        if (e) e.preventDefault();

        if (!nombre.trim()) {
            setError("El nombre de la zona es obligatorio");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await apiFetch(`/api/torneos/${torneo.id}/zonas`, {
                method: "POST",
                body: JSON.stringify({
                    nombre: nombre.toUpperCase(),
                    descripcion
                }),
            });

            if (onCreated) {
                await onCreated();
            }
            onClose();
        } catch (err) {
            console.error("Error al crear zona:", err);
            setError(err.message || "Error al crear la zona");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[300] p-4" onClick={onClose}>
            <form
                className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] w-full max-w-lg shadow-[0_0_50px_-12px_rgba(255,255,255,0.1)] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
                onSubmit={crearZona}
            >
                {/* Header Estilo Black & Silver */}
                <div className="bg-[#111] px-10 py-8 border-b border-white/5 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                            <FaLayerGroup className="text-white" size={24} /> Nueva Zona
                        </h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
                            Torneo: <span className="text-white">{torneo.nombre}</span>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        type="button"
                        className="p-3 bg-black rounded-2xl text-slate-500 hover:text-white border border-white/10 transition-all hover:bg-[#1a1a1a]"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                <div className="p-10 space-y-8">

                    <div className="space-y-6">
                        <div className="space-y-2.5">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] ml-1 flex items-center gap-2">
                                <FaPlusCircle size={10} className="text-white" /> Nombre de la Zona / Grupo
                            </label>
                            <input
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value.toUpperCase())}
                                placeholder="EJ: ZONA A, GRUPO 1, ELIMINATORIAS..."
                                className="w-full px-6 py-4 bg-black border border-white/10 rounded-2xl outline-none focus:border-white/40 text-base font-bold text-white transition-all placeholder:text-slate-800 shadow-inner"
                                autoFocus
                            />
                            <p className="text-[9px] text-slate-600 font-bold uppercase tracking-tighter ml-1">
                                El nombre aparecerá en las tablas de posiciones y fixtures.
                            </p>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex flex-col shrink-0 pt-4">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 mb-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-center animate-pulse">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-4">

                        <button
                            type="button"
                            className="flex-1 py-5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest text-slate-400 border border-white/5 hover:bg-white/5 hover:text-white transition-all active:scale-95"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !nombre.trim()}
                            className="flex-[1.8] py-5 bg-white hover:bg-slate-200 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest text-black transition-all shadow-[0_10px_30px_-10px_rgba(255,255,255,0.3)] active:scale-95 disabled:opacity-20 disabled:grayscale flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <span className="animate-pulse italic">Procesando...</span>
                            ) : (
                                <>
                                    <FaCheckCircle size={16} />
                                    Confirmar Zona
                                </>
                            )}
                        </button>
                    </div>
                </div>
                </div>
            </form>
        </div>
    );
}