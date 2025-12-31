import { useState, useEffect } from "react";
import { apiFetch } from "../../api/api";

export default function ModalEditarZona({ zona, onClose, onSuccess }) {
    // Usamos || "" para evitar el error de "value should not be null"
    const [nombre, setNombre] = useState(zona?.nombre || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleGuardar = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Enviamos solo el nombre, sin descripción
            await apiFetch(`/api/zonas/${zona.id}`, {
                method: "PUT",
                body: JSON.stringify({ nombre }),
            });
            onSuccess(); // Recarga los datos en el padre
            onClose();   // Cierra el modal
        } catch (err) {
            // Aquí capturamos el 403 que ves en consola
            setError(err.message || "Error al actualizar la zona");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#1e243a] border border-gray-700 p-8 rounded-2xl shadow-2xl w-full max-w-md">
                <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-tight">Editar Zona</h2>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl mb-4 text-sm font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleGuardar} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">Nombre de la Zona</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="w-full bg-[#12172d] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
                            required
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-xl transition uppercase text-xs tracking-widest"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition uppercase text-xs tracking-widest disabled:opacity-50"
                        >
                            {loading ? "Guardando..." : "Guardar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
