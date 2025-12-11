import { useState } from "react";

export default function ModalCrearZona({ torneo, onClose, onCreated }) {

    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [loading, setLoading] = useState(false);

    const crearZona = async () => {
        if (!nombre.trim()) return alert("La zona debe tener un nombre");

        setLoading(true);

        try {
            const res = await fetch(
                `http://localhost:8080/api/torneos/${torneo.id}/zonas`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nombre, descripcion }),
                }
            );

            if (res.ok) {
                onCreated();
                onClose();
            }

        } catch (err) {
            console.error("Error al crear zona:", err);
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
                onClick={(e) => e.stopPropagation()}
                className="bg-[#1c213b] p-6 rounded-xl w-96 shadow-xl text-white"
            >
                <h2 className="text-xl font-bold mb-4">Agregar Zona</h2>

                <label className="block mb-2">Nombre</label>
                <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 outline-none mb-4"
                />

                <label className="block mb-2">Descripción</label>
                <input
                    type="text"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 outline-none mb-6"
                />

                <div className="flex justify-end gap-3">
                    <button
                        className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>

                    <button
                        className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
                        onClick={crearZona}
                        disabled={loading}
                    >
                        {loading ? "Guardando..." : "Crear"}
                    </button>
                </div>
            </div>
        </div>
    );
}
