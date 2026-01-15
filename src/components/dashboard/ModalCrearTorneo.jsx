import { useContext, useState, useEffect } from "react";
import { apiFetch } from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import { FaTrophy, FaChartLine, FaUserAlt, FaPalette, FaMars, FaVenus, FaVenusMars, FaInstagram } from "react-icons/fa";
import ImageUpload from "../../images/ImageUpload";

// 1. Definición de Plantillas Premium
const PLANTILLAS = {
    NEGRO: { p: "#05070a", s: "#0a0c10", tp: "#ffffff", ts: "#94a3b8" },
    AZUL: { p: "#050814", s: "#0d143d", tp: "#ffffff", ts: "#60a5fa" },
    ROJO: { p: "#0a0404", s: "#1a0808", tp: "#ffffff", ts: "#f87171" },
    VERDE: { p: "#040a05", s: "#081a0d", tp: "#ffffff", ts: "#4ade80" },
    MORADO: { p: "#08040a", s: "#160d1f", tp: "#ffffff", ts: "#a78bfa" },
    GRIS: { p: "#111827", s: "#1f2937", tp: "#ffffff", ts: "#d1d5db" },
    VIOLETA: { p: "#0f0514", s: "#1e0a29", tp: "#ffffff", ts: "#c084fc" },
    ROSADO: { p: "#0a0406", s: "#1f0d14", tp: "#ffffff", ts: "#f472b6" },
    DORADO: { p: "#0a0904", s: "#1a1808", tp: "#ffffff", ts: "#fbbf24" },
    ESMERALDA: { p: "#020617", s: "#0f172a", tp: "#ffffff", ts: "#10b981" }
};

