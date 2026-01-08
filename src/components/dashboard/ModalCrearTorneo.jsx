import { useContext, useState, useEffect } from "react"; // Añadimos useEffect
import { apiFetch } from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import { FaTrophy, FaUserAlt, FaCheckCircle, FaTimes, FaQuestionCircle, FaStar } from "react-icons/fa";

export default function ModalCrearTorneo({ onClose, onCreated }) {
    const { user } = useContext(AuthContext);
    const esAdmin = user?.role === "ROLE_ADMIN";

    const [nombre, setNombre] = useState("");
    const [division, setDivision] = useState("A");
    const [encargadoEmail, setEncargadoEmail] = useState("");
    const [estado, setEstado] = useState("activo");
    const [tipo, setTipo] = useState("CERRADO");

    // NUEVOS ESTADOS PARA PUNTOS (Valores por defecto estándar)
    const [puntosGanador, setPuntosGanador] = useState(3);
    const [puntosEmpate, setPuntosEmpate] = useState(1);

    // NUEVO ESTADO PARA LA LISTA DE ENCARGADOS
    const [listaEncargados, setListaEncargados] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // CARGAR ENCARGADOS AL ABRIR EL MODAL
    useEffect(() => {
        if (esAdmin) {
            const cargarEncargados = async () => {
                try {
                    const data = await apiFetch("/api/usuarios/encargados");
                    if (data) setListaEncargados(data);
                } catch (e) {
                    console.error("Error cargando encargados:", e);
                }
            };
            cargarEncargados();
        }
    }, [esAdmin]);

    const crearTorneo = async () => {
        if (!nombre.trim()) {
            setError("El nombre es obligatorio");
            return;
        }
        setLoading(true);
        setError(null);

        try {
            // Incluimos los nuevos campos en el payload
            const payload = {
                nombre,
                division,
                estado,
                tipo,
                puntosGanador: Number(puntosGanador),
                puntosEmpate: Number(puntosEmpate)
            };

            if (esAdmin) payload.encargadoEmail = encargadoEmail;

            await apiFetch("/api/torneos", {
                method: "POST",
                body: JSON.stringify(payload),
            });

            if (onCreated) {
                await onCreated();
            }

            onClose();
        } catch (e) {
            setError(e.message || "Error al crear torneo");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-[#0f172a]/90 backdrop-blur-sm flex items-center justify-center z-[200] p-4" onClick={onClose}>
            <div className="bg-[#1e293b] w-full max-w-md rounded-[2rem] border border-slate-700/50 shadow-2xl overflow-hidden max-h-[95vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <div className="bg-[#111827]/50 px-8 py-5 border-b border-slate-700/50 flex justify-between items-center sticky top-0 z-10 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 rounded-lg">
                            <FaTrophy className="text-emerald-500" />
                        </div>
                        <h2 className="text-xs font-black uppercase italic tracking-widest text-white leading-none">Nuevo Torneo</h2>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors"><FaTimes size={18} /></button>
                </div>

                <div className="p-8 space-y-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-[10px] font-bold uppercase text-center">{error}</div>
                    )}

                    <div className="space-y-5">
                        {/* Nombre */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nombre de la Competición</label>
                            <input
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                placeholder="Ej: Torneo Apertura 2026"
                                className="w-full h-12 bg-[#0f172a] border border-slate-700/50 px-4 rounded-xl focus:border-emerald-500 text-sm text-slate-200 outline-none transition-all placeholder:text-slate-700"
                            />
                        </div>

                        {/* División y Modalidad */}
                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">División</label>
                                <select value={division} onChange={(e) => setDivision(e.target.value)} className="w-full h-12 bg-[#0f172a] border border-slate-700/50 px-4 rounded-xl text-sm text-slate-200 outline-none appearance-none focus:border-emerald-500 cursor-pointer">
                                    {["A", "B", "C", "D", "E"].map(d => <option key={d} value={d}>División {d}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Modalidad</label>
                                <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="w-full h-12 bg-[#0f172a] border border-slate-700/50 px-4 rounded-xl text-sm text-slate-200 outline-none focus:border-emerald-500 appearance-none cursor-pointer">
                                    <option value="ABIERTO">Abierto</option>
                                    <option value="CERRADO">Cerrado</option>
                                </select>
                            </div>
                        </div>

                        {/* CONFIGURACIÓN DE PUNTOS */}
                        <div className="pt-2">
                            <label className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] ml-1 mb-3 block">Reglas de Puntuación</label>
                            <div className="grid grid-cols-2 gap-5 p-4 bg-[#0f172a]/50 rounded-2xl border border-slate-700/30">
                                <div className="space-y-2 text-center">
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Victoria</span>
                                    <input
                                        type="number"
                                        value={puntosGanador}
                                        onChange={(e) => setPuntosGanador(e.target.value)}
                                        className="w-full h-10 bg-[#02040a] border border-slate-700 rounded-lg text-center font-black text-emerald-500 outline-none focus:border-emerald-500"
                                    />
                                </div>
                                <div className="space-y-2 text-center">
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Empate</span>
                                    <input
                                        type="number"
                                        value={puntosEmpate}
                                        onChange={(e) => setPuntosEmpate(e.target.value)}
                                        className="w-full h-10 bg-[#02040a] border border-slate-700 rounded-lg text-center font-black text-emerald-500 outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Visibilidad y Encargado (CAMBIADO A SELECT) */}
                        <div className="space-y-4 pt-2">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Visibilidad</label>
                                <select value={estado} onChange={(e) => setEstado(e.target.value)} className="w-full h-12 bg-[#0f172a] border border-slate-700/50 px-4 rounded-xl text-sm text-slate-200 outline-none focus:border-emerald-500 appearance-none cursor-pointer">
                                    <option value="activo">Publicado (Activo)</option>
                                    <option value="inactivo">Borrador (Inactivo)</option>
                                </select>
                            </div>

                            {esAdmin && (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <FaUserAlt size={10} className="text-emerald-500" /> Asignar Encargado
                                    </label>
                                    <select
                                        value={encargadoEmail}
                                        onChange={(e) => setEncargadoEmail(e.target.value)}
                                        className="w-full h-12 bg-[#0f172a] border border-slate-700/50 px-4 rounded-xl text-sm text-slate-200 outline-none focus:border-emerald-500 appearance-none cursor-pointer"
                                    >
                                        <option value="">Seleccione un encargado...</option>
                                        {listaEncargados.map(enc => (
                                            <option key={enc.id} value={enc.email}>
                                                {enc.nombre} ({enc.email})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-4 pt-4">
                        <button className="flex-1 h-12 bg-[#0f172a] text-slate-500 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:text-white transition-all border border-slate-700/50" onClick={onClose}>Cancelar</button>
                        <button
                            className="flex-[1.5] h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-emerald-900/20 flex items-center justify-center gap-2 disabled:opacity-50"
                            onClick={crearTorneo}
                            disabled={loading}
                        >
                            {loading ? <span className="animate-pulse">Guardando...</span> : <><FaCheckCircle size={14} /> Crear Torneo</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}