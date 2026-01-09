import { useState, useContext } from "react";
import { crearUsuario } from "../../api/usuarios.api";
import { AuthContext } from "../../context/AuthContext"; // Usamos el contexto para ser consistentes

export default function ModalCrearUsuario({ onClose, onCreated }) {
    const { user } = useContext(AuthContext);

    // Normalizamos el rol del usuario logueado
    const miRol = user?.role?.toUpperCase().replace("ROLE_", "") || "";

    const [form, setForm] = useState({
        nombre: "",
        email: "",
        rol: "ENCARGADOEQUIPO",
        password: "",
        dni: "",
        telefono: "",
        domicilio: ""
    });

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const renderOptions = () => {
        const rolesBase = [
            { val: "ENCARGADOEQUIPO", lab: "ENCARGADO EQUIPO" },
            { val: "ARBITRO", lab: "ÁRBITRO" },
            { val: "VEEDOR", lab: "VEEDOR" }
        ];

        // Si es ADMIN, habilitamos los rangos superiores
        if (miRol === "ADMIN") {
            return [
                { val: "ADMIN", lab: "ADMINISTRADOR" },
                { val: "ENCARGADOTORNEO", lab: "ENCARGADO TORNEO" },
                ...rolesBase
            ];
        }
        return rolesBase;
    };

    const guardar = async (e) => {
        if(e) e.preventDefault();
        setError(null);

        if (!form.nombre.trim()) { setError("El nombre es obligatorio"); return; }
        if (!form.email.trim()) { setError("El email es obligatorio"); return; }
        if (form.password.length < 6) { setError("Contraseña mínima 6 caracteres"); return; }

        setLoading(true);
        try {
            await crearUsuario({
                usuario: {
                    nombre: form.nombre.trim(),
                    email: form.email.trim(),
                    rol: form.rol,
                    dni: form.dni.trim() || null,
                    telefono: form.telefono.trim() || null,
                    domicilio: form.domicilio.trim() || null
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
        <div className="fixed inset-0 bg-[#040714]/95 backdrop-blur-md flex items-center justify-center z-[100] p-4" onClick={onClose}>
            <form
                className="bg-[#0a0f2c] border border-cyan-500/30 rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                onSubmit={guardar}
            >
                {/* Header Estilo Champions Admin */}
                <div className="bg-[#0d143d] px-8 py-7 border-b border-slate-800">
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                        Crear Usuario
                    </h2>
                    <p className="text-[10px] font-bold text-cyan-500 uppercase tracking-[0.2em] mt-1">
                        Formulario de Alta
                    </p>
                </div>

                <div className="p-8">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 mb-6 rounded-xl text-[11px] font-bold uppercase tracking-wider text-center">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-5">
                        <div className="col-span-2 space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Nombre Completo</label>
                            <input
                                placeholder="EJ. JUAN PÉREZ"
                                className="w-full px-5 py-3.5 bg-[#040714] border border-slate-800 rounded-xl outline-none focus:border-cyan-500 text-sm font-medium text-white placeholder:text-slate-800 transition-all"
                                value={form.nombre}
                                onChange={e => setForm({ ...form, nombre: e.target.value })}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email Acceso</label>
                            <input
                                type="email"
                                placeholder="USUARIO@EMAIL.COM"
                                className="w-full px-5 py-3.5 bg-[#040714] border border-slate-800 rounded-xl outline-none focus:border-cyan-500 text-sm font-medium text-white placeholder:text-slate-800 transition-all"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Contraseña</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full px-5 py-3.5 bg-[#040714] border border-slate-800 rounded-xl outline-none focus:border-cyan-500 text-sm font-medium text-white placeholder:text-slate-800 transition-all"
                                value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                            />
                        </div>

                        <div className="col-span-2 py-1">
                            <div className="h-px bg-slate-800/50 w-full"></div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">DNI (Opcional)</label>
                            <input
                                placeholder="DOCUMENTO"
                                className="w-full px-5 py-3.5 bg-[#040714] border border-slate-800 rounded-xl outline-none focus:border-cyan-500 text-sm font-medium text-white placeholder:text-slate-800 transition-all"
                                value={form.dni}
                                onChange={e => setForm({ ...form, dni: e.target.value })}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Teléfono</label>
                            <input
                                placeholder="TELÉFONO"
                                className="w-full px-5 py-3.5 bg-[#040714] border border-slate-800 rounded-xl outline-none focus:border-cyan-500 text-sm font-medium text-white placeholder:text-slate-800 transition-all"
                                value={form.telefono}
                                onChange={e => setForm({ ...form, telefono: e.target.value })}
                            />
                        </div>

                        <div className="col-span-2 space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Rango del Miembro</label>
                            <select
                                className="w-full px-5 py-3.5 bg-[#040714] border border-slate-800 rounded-xl outline-none focus:border-cyan-500 text-sm font-bold text-cyan-400 appearance-none cursor-pointer shadow-inner"
                                value={form.rol}
                                onChange={e => setForm({ ...form, rol: e.target.value })}
                            >
                                {renderOptions().map(op => (
                                    <option key={op.val} value={op.val} className="bg-[#0a0f2c] text-white">
                                        {op.lab}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-4 mt-10">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 rounded-xl text-[11px] font-bold uppercase tracking-widest text-slate-500 border border-slate-800 hover:bg-slate-800 hover:text-white transition-all"
                            disabled={loading}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-4 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-[11px] font-bold uppercase tracking-widest text-white transition-all shadow-lg shadow-cyan-900/20 active:scale-95 disabled:opacity-50"
                        >
                            {loading ? "Registrando..." : "Registrar Alta"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}