export default function ModalCrearTorneo({ onClose, onCreated }) {
    const { user } = useContext(AuthContext);
    const esAdmin = user?.role === "ROLE_ADMIN" || user?.role === "ADMIN";

    // Estados
    const [nombre, setNombre] = useState("");
    const [division, setDivision] = useState("");
    const [encargadoEmail, setEncargadoEmail] = useState("");

    // Estado siempre activo por defecto (se eliminó el selector visual)
    const [estado, setEstado] = useState("activo");

    const [tipo, setTipo] = useState("CERRADO");
    const [puntosGanador, setPuntosGanador] = useState(3);
    const [puntosEmpate, setPuntosEmpate] = useState(1);
    const [plantillaActiva, setPlantillaActiva] = useState("NEGRO");
    const [fotoUrl, setFotoUrl] = useState("");
    const [genero, setGenero] = useState("MASCULINO");
    const [redSocial, setRedSocial] = useState("");

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
                division: division || null,
                estado,
                tipo,
                puntosGanador: Number(puntosGanador),
                puntosEmpate: Number(puntosEmpate),
                encargadoEmail: encargadoEmail || null,
                colorPrimario: PLANTILLAS[plantillaActiva].p,
                colorSecundario: PLANTILLAS[plantillaActiva].s,
                colorTextoPrimario: PLANTILLAS[plantillaActiva].tp,
                colorTextoSecundario: PLANTILLAS[plantillaActiva].ts,
                fotoUrl: fotoUrl || null,
                genero: genero,
                redSocial: redSocial || null
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
                className="bg-[#0a0f2c] border border-cyan-500/30 rounded-[2.5rem] w-full max-w-4xl shadow-2xl overflow-hidden max-h-[95vh] overflow-y-auto custom-scrollbar"
                onClick={(e) => e.stopPropagation()}
                onSubmit={crearTorneo}
            >
                {/* Header */}
                <div className="bg-[#0d143d] px-8 py-5 border-b border-slate-800">
                    <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                        <FaTrophy className="text-cyan-500" size={20} /> Crear Torneo
                    </h2>
                    <p className="text-[10px] font-bold text-cyan-500 uppercase tracking-[0.2em] mt-1">
                        Estilo Visual y Configuración
                    </p>
                </div>

                {/* Body */}
                <div className="p-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 mb-6 rounded-xl text-[11px] font-bold uppercase tracking-wider text-center">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        {/* --- FILA 1: FOTO y NOMBRE --- */}

                        {/* Columna 1: Logo */}
                        <div className="col-span-1 flex flex-col items-center justify-center border-b md:border-b-0 border-slate-800/50 pb-4 md:pb-0">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                                Logo Principal
                            </label>
                            <ImageUpload
                                currentImage={fotoUrl}
                                onUploadStart={() => setLoading(true)}
                                onUploadSuccess={(url) => {
                                    setFotoUrl(url);
                                    setLoading(false);
                                }}
                            />
                        </div>

                        {/* Columna 2: Nombre */}
                        <div className="col-span-1 flex flex-col justify-center space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                Nombre de la Competición
                            </label>
                            <input
                                placeholder="EJ. TORNEO APERTURA 2026"
                                className={`w-full px-5 py-3.5 bg-[#040714] border rounded-xl outline-none focus:border-cyan-500 text-sm font-medium text-white placeholder:text-slate-800 transition-all ${
                                    nombre.length > 0 && nombre.length < 6 ? "border-red-500/50" : "border-slate-800"
                                }`}
                                value={nombre}
                                minLength={6}
                                onChange={e => setNombre(e.target.value.toUpperCase())}
                            />
                            {nombre.length > 0 && nombre.length < 6 && (
                                <span className="text-[9px] text-red-500 font-bold uppercase tracking-tighter ml-1">
            Mínimo 6 caracteres (llevas {nombre.length})
        </span>
                            )}
                        </div>

                        {/* --- PLANTILLAS --- */}
                        <div className="col-span-1 md:col-span-2 space-y-3 pt-2 border-t border-slate-800/50">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <FaPalette className="text-cyan-500" /> Estilo de Plantilla
                            </label>
                            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                                {Object.keys(PLANTILLAS).map((key) => (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => setPlantillaActiva(key)}
                                        className={`h-12 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-1 group ${plantillaActiva === key ? "border-cyan-500 scale-105 shadow-[0_0_15px_rgba(6,182,212,0.3)]" : "border-slate-800 opacity-50 hover:opacity-100"}`}
                                        style={{ backgroundColor: PLANTILLAS[key].p }}
                                    >
                                        <div className="w-4 h-1 rounded-full" style={{ backgroundColor: PLANTILLAS[key].ts }}></div>
                                        <span className="text-[6px] md:text-[7px] font-black text-white uppercase tracking-tighter">{key}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="col-span-1 md:col-span-2 py-1">
                            <div className="h-px bg-slate-800/50 w-full"></div>
                        </div>

                        {/* División */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">División</label>
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
                        </div>

                        {/* Género */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                {genero === "MASCULINO" && <FaMars className="text-cyan-500"/>}
                                {genero === "FEMENINO" && <FaVenus className="text-pink-500"/>}
                                {genero === "MIXTO" && <FaVenusMars className="text-purple-500"/>}
                                Género
                            </label>
                            <select
                                className="w-full px-5 py-3.5 bg-[#040714] border border-slate-800 rounded-xl outline-none focus:border-cyan-500 text-sm font-bold text-white appearance-none cursor-pointer"
                                value={genero}
                                onChange={e => setGenero(e.target.value)}
                            >
                                <option value="MASCULINO" className="bg-[#0a0f2c]">MASCULINO</option>
                                <option value="FEMENINO" className="bg-[#0a0f2c]">FEMENINO</option>
                                <option value="MIXTO" className="bg-[#0a0f2c]">MIXTO</option>
                            </select>
                        </div>

                        {/* Modalidad */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Modalidad</label>
                            <select
                                className="w-full px-5 py-3.5 bg-[#040714] border border-slate-800 rounded-xl outline-none focus:border-cyan-500 text-sm font-bold text-white appearance-none cursor-pointer"
                                value={tipo}
                                onChange={e => setTipo(e.target.value)}
                            >
                                <option value="CERRADO" className="bg-[#0a0f2c]">CERRADO</option>
                                <option value="ABIERTO" className="bg-[#0a0f2c]">ABIERTO</option>
                            </select>
                        </div>

                        {/* Red Social */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                                <FaInstagram className="text-slate-500"/> Red Social
                            </label>
                            <input
                                placeholder="instagram.com/tutorneo"
                                className="w-full px-5 py-3.5 bg-[#040714] border border-slate-800 rounded-xl outline-none focus:border-cyan-500 text-sm font-medium text-white placeholder:text-slate-800 transition-all"
                                value={redSocial}
                                onChange={e => setRedSocial(e.target.value)}
                            />
                        </div>

                        {/* --- SISTEMA DE PUNTUACIÓN (COMPACTO) --- */}
                        <div className="col-span-1 md:col-span-2 pt-2 border-t border-slate-800/50">
                            <div className="flex flex-col md:flex-row md:items-center gap-4">

                                {/* Etiqueta */}
                                <div className="flex items-center gap-2 min-w-[150px]">
                                    <FaChartLine className="text-cyan-500" />
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                        Sistema de Puntos
                                    </span>
                                </div>

                                {/* Inputs Pequeños y Juntos */}
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-2 bg-[#040714] border border-slate-800 px-3 py-2 rounded-lg">
                                        <span className="text-[9px] font-bold text-slate-500 uppercase">Victoria</span>
                                        <input
                                            type="number"
                                            className="w-10 bg-transparent outline-none text-white font-black text-center border-l border-slate-800 pl-2"
                                            value={puntosGanador}
                                            onChange={e => setPuntosGanador(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 bg-[#040714] border border-slate-800 px-3 py-2 rounded-lg">
                                        <span className="text-[9px] font-bold text-slate-500 uppercase">Empate</span>
                                        <input
                                            type="number"
                                            className="w-10 bg-transparent outline-none text-white font-black text-center border-l border-slate-800 pl-2"
                                            value={puntosEmpate}
                                            onChange={e => setPuntosEmpate(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Encargado (Solo Admin) */}
                        {esAdmin && (
                            <div className="col-span-1 md:col-span-2 space-y-1.5 bg-cyan-900/10 p-3 rounded-xl border border-cyan-500/20 mt-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <FaUserAlt size={10} className="text-cyan-500" /> Responsable (Solo Admin)
                                </label>
                                <select
                                    className="w-full px-5 py-3.5 bg-[#040714] border border-slate-800 rounded-xl outline-none focus:border-cyan-500 text-[11px] font-bold text-cyan-400 appearance-none cursor-pointer"
                                    value={encargadoEmail}
                                    onChange={e => setEncargadoEmail(e.target.value)}
                                >
                                    <option value="" className="bg-[#0a0f2c]">SIN ENCARGADO</option>
                                    {listaEncargados.map(enc => (
                                        <option key={enc.id} value={enc.email} className="bg-[#0a0f2c]">
                                            {enc.nombre.toUpperCase()}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 rounded-xl text-[11px] font-bold uppercase tracking-widest text-slate-500 border border-slate-800 hover:bg-slate-800 transition-all"
                            disabled={loading}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-4 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-[11px] font-bold uppercase tracking-widest text-white transition-all shadow-lg shadow-cyan-900/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? "GUARDANDO..." : "CREAR TORNEO"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}