import { useState } from "react";
import { crearUsuario } from "../../api/usuarios.api";

export default function ModalCrearUsuario({ onClose, onCreated }) {

    const [form, setForm] = useState({
        nombre: "",
        email: "",
        rol: "ENCARGADOEQUIPO",
        password: ""
    });

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const validar = () => {
        if (!form.nombre.trim()) {
            return "El nombre es obligatorio";
        }

        if (!form.email.trim()) {
            return "El email es obligatorio";
        }

        // Validación simple de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            return "El email no tiene un formato válido";
        }

        if (!form.password.trim()) {
            return "La contraseña es obligatoria";
        }

        if (form.password.length < 6) {
            return "La contraseña debe tener al menos 6 caracteres";
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
            await crearUsuario({
                usuario: {
                    nombre: form.nombre.trim(),
                    email: form.email.trim(),
                    rol: form.rol,
                },
                password: form.password,
            });

            onCreated();
            onClose();

        } catch (e) {
            setError(e.message || "Error al crear usuario");
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
                    Crear Usuario
                </h2>

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 mb-4 rounded text-sm">
                        {error}
                    </div>
                )}

                {/* NOMBRE */}
                <input
                    placeholder="Nombre *"
                    className="w-full mb-3 px-3 py-2 bg-gray-700 rounded outline-none"
                    value={form.nombre}
                    onChange={e =>
                        setForm({ ...form, nombre: e.target.value })
                    }
                />

                {/* EMAIL */}
                <input
                    placeholder="Email *"
                    type="email"
                    className="w-full mb-3 px-3 py-2 bg-gray-700 rounded outline-none"
                    value={form.email}
                    onChange={e =>
                        setForm({ ...form, email: e.target.value })
                    }
                />

                {/* PASSWORD */}
                <input
                    type="password"
                    placeholder="Contraseña *"
                    className="w-full mb-3 px-3 py-2 bg-gray-700 rounded outline-none"
                    value={form.password}
                    onChange={e =>
                        setForm({ ...form, password: e.target.value })
                    }
                />

                {/* ROL */}
                <select
                    className="w-full mb-4 px-3 py-2 bg-gray-700 rounded outline-none"
                    value={form.rol}
                    onChange={e =>
                        setForm({ ...form, rol: e.target.value })
                    }
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
                        {loading ? "Creando..." : "Crear"}
                    </button>
                </div>
            </div>
        </div>
    );
}
