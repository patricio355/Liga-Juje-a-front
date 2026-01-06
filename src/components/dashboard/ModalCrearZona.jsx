import { useState } from "react";
import { FaLayerGroup, FaCheckCircle, FaTimes } from "react-icons/fa";

export default function ModalCrearZona({ torneo, onClose, onCreated }) {
    const [nombre, setNombre] = useState("");
    const [descripcion] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL;

    const crearZona = async () => {
        if (!nombre.trim()) {
            setError("El nombre es obligatorio");
            return;
        }

        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(
                `${API_URL}/api/torneos/${torneo.id}/zonas`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ nombre, descripcion }),
                }
            );

            if (res.ok) {
                // CLAVE: Esperamos a que la función de recarga termine antes de cerrar
                // Esto evita el efecto de "modal cerrado y lista vieja"
                if (onCreated) {
                    await onCreated();
                }
                onClose();
            } else {
                const data = await res.json();
                setError(data.message || "Error al crear la zona");
            }

        } catch (err) {
            console.error("Error al crear zona:", err);
            setError("Error de conexión con el servidor");
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
                {/* Header */}
                <div className="bg-[#111827]/50 px-8 py-6 border-b border-slate-700/50 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 rounded-lg">
                            <FaLayerGroup className="text-emerald-500" />
                        </div>
                        <h2 className="text-xs font-black uppercase italic tracking-widest text-white leading-none">Nueva Zona</h2>
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

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nombre de la Zona</label>
                            <input
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                placeholder="Ej: Zona A, Clasificatorio..."
                                className="w-full h-12 bg-[#0f172a] border border-slate-700/50 px-4 rounded-xl focus:border-emerald-500 text-sm text-slate-200 outline-none transition-all shadow-inner placeholder:text-slate-700"
                            />
                        </div>


                    </div>

                    <div className="flex gap-4 pt-2">
                        <button
                            className="flex-1 h-12 bg-[#0f172a] text-slate-500 rounded-2xl text-[11px] font-black uppercase hover:text-white transition-all border border-slate-700/50"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                        <button
                            className="flex-[1.5] h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-emerald-900/20 flex items-center justify-center gap-2 disabled:opacity-50"
                            onClick={crearZona}
                            disabled={loading}
                        >
                            {loading ? <span className="animate-pulse">Guardando...</span> : <><FaCheckCircle size={14} /> Crear Zona</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}