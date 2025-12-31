import { useState, useEffect, useContext } from "react";
import { apiFetch } from "../../api/api";
import { AuthContext } from "../../context/AuthContext";

export default function ModalEditarTorneo({ torneo, onClose, onUpdated }) {

    const { user } = useContext(AuthContext);
    const esAdmin = user?.role === "ROLE_ADMIN";

    const [nombre, setNombre] = useState("");
    const [division, setDivision] = useState("A");
    const [encargadoEmail, setEncargadoEmail] = useState("");
    const [estado, setEstado] = useState("ACTIVO");
    const [tipo, setTipo] = useState("CERRADO");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (torneo) {
            setNombre(torneo.nombre || "");
            setDivision(torneo.division || "A");
            setEncargadoEmail(torneo.encargadoEmail || "");
            setEstado(torneo.estado || "ACTIVO");
            setTipo(torneo.tipo || "CERRADO");
        }
    }, [torneo]);

    const actualizarTorneo = async () => {
        if (!nombre.trim()) {
            setError("El nombre es obligatorio");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const payload = {
                nombre,
                division,
                estado,
                tipo
            };

            // 👇 SOLO ADMIN puede cambiar encargado
            if (esAdmin) {
                payload.encargadoEmail = encargadoEmail;
            }

            await apiFetch(`/api/torneos/${torneo.id}`, {
                method: "PUT",
                body: JSON.stringify(payload),
            });

            onUpdated();
            onClose();

        } catch (e) {
            try {
                const parsed = JSON.parse(e.message);
                setError(parsed.message || "Error al actualizar torneo");
            } catch {
                setError(e.message || "Error al actualizar torneo");
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
                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-2 rounded mb-4">
                        {error}
                    </div>
                )}

                <h2 className="text-xl font-bold mb-4">Editar Torneo</h2>

                {/* Nombre */}
                <label className="block mb-2">Nombre</label>
                <input
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 mb-4"
                />

                {/* División */}
                <label className="block mb-2">División</label>
                <select
                    value={division}
                    onChange={(e) => setDivision(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 mb-4"
                >
                    <option value="A">A</option>
                    <option value="B">B</option>
                </select>

                {/* 👇 SOLO ADMIN */}
                {esAdmin && (
                    <>
                        <label className="block mb-2">Encargado (email)</label>
                        <input
                            value={encargadoEmail}
                            onChange={(e) => setEncargadoEmail(e.target.value)}
                            className="w-full p-2 rounded bg-gray-700 mb-4"
                            placeholder="email@ejemplo.com"
                        />
                    </>
                )}

                {/* Estado */}
                <label className="block mb-2">Estado</label>
                <select
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 mb-4"
                >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
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
                        onClick={actualizarTorneo}
                        disabled={loading}
                    >
                        {loading ? "Guardando..." : "Guardar cambios"}
                    </button>
                </div>
            </div>
        </div>
    );
}
