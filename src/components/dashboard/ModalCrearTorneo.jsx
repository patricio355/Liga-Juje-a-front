import { useContext, useState, useEffect } from "react";
import { apiFetch } from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import { FaTrophy, FaCheckCircle, FaChartLine, FaUserAlt, FaQuestionCircle } from "react-icons/fa";

export default function ModalCrearTorneo({ onClose, onCreated }) {
    const { user } = useContext(AuthContext);
    const esAdmin = user?.role === "ROLE_ADMIN" || user?.role === "ADMIN";

    const [nombre, setNombre] = useState("");
    // 1. Cambiamos el estado inicial a vacío
    const [division, setDivision] = useState("");
    const [encargadoEmail, setEncargadoEmail] = useState("");
    const [estado, setEstado] = useState("activo");
    const [tipo, setTipo] = useState("CERRADO");

    const [puntosGanador, setPuntosGanador] = useState(3);
    const [puntosEmpate, setPuntosEmpate] = useState(1);

    const [listaEncargados, setListaEncargados] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cargarEncargados = async () => {
            try {
                const data = await apiFetch("/api/usuarios/encargados");
                if (data) setListaEncargados(data);
            } catch (e) {
                console.error("Error cargando encargados:", e);
            }
        };
        cargarEncargados();
    }, []);

    const crearTorneo = async (e) => {
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
                // 2. Si es string vacío, enviamos null al backend
                division: division || null,
                estado,
                tipo,
                puntosGanador: Number(puntosGanador),
                puntosEmpate: Number(puntosEmpate),
                encargadoEmail: encargadoEmail || null
            };

            await apiFetch("/api/torneos", {
                method: "POST",
                body: JSON.stringify(payload),
            });

            if (onCreated) await onCreated();
            onClose();
        } catch (e) {
            setError(e.message || "Error al crear torneo");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-[#040714]/95 backdrop-blur-md flex items-center justify-center z-[200] p-4" onClick={onClose}>
            <form
                className="bg-[#0a0f2c] border border-cyan-500/30 rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden max-h-[95vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
                onSubmit={crearTorneo}
            >
                <div className="bg-[#0d143d] px-8 py-7 border-b border-slate-800">
                    <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                        <FaTrophy className="text-cyan-500" size={20} /> Crear Torneo
                    </h2>
                    <p className="text-[10px] font-bold text-cyan-500 uppercase tracking-[0.2em] mt-1">
                        Configuración de Nueva Competición
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
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Nombre de la Competición</label>
                            <input
                                placeholder="EJ. TORNEO APERTURA 2026"
                                className="w-full px-5 py-3.5 bg-[#040714] border border-slate-800 rounded-xl outline-none focus:border-cyan-500 text-sm font-medium text-white placeholder:text-slate-800 transition-all"
                                value={nombre}
                                onChange={e => setNombre(e.target.value.toUpperCase())}
                            />
                        </div>

                        {/* División (AHORA OPCIONAL) */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">División</label>
                            <select
                                className="w-full px-5 py-3.5 bg-[#040714] border border-slate-800 rounded-xl outline-none focus:border-cyan-500 text-sm font-bold text-white appearance-none cursor-pointer"
                                value={division}
                                onChange={e => setDivision(e.target.value)}
                            >
                                {/* 3. Opción de dejarlo vacío */}
                                <option value="" className="bg-[#0a0f2c]">SIN ESPECIFICAR</option>
                                {["A", "B", "C", "D", "E"].map(d => (
                                    <option key={d} value={d} className="bg-[#0a0f2c]">DIVISIÓN {d}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2 ml-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Modalidad</label>
                                <div className="group relative">
                                    <FaQuestionCircle className="text-slate-600 hover:text-cyan-500 transition-colors cursor-help" size={12} />
                                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 p-2 bg-slate-900 border border-slate-700 rounded-lg text-[9px] text-slate-300 font-medium leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl">
                                        <b className="text-cyan-400">ABIERTO:</b> Los equipos pueden inscribirse libremente.<br/>
                                        <b className="text-cyan-400">CERRADO:</b> Solo equipos seleccionados por la administración.
                                    </div>
                                </div>
                            </div>
                            <select
                                className="w-full px-5 py-3.5 bg-[#040714] border border-slate-800 rounded-xl outline-none focus:border-cyan-500 text-sm font-bold text-white appearance-none cursor-pointer"
                                value={tipo}
                                onChange={e => setTipo(e.target.value)}
                            >
                                <option value="CERRADO" className="bg-[#0a0f2c]">CERRADO</option>
                                <option value="ABIERTO" className="bg-[#0a0f2c]">ABIERTO</option>
                            </select>
                        </div>

                        <div className="col-span-2 flex items-center gap-3 pt-2">
                            <FaChartLine className="text-cyan-500/50" size={12} />
                            <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest">Sistema de Puntuación</span>
                            <div className="h-px bg-slate-800/50 flex-1"></div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Pts. Victoria</label>
                            <input
                                type="number"
                                className="w-full px-5 py-3.5 bg-[#040714] border border-slate-800 rounded-xl outline-none focus:border-cyan-500 text-sm font-black text-cyan-400 text-center transition-all"
                                value={puntosGanador}
                                onChange={e => setPuntosGanador(e.target.value)}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Pts. Empate</label>
                            <input
                                type="number"
                                className="w-full px-5 py-3.5 bg-[#040714] border border-slate-800 rounded-xl outline-none focus:border-cyan-500 text-sm font-black text-cyan-400 text-center transition-all"
                                value={puntosEmpate}
                                onChange={e => setPuntosEmpate(e.target.value)}
                            />
                        </div>

                        <div className="col-span-2 py-1">
                            <div className="h-px bg-slate-800/50 w-full"></div>
                        </div>

                        <div className="col-span-2 space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Visibilidad inicial</label>
                            <select
                                className="w-full px-5 py-3.5 bg-[#040714] border border-slate-800 rounded-xl outline-none focus:border-cyan-500 text-sm font-bold text-white appearance-none cursor-pointer"
                                value={estado}
                                onChange={e => setEstado(e.target.value)}
                            >
                                <option value="activo" className="bg-[#0a0f2c]">PUBLICADO (ACTIVO)</option>
                                <option value="inactivo" className="bg-[#0a0f2c]">BORRADOR (INACTIVO)</option>
                            </select>
                        </div>

                        {esAdmin && (
                            <div className="col-span-2 space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <FaUserAlt size={10} className="text-cyan-500" /> Responsable del Torneo
                                </label>
                                <select
                                    className="w-full px-5 py-3.5 bg-[#040714] border border-slate-800 rounded-xl outline-none focus:border-cyan-500 text-[11px] font-bold text-cyan-400 appearance-none cursor-pointer"
                                    value={encargadoEmail}
                                    onChange={e => setEncargadoEmail(e.target.value)}
                                >
                                    <option value="" className="bg-[#0a0f2c]">SIN ENCARGADO ASIGNADO (VACÍO)</option>
                                    {listaEncargados.map(enc => (
                                        <option key={enc.id} value={enc.email} className="bg-[#0a0f2c]">
                                            {enc.nombre.toUpperCase()} — {enc.email}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
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
                            className="flex-1 py-4 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-[11px] font-bold uppercase tracking-widest text-white transition-all shadow-lg shadow-cyan-900/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? "GUARDANDO..." : <><FaCheckCircle size={14} /> CREAR TORNEO</>}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}