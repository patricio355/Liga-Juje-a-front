import { useState } from "react";
import { apiFetch } from "../../api/api";

export default function ModalEditarEquipo({ equipo, onClose, onUpdated }) {

    if (!equipo) return null; // 🔒 protección extra

    const [nombre, setNombre] = useState(equipo.nombre || "");
    const [localidad, setLocalidad] = useState(equipo.localidad || "");
    const [escudo, setEscudo] = useState(equipo.escudo || "");
    const [estado, setEstado] = useState(equipo.estado ?? true);

    const [encargadoEmail, setEncargadoEmail] =
        useState(equipo.encargadoEmail || "");

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const guardar = async () => {
        setLoading(true);
        setError(null);

        try {
            await apiFetch(`/api/equipos/${equipo.id}`, {
                method: "PUT",
                body: JSON.stringify({
                    nombre,
                    localidad,
                    escudo,
                    estado,
                    encargadoEmail: encargadoEmail.trim() || null
                })
            });

            onUpdated();
            onClose();

        } catch (e) {
            try {
                const parsed = JSON.parse(e.message);
                setError(parsed.message || "Error al editar equipo");
            } catch {
                setError(e.message || "Error al editar equipo");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#1c213b] p-6 rounded-xl w-full max-w-md">

                <h2 className="text-xl font-bold mb-4">
                    Editar equipo
                </h2>

                {/* ERROR */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-2 rounded mb-4">
                        {error}
                    </div>
                )}

                {/* NOMBRE */}
                <input
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                    className="w-full mb-3 px-3 py-2 rounded bg-gray-700 outline-none"
                    placeholder="Nombre del equipo"
                />

                {/* LOCALIDAD */}
                <input
                    value={localidad}
                    onChange={e => setLocalidad(e.target.value)}
                    className="w-full mb-3 px-3 py-2 rounded bg-gray-700 outline-none"
                    placeholder="Localidad"
                />

                {/* ESCUDO */}
                <input
                    value={escudo}
                    onChange={e => setEscudo(e.target.value)}
                    className="w-full mb-3 px-3 py-2 rounded bg-gray-700 outline-none"
                    placeholder="URL del escudo"
                />

                {/* ENCARGADO */}
                <input
                    value={encargadoEmail}
                    onChange={e => setEncargadoEmail(e.target.value)}
                    className="w-full mb-3 px-3 py-2 rounded bg-gray-700 outline-none"
                    placeholder="Email del encargado (opcional)"
                />

                <p className="text-xs text-gray-400 mb-3">
                    Dejar vacío para quitar el encargado
                </p>

                {/* ESTADO */}
                <select
                    value={estado ? "true" : "false"}
                    onChange={e => setEstado(e.target.value === "true")}
                    className="w-full mb-4 px-3 py-2 rounded bg-gray-700 outline-none"
                >
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                </select>

                {/* BOTONES */}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={guardar}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Guardando..." : "Guardar"}
                    </button>
                </div>
            </div>
        </div>
    );
}

