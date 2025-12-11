import { useState, useEffect } from "react";

export default function ModalEditarZona({ zona, onClose, onUpdated }) {

    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");

    useEffect(() => {
        setNombre(zona.nombre);
        setDescripcion(zona.descripcion);
    }, [zona]);

    const actualizar = async () => {
        const body = { nombre, descripcion };

        const res = await fetch(
            `http://localhost:8080/api/zonas/${zona.id}`,  // deberías crear este endpoint
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            }
        );

        if (res.ok) {
            onUpdated();
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
             onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-[#1c213b] p-6 rounded-xl w-96 shadow-xl text-white"
            >
                <h2 className="text-xl font-bold mb-4">Editar Zona</h2>

                <label className="block mb-2">Nombre</label>
                <input
                    type="text"
                    className="w-full p-2 rounded bg-gray-700 mb-4"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                />

                <label className="block mb-2">Descripción</label>
                <input
                    type="text"
                    className="w-full p-2 rounded bg-gray-700 mb-6"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
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
                        onClick={actualizar}
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
}
