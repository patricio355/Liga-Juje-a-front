import { useState } from "react";
import { editarUsuario } from "../../api/usuarios.api";

export default function ModalEditarUsuario({ usuario, onClose, onUpdated }) {

    const [nombre, setNombre] = useState(usuario.nombre || "");
    const [email, setEmail] = useState(usuario.email || "");
    const [rol, setRol] = useState(usuario.rol || "");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const validar = () => {
        if (!nombre.trim()) {
            return "El nombre no puede estar vacío";
        }

        if (!email.trim()) {
            return "El email no puede estar vacío";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return "El email no tiene un formato válido";
        }

        if (!rol) {
            return "Debe seleccionar un rol";
        }

        return null;
    };

    const guardar = async () => {
        setError(null);

        const errorValidacion = validar();
        if (errorValidacion) {
            setError(errorValidacion);
            return;
        }

        setLoading(true);

        try {
            await editarUsuario(usuario.id, {
                nombre: nombre.trim(),
                email: email.trim(),
                rol,
            });

            onUpdated();
            onClose();

        } catch (e) {
            setError(e.message || "Error al editar usuario");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div
                className="bg-[#1c213b] p-6 rounded-xl w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold mb-4">
                    Editar usuario
                </h2>

                <p className="text-sm text-gray-400 mb-4">
                    {usuario.email}
                </p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 mb-4 rounded text-sm">
                        {error}
                    </div>
                )}

                {/* NOMBRE */}
                <input
                    value={nombre}
                    placeholder="Nombre *"
                    className="w-full mb-3 px-3 py-2 bg-gray-700 rounded outline-none"
                    onChange={e => setNombre(e.target.value)}
                />

                {/* EMAIL */}
                <input
                    value={email}
                    placeholder="Email *"
                    type="email"
                    className="w-full mb-3 px-3 py-2 bg-gray-700 rounded outline-none"
                    onChange={e => setEmail(e.target.value)}
                />

                {/* ROL */}
                <select
                    value={rol}
                    className="w-full mb-4 px-3 py-2 bg-gray-700 rounded outline-none"
                    onChange={e => setRol(e.target.value)}
                >
                    <option value="ADMIN">ADMIN</option>
                    <option value="ENCARGADOEQUIPO">ENCARGADO EQUIPO</option>
                    <option value="ENCARGADOTORNEO">ENCARGADO TORNEO</option>
                    <option value="ARBITRO">ARBITRO</option>
                    <option value="VEEDOR">VEEDOR</option>
                </select>

                {/* BOTONES */}
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-500 transition"
                        disabled={loading}
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={guardar}
                        className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 transition disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? "Guardando..." : "Guardar"}
                    </button>
                </div>
            </div>
        </div>
    );
}
