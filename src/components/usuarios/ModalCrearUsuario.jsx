import { useState, useContext } from "react";
import { crearUsuario } from "../../api/usuarios.api";
import { AuthContext } from "../../context/AuthContext";

export default function ModalCrearUsuario({ onClose, onCreated }) {
    const { user } = useContext(AuthContext);
    const miRol = user?.role?.toUpperCase().replace("ROLE_", "") || "";
    const esAdminGenuino = miRol === "ADMIN";

    const [form, setForm] = useState({
        nombre: "",
        email: "",
        rol: "",
        dni: "",
        telefono: "",
        domicilio: ""
    });

    // Estado para la contraseña, por defecto "123"
    const [password, setPassword] = useState("123");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const renderOptions = () => {
        const rolesBase = [
            { val: "ENCARGADOEQUIPO", lab: "ENCARGADO EQUIPO" },
            { val: "ARBITRO", lab: "ÁRBITRO" },
            { val: "VEEDOR", lab: "VEEDOR" }
        ];

        if (esAdminGenuino) {
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

        // Validaciones esenciales
        if (!form.nombre.trim()) { setError("El nombre es obligatorio"); return; }
        if (!form.email.trim()) { setError("El email es obligatorio"); return; }
        if (!form.rol) { setError("Debes seleccionar un rango para el miembro"); return; }

        // Validación de contraseña solo si el admin intenta cambiarla
        if (esAdminGenuino && password.length < 3) {
            setError("La contraseña debe ser más larga");
            return;
        }

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
                // Si es admin envía lo ingresado, sino el "123" por defecto
                password: esAdminGenuino ? password : "123",
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
                <div className="bg-[#0d143d] px-8 py-7 border-b border-slate-800">
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                        Crear Usuario
                    </h2>

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

                        <div className={`space-y-1.5 ${esAdminGenuino ? "col-span-1" : "col-span-2"}`}>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email</label>
                            <input
                                type="email"
                                placeholder="USUARIO@EMAIL.COM"
                                className="w-full px-5 py-3.5 bg-[#040714] border border-slate-800 rounded-xl outline-none focus:border-cyan-500 text-sm font-medium text-white placeholder:text-slate-800 transition-all"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                            />
                        </div>

                        {/* SOLO APARECE SI ES ADMIN */}
                        {esAdminGenuino && (
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Contraseña</label>
                                <input
                                    type="password"
                                    placeholder="Personalizar..."
                                    className="w-full px-5 py-3.5 bg-[#040714] border border-slate-800 rounded-xl outline-none focus:border-cyan-500 text-sm font-medium text-white placeholder:text-slate-800 transition-all"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </div>
                        )}

                        <div className="col-span-2 py-1"><div className="h-px bg-slate-800/50 w-full"></div></div>

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
                                className={`w-full px-5 py-3.5 bg-[#040714] border border-slate-800 rounded-xl outline-none focus:border-cyan-500 text-sm font-bold appearance-none cursor-pointer shadow-inner transition-colors ${
                                    !form.rol ? "text-slate-600" : "text-cyan-400"
                                }`}
                                value={form.rol}
                                onChange={e => setForm({ ...form, rol: e.target.value })}
                            >
                                <option value="" disabled>--- SELECCIONAR RANGO ---</option>
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
                            className="flex-1 py-4 rounded-xl text-[11px] font-bold uppercase tracking-widest text-slate-500 border border-slate-800 hover:bg-slate-800 transition-all"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-4 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-[11px] font-bold uppercase tracking-widest text-white transition-all shadow-lg active:scale-95 disabled:opacity-50"
                        >
                            {loading ? "Registrando..." : "Registrar Alta"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}