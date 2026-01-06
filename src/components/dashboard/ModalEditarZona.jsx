import { useState } from "react";
import { apiFetch } from "../../api/api";
import { FaLayerGroup, FaCheckCircle, FaTimes } from "react-icons/fa";

export default function ModalEditarZona({ zona, onClose, onUpdated }) {
    // Usamos onUpdated para ser consistentes con el nombre de la prop del padre
    const [nombre, setNombre] = useState(zona?.nombre || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleGuardar = async (e) => {
        e.preventDefault();
        if (!nombre.trim()) return setError("El nombre es obligatorio");

        setLoading(true);
        setError("");

        try {
            await apiFetch(`/api/zonas/${zona.id}`, {
                method: "PUT",
                body: JSON.stringify({ nombre }),
            });

            // CLAVE: Esperamos a que la lista del padre se recargue antes de cerrar
            if (onUpdated) {
                await onUpdated();
            }

            onClose();
        } catch (err) {
            // Captura errores de permisos (403) o de red
            setError(err.message || "Error al actualizar la zona");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-[#0f172a]/90 backdrop-blur-sm flex items-center justify-center z-[200] p-4" onClick={onClose}>
            <div
                className="bg-[#1e293b] w-full max-w-md rounded-[2.5rem] border border-slate-700/50 shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Estilo Pro */}
                <div className="bg-[#111827]/50 px-8 py-6 border-b border-slate-700/50 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 rounded-lg">
                            <FaLayerGroup className="text-emerald-500" />
                        </div>
                        <h2 className="text-xs font-black uppercase italic tracking-widest text-white leading-none">Editar Zona</h2>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                        <FaTimes size={18} />
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-[10px] font-bold uppercase text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleGuardar} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 text-emerald-500/80">
                                Nombre de la Zona
                            </label>
                            <input
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                className="w-full h-12 bg-[#0f172a] border border-slate-700/50 px-4 rounded-xl focus:border-emerald-500 text-sm text-slate-200 outline-none transition-all shadow-inner"
                                required
                            />
                        </div>

                        <div className="flex gap-4 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 h-12 bg-[#0f172a] text-slate-500 rounded-2xl text-[11px] font-black uppercase hover:text-white transition-all border border-slate-700/50"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-[1.5] h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-emerald-900/20 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? (
                                    <span className="animate-pulse">Guardando...</span>
                                ) : (
                                    <><FaCheckCircle size={14} /> Guardar Cambios</>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}