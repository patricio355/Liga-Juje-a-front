import { useState } from "react";
import { apiFetch } from "../../api/api";

export default function ModalCrearTorneo({ onClose, onCreated }) {

    const [nombre, setNombre] = useState("");
    const [division, setDivision] = useState("A");
    const [encargadoEmail, setEncargadoEmail] = useState("");
    const [estado, setEstado] = useState("activo");
    const [tipo, setTipo] = useState("CERRADO");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const crearTorneo = async () => {
        if (!nombre.trim()) {
            setError("El nombre es obligatorio");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await apiFetch("/api/torneos", {
                method: "POST",
                body: JSON.stringify({
                    nombre,
                    division,
                    encargadoEmail,
                    estado,
                    tipo
                }),
            });

            onCreated(); // refrescar lista
            onClose();   // cerrar modal

        } catch (e) {
            // 👇 intentamos mostrar mensaje real del backend
            try {
                const parsed = JSON.parse(e.message);
                setError(parsed.message || "Error al crear torneo");
            } catch {
                setError(e.message || "Error al crear torneo");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-[#1c213b] p-6 rounded-xl w-96 shadow-xl text-white"
                onClick={(e) => e.stopPropagation()}
            >

                {/* ERROR */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-2 rounded mb-4">
                        {error}
                    </div>
                )}

                <h2 className="text-xl font-bold mb-4">Crear Torneo</h2>

                {/* Nombre */}
                <label className="block mb-2">Nombre</label>
                <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 outline-none mb-4"
                />

                {/* División */}
                <label className="block mb-2">División</label>
                <select
                    value={division}
                    onChange={(e) => setDivision(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 outline-none mb-4"
                >
                    <option value="A">A</option>
                    <option value="B">B</option>
                </select>

                {/* Encargado */}
                <label className="block mb-2">Encargado (email)</label>
                <input
                    type="text"
                    value={encargadoEmail}
                    onChange={(e) => setEncargadoEmail(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 outline-none mb-4"
                    placeholder="email@ejemplo.com"
                />

                {/* Estado */}
                <label className="block mb-2">Estado</label>
                <select
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 outline-none mb-6"
                >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                </select>

                {/* Tipo */}
                <label className="block mb-2">Tipo</label>
                <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 outline-none mb-6"
                >
                    <option value="ABIERTO">Abierto</option>
                    <option value="CERRADO">Cerrado</option>
                </select>

                {/* Botones */}
                <div className="flex justify-end gap-3">
                    <button
                        className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 transition"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancelar
                    </button>

                    <button
                        className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 transition disabled:opacity-50"
                        onClick={crearTorneo}
                        disabled={loading}
                    >
                        {loading ? "Creando..." : "Crear"}
                    </button>
                </div>

            </div>
        </div>
    );
}
