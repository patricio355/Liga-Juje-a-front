import { useEffect, useState } from "react";
import { crearEquipo } from "../../api/equipos.api";
import { getCanchas } from "../../api/canchas.api";

export default function ModalCrearEquipo({ onClose, onCreated }) {

    const [form, setForm] = useState({
        nombre: "",
        localidad: "",
        escudo: "",
        camisetaTitular: "",
        camisetaSuplente: "",
        estado: true,
        canchaId: "",
        encargadoEmail: ""
    });

    const [canchas, setCanchas] = useState([]);
    const [error, setError] = useState("");

    // ---------------------------------------------------
    // CARGAR CANCHAS
    // ---------------------------------------------------
    useEffect(() => {
        const cargarCanchas = async () => {
            try {
                const data = await getCanchas();
                setCanchas(data.filter(c => c.estado)); // solo activas
            } catch (e) {
                console.error("Error cargando canchas", e);
            }
        };

        cargarCanchas();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const guardar = async () => {
        if (!form.nombre || !form.canchaId ) {
            setError("Nombre, cancha son obligatorios");
            return;
        }

        try {
            await crearEquipo({
                ...form,
                canchaId: Number(form.canchaId),
                encargadoEmail: form.encargadoEmail || null
            });

            onCreated();
            onClose();
        } catch (e) {

            console.error(e);

            const msg = e.message || "";

            if (msg.includes("Usuario no existe")) {
                setError("El correo del encargado no existe");
            }
            else if (msg.includes("ya es encargado")) {
                setError("Este usuario ya es encargado de otro equipo");
            }
            else if (msg.includes("Duplicate entry")) {
                setError("Ya existe un equipo con ese nombre");
            }
            else if (msg.includes("Este usuario no es un encargado")) {
                setError("El correo no pertenece a un encargado");
            }
            else {
                setError("Error al crear el equipo");
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#1c213b] p-6 rounded-xl w-full max-w-lg text-white">

                <h2 className="text-xl font-bold mb-4">
                    Crear Equipo
                </h2>

                {error && (
                    <p className="text-red-400 text-sm mb-3">{error}</p>
                )}

                <div className="space-y-3">

                    <input
                        name="nombre"
                        placeholder="Nombre del equipo"
                        value={form.nombre}
                        onChange={handleChange}
                        className="w-full p-3 rounded bg-gray-700"
                    />

                    <input
                        name="localidad"
                        placeholder="Localidad"
                        value={form.localidad}
                        onChange={handleChange}
                        className="w-full p-3 rounded bg-gray-700"
                    />

                    <input
                        name="escudo"
                        placeholder="URL del escudo"
                        value={form.escudo}
                        onChange={handleChange}
                        className="w-full p-3 rounded bg-gray-700"
                    />

                    {/* CORREO ENCARGADO */}
                    <input
                        name="encargadoEmail"
                        type="email"
                        placeholder="Correo del encargado"
                        value={form.encargadoEmail}
                        onChange={handleChange}
                        className="w-full p-3 rounded bg-gray-700"
                    />

                    {/* SELECT CANCHAS */}
                    <select
                        name="canchaId"
                        value={form.canchaId}
                        onChange={handleChange}
                        className="w-full p-3 rounded bg-gray-700"
                    >
                        <option value="">Seleccionar cancha</option>
                        {canchas.map(c => (
                            <option key={c.id} value={c.id}>
                                {c.nombre} — {c.ubicacion}
                            </option>
                        ))}
                    </select>

                    <div className="grid grid-cols-2 gap-3">
                        <input
                            name="camisetaTitular"
                            placeholder="Camiseta titular"
                            value={form.camisetaTitular}
                            onChange={handleChange}
                            className="p-3 rounded bg-gray-700"
                        />

                        <input
                            name="camisetaSuplente"
                            placeholder="Camiseta suplente"
                            value={form.camisetaSuplente}
                            onChange={handleChange}
                            className="p-3 rounded bg-gray-700"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-600 rounded"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={guardar}
                        className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
                    >
                        Crear
                    </button>
                </div>
            </div>
        </div>
    );
}
