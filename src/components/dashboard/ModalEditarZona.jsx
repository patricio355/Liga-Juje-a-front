import { useState } from "react";
import { apiFetch } from "../../api/api";
import {
    FaLayerGroup, FaCheckCircle, FaTimes, FaEdit
} from "react-icons/fa";

export default function ModalEditarZona({ zona, onClose, onUpdated }) {
    const [nombre, setNombre] = useState(zona?.nombre || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleGuardar = async (e) => {
        if (e) e.preventDefault();

        if (!nombre.trim()) {
            return setError("El nombre de la zona es obligatorio");
        }

        setLoading(true);
        setError("");

        try {
            await apiFetch(`/api/zonas/${zona.id}`, {
                method: "PUT",
                body: JSON.stringify({ nombre: nombre.toUpperCase() }),
            });

            // Sincronización con el componente padre
            if (onUpdated) {
                await onUpdated();
            }

            onClose();
        } catch (err) {
            setError(err.message || "Error al actualizar la zona");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-[#040714]/95 backdrop-blur-md flex items-center justify-center z-[300] p-4" onClick={onClose}>
            <form
                className="bg-[#0a0f2c] border border-cyan-500/30 rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
                onSubmit={handleGuardar}
            >
                {/* Header Estilo Champions Admin */}
                <div className="bg-[#0d143d] px-10 py-8 border-b border-slate-800 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                            <FaLayerGroup className="text-cyan-500" size={24} /> Editar Zona
                        </h2>

                    </div>
                    <button
                        onClick={onClose}
                        type="button"
                        className="p-3 bg-[#040714] rounded-2xl text-slate-500 hover:text-white border border-slate-800 transition-all"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                <div className="p-10 space-y-8">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-center animate-pulse">
                            {error}
                        </div>
                    )}

                    <div className="space-y-6">
                        <div className="space-y-2.5">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] ml-1 flex items-center gap-2">
                                <FaEdit size={10} className="text-cyan-500" /> Nombre de la Zona
                            </label>
                            <input
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value.toUpperCase())}
                                className="w-full px-6 py-4 bg-[#040714] border border-slate-800 rounded-2xl outline-none focus:border-cyan-500 text-base font-bold text-white transition-all shadow-inner"
                                placeholder="EJ: ZONA B, PLAYOFFS..."
                                required
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Footer con botones grandes estilo Ficha */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            className="flex-1 py-5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest text-slate-500 border border-slate-800 hover:bg-slate-800 hover:text-white transition-all active:scale-95"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !nombre.trim()}
                            className="flex-[1.8] py-5 bg-cyan-600 hover:bg-cyan-500 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest text-white transition-all shadow-[0_0_25px_-5px_rgba(6,182,212,0.4)] active:scale-95 disabled:opacity-30 flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <span className="animate-pulse">Guardando...</span>
                            ) : (
                                <>
                                    <FaCheckCircle size={16} />
                                    Guardar Cambios
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}