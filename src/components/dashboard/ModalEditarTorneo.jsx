import { useState, useEffect } from "react";

export default function ModalEditarTorneo({ torneo, onClose, onUpdated }) {

    const [nombre, setNombre] = useState("");
    const [division, setDivision] = useState("");
    const [encargado, setEncargado] = useState("");
    const [estado, setEstado] = useState("");
    const [loading, setLoading] = useState(false);

    // Cargar los datos del torneo al abrir el modal
    useEffect(() => {
        if (torneo) {
            setNombre(torneo.nombre);
            setDivision(torneo.division);
            setEncargado(torneo.encargado);
            setEstado(torneo.estado);
        }
    }, [torneo]);

    const actualizarTorneo = async () => {
        if (!nombre.trim()) {
            alert("El nombre es obligatorio");
            return;
        }

        setLoading(true);

        const body = {
            nombre,
            division,
            encargado,
            estado
        };

        try {
            const res = await fetch(`http://localhost:8080/api/torneos/${torneo.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                onUpdated(); // recargar lista
                onClose();   // cerrar modal
            }

        } catch (error) {
            console.error("Error al actualizar torneo:", error);
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
                <h2 className="text-xl font-bold mb-4">Editar Torneo</h2>

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
                <label className="block mb-2">Encargado</label>
                <input
                    type="text"
                    value={encargado}
                    onChange={(e) => setEncargado(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 outline-none mb-4"
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

                {/* Botones */}
                <div className="flex justify-end gap-3">
                    <button
                        className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 transition"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>

                    <button
                        className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 transition disabled:bg-gray-400"
                        onClick={actualizarTorneo}
                        disabled={loading}
                    >
                        {loading ? "Guardando..." : "Guardar"}
                    </button>
                </div>

            </div>
        </div>
    );
}
