import { useState, useEffect, useContext } from "react";
import { apiFetch } from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import { FaTrophy, FaCheckCircle, FaTimes, FaLock, FaLayerGroup } from "react-icons/fa";

export default function ModalEditarTorneo({ torneo, onClose, onUpdated }) {
    const { user } = useContext(AuthContext);

    // Normalización de roles para control de permisos
    const miRol = user?.role?.toUpperCase().replace("ROLE_", "") || "";
    const esAdminGenuino = miRol === "ADMIN";

    const [nombre, setNombre] = useState("");
    const [division, setDivision] = useState("");
    const [encargadoEmail, setEncargadoEmail] = useState("");
    const [estado, setEstado] = useState("activo");
    const [tipo, setTipo] = useState("ABIERTO");

    const [listaEncargados, setListaEncargados] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (torneo) {
            setNombre(torneo.nombre || "");
            setDivision(torneo.division || "");
            setEncargadoEmail(torneo.encargadoEmail || "");
            setEstado(torneo.estado?.toLowerCase() || "activo");
            setTipo(torneo.tipo || "ABIERTO");
        }

        // Solo cargamos la lista si realmente es un ADMIN el que edita
        if (esAdminGenuino) {
            const cargarEncargados = async () => {
                try {
                    const data = await apiFetch("/api/usuarios/encargados");
                    if (data && Array.isArray(data)) setListaEncargados(data);
                } catch (e) {
                    console.error("Error cargando encargados:", e);
                }
            };
            cargarEncargados();
        }
    }, [torneo, esAdminGenuino]);

    const actualizarTorneo = async (e) => {
        if (e) e.preventDefault();
        if (!nombre.trim()) {
            setError("El nombre es obligatorio");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const payload = {
                nombre: nombre.trim(),
                division: division || null,
                estado,
                tipo,
            };

            // Solo enviamos el email del encargado si el admin lo cambió
            if (esAdminGenuino) {
                payload.encargadoEmail = encargadoEmail || null;
            }

            await apiFetch(`/api/torneos/${torneo.id}`, {
                method: "PUT",
                body: JSON.stringify(payload),
            });

            if (onUpdated) await onUpdated();
            onClose();
        } catch (e) {
            setError(e.message || "Error al actualizar torneo");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-[#040714]/95 backdrop-blur-md flex items-center justify-center z-[200] p-4" onClick={onClose}>
            <form
                className="bg-[#0a0f2c] border border-cyan-500/30 rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden max-h-[95vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
                onSubmit={actualizarTorneo}
            >
                {/* Header Estilo Champions Admin */}
                <div className="bg-[#0d143d] px-8 py-7 border-b border-slate-800 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                            <FaTrophy className="text-cyan-500" size={20} /> Editar Torneo
                        </h2>
                        <p className="text-[10px] font-bold text-cyan-500 uppercase tracking-[0.2em] mt-1">
                            Panel de Configuración
                        </p>
                    </div>
                    <button onClick={onClose} type="button" className="p-2 text-slate-500 hover:text-white transition-colors">
                        <FaTimes size={20} />
                    </button>
                </div>

                <div className="p-8">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 mb-6 rounded-xl text-[11px] font-bold uppercase tracking-wider text-center">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-5">

                        {/* Info Bloqueada: Modalidad */}
                        <div className="col-span-2 bg-[#040714] p-4 rounded-2xl border border-slate-800 flex items-center justify-between shadow-inner">
                            <div>
                                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Modalidad (No editable)</p>
                                <p className="text-sm font-black text-cyan-500 uppercase italic tracking-widest">{tipo}</p>
                            </div>
                            <FaLock className="text-slate-800" size={14} />
                        </div>

                        {/* Nombre */}
                        <div className="col-span-2 space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Nombre de la Competición</label>
                            <input
                                placeholder="NOMBRE DEL TORNEO"
                                className="w-full px-5 py-3.5 bg-[#040714] border border-slate-800 rounded-xl outline-none focus:border-cyan-500 text-sm font-medium text-white transition-all"
                                value={nombre}
                                onChange={e => setNombre(e.target.value.toUpperCase())}
                            />
                        </div>

                        {/* División */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">División</label>
                            <div className="relative">
                                <select
                                    className="w-full px-5 py-3.5 bg-[#040714] border border-slate-800 rounded-xl outline-none focus:border-cyan-500 text-sm font-bold text-white appearance-none cursor-pointer"
                                    value={division}
                                    onChange={e => setDivision(e.target.value)}
                                >
                                    <option value="" className="bg-[#0a0f2c]">SIN ESPECIFICAR</option>
                                    {["A", "B", "C", "D", "E"].map(d => (
                                        <option key={d} value={d} className="bg-[#0a0f2c]">DIVISIÓN {d}</option>
                                    ))}
                                </select>
                                <FaLayerGroup className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700 pointer-events-none" size={12} />
                            </div>
                        </div>

                        {/* Estado */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Estado de Competición</label>
                            <select
                                className="w-full px-5 py-3.5 bg-[#040714] border border-slate-800 rounded-xl outline-none focus:border-cyan-500 text-sm font-bold text-white appearance-none cursor-pointer"
                                value={estado}
                                onChange={e => setEstado(e.target.value)}
                            >
                                <option value="activo" className="bg-[#0a0f2c]">ACTIVO (VISIBLE)</option>
                                <option value="inactivo" className="bg-[#0a0f2c]">INACTIVO (BORRADOR)</option>
                            </select>
                        </div>

                        {/* SECCIÓN DE ENCARGADO ELIMINADA PARA NO-ADMINS */}
                        {esAdminGenuino && (
                            <>
                                <div className="col-span-2 py-2 flex items-center gap-3">
                                    <div className="h-px bg-slate-800 flex-1"></div>
                                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Administración Central</span>
                                    <div className="h-px bg-slate-800 flex-1"></div>
                                </div>

                                <div className="col-span-2 space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        Reasignar Responsable
                                    </label>
                                    <select
                                        className="w-full px-5 py-3.5 bg-[#040714] border border-slate-800 rounded-xl outline-none focus:border-cyan-500 text-[11px] font-bold text-cyan-400 appearance-none cursor-pointer"
                                        value={encargadoEmail}
                                        onChange={e => setEncargadoEmail(e.target.value)}
                                    >
                                        <option value="" className="bg-[#0a0f2c]">SIN ENCARGADO (VACÍO)</option>
                                        {listaEncargados.map(enc => (
                                            <option key={enc.id || enc.email} value={enc.email} className="bg-[#0a0f2c]">
                                                {enc.nombre.toUpperCase()} — {enc.email}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex gap-4 mt-10">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 rounded-xl text-[11px] font-bold uppercase tracking-widest text-slate-500 border border-slate-800 hover:bg-slate-800 hover:text-white transition-all active:scale-95"
                            disabled={loading}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-4 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-[11px] font-bold uppercase tracking-widest text-white transition-all shadow-lg shadow-cyan-900/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? "ACTUALIZANDO..." : <><FaCheckCircle size={14} /> GUARDAR CAMBIOS</>}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}