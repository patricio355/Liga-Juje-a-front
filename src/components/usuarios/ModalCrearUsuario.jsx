import { useState, useContext, useEffect } from "react";
import { createPortal } from "react-dom";
import { crearUsuario } from "../../api/usuarios.api";
import { AuthContext } from "../../context/AuthContext";
import { FaUserPlus, FaTimes, FaMapMarkerAlt, FaEnvelope, FaIdCard, FaPhoneAlt, FaUserShield, FaLock } from "react-icons/fa";

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

    const [password, setPassword] = useState("123");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
    }, []);

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

        if (!form.nombre.trim()) { setError("El nombre es obligatorio"); return; }
        if (!form.email.trim()) { setError("El email es obligatorio"); return; }
        if (!form.rol) { setError("Debes seleccionar un rango para el miembro"); return; }

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

    return createPortal(
        <div
            className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-[999999] p-2 md:p-6"
            onClick={onClose}
        >
            <form
                className="bg-[#05070a] border border-white/10 rounded-[2.5rem] w-full max-w-xl shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden flex flex-col max-h-[95vh] relative animate-in fade-in zoom-in duration-200"
                onClick={(e) => e.stopPropagation()}
                onSubmit={guardar}
            >
                {/* Header Fijo */}
                <div className="bg-[#0a0c10] px-8 py-6 border-b border-white/5 flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic flex items-center gap-3">
                            <FaUserPlus className="text-slate-400" size={22} /> Registrar Miembro
                        </h2>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-1">
                            Alta de personal administrativo
                        </p>
                    </div>
                    <button type="button" onClick={onClose} className="text-slate-600 hover:text-white transition-colors p-2 bg-white/5 rounded-full">
                        <FaTimes size={18} />
                    </button>
                </div>

                {/* Body con Scroll Interno */}
                <div className="p-6 md:p-10 overflow-y-auto custom-scrollbar bg-[#05070a] flex-1">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 mb-6 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2 space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nombre Completo</label>
                            <input
                                placeholder="JUAN PÉREZ"
                                className="w-full px-6 py-4 bg-black border border-white/10 rounded-2xl outline-none focus:border-slate-400 text-sm font-black text-white italic uppercase placeholder:text-slate-900"
                                value={form.nombre}
                                onChange={e => setForm({ ...form, nombre: e.target.value.toUpperCase() })}
                            />
                        </div>

                        <div className={`space-y-2 ${esAdminGenuino ? "col-span-1" : "col-span-2"}`}>
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <FaEnvelope size={10}/> Email
                            </label>
                            <input
                                type="email"
                                placeholder="usuario@email.com"
                                className="w-full px-6 py-4 bg-black border border-white/10 rounded-2xl outline-none focus:border-slate-400 text-xs font-medium text-slate-300"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                            />
                        </div>

                        {esAdminGenuino && (
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <FaLock size={10}/> Contraseña
                                </label>
                                <input
                                    type="password"
                                    placeholder="••••"
                                    className="w-full px-6 py-4 bg-black border border-white/10 rounded-2xl outline-none focus:border-slate-400 text-sm font-black text-white"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </div>
                        )}

                        <div className="col-span-2 py-2"><div className="h-px bg-white/5 w-full"></div></div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <FaIdCard size={10}/> DNI (Opcional)
                            </label>
                            <input
                                placeholder="12.345.678"
                                className="w-full px-6 py-4 bg-black border border-white/10 rounded-2xl outline-none focus:border-slate-400 text-xs font-black text-white italic"
                                value={form.dni}
                                onChange={e => setForm({ ...form, dni: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <FaPhoneAlt size={10}/> Teléfono
                            </label>
                            <input
                                placeholder="388 4..."
                                className="w-full px-6 py-4 bg-black border border-white/10 rounded-2xl outline-none focus:border-slate-400 text-xs font-medium text-slate-300"
                                value={form.telefono}
                                onChange={e => setForm({ ...form, telefono: e.target.value })}
                            />
                        </div>

                        {/* CAMPO DE DOMICILIO AÑADIDO */}
                        <div className="col-span-2 space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <FaMapMarkerAlt size={10}/> Domicilio Actual
                            </label>
                            <input
                                placeholder="CALLE, BARRIO, CIUDAD"
                                className="w-full px-6 py-4 bg-black border border-white/10 rounded-2xl outline-none focus:border-slate-400 text-xs font-black text-white italic uppercase placeholder:text-slate-900"
                                value={form.domicilio}
                                onChange={e => setForm({ ...form, domicilio: e.target.value.toUpperCase() })}
                            />
                        </div>

                        <div className="col-span-2 space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <FaUserShield size={10}/> Rango del Miembro
                            </label>
                            <select
                                className="w-full px-6 py-4 bg-black border border-white/10 rounded-2xl outline-none focus:border-slate-400 text-xs font-black text-white appearance-none cursor-pointer uppercase italic shadow-inner"
                                value={form.rol}
                                onChange={e => setForm({ ...form, rol: e.target.value })}
                            >
                                <option value="" disabled>--- SELECCIONAR RANGO ---</option>
                                {renderOptions().map(op => (
                                    <option key={op.val} value={op.val} className="bg-black">
                                        {op.lab}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Footer Fijo */}
                <div className="p-8 bg-[#0a0c10] border-t border-white/5 flex gap-4 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 border border-white/5 hover:bg-white/5 transition-all shadow-lg"
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-5 bg-gradient-to-r from-slate-200 to-slate-400 hover:from-white hover:to-slate-300 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-black transition-all shadow-[0_10px_30px_rgba(0,0,0,0.5)] active:scale-95 disabled:opacity-50"
                    >
                        {loading ? "REGISTRANDO..." : "REGISTRAR ALTA"}
                    </button>
                </div>
            </form>
        </div>,
        document.body
    );
}