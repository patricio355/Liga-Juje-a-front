import { useContext, useState, useEffect } from "react";
import { createPortal } from "react-dom"; // Importante para el Portal
import { apiFetch } from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import {
    FaTrophy,
    FaChartLine,
    FaUserAlt,
    FaPalette,
    FaMars,
    FaVenus,
    FaVenusMars,
    FaTimes,
    FaGlobe,
    FaLayerGroup,
    FaSitemap,
    FaCogs,
    FaInfoCircle
} from "react-icons/fa";
import ImageUpload from "../../images/ImageUpload";

const PLANTILLAS = {
    NEGRO: { p: "#05070a", s: "#0a0c10", tp: "#ffffff", ts: "#94a3b8" },
    BLANCO: { p: "#ffffff", s: "#f8fafc", tp: "#000000", ts: "#64748b" },
    AZUL: { p: "#050814", s: "#0d143d", tp: "#ffffff", ts: "#60a5fa" },
    ROJO: { p: "#0a0404", s: "#1a0808", tp: "#ffffff", ts: "#f87171" },
    VERDE: { p: "#040a05", s: "#081a0d", tp: "#ffffff", ts: "#4ade80" },
    GRIS: { p: "#111827", s: "#1f2937", tp: "#ffffff", ts: "#d1d5db" },
    VIOLETA: { p: "#0f0514", s: "#1e0a29", tp: "#ffffff", ts: "#c084fc" },
    DORADO: { p: "#0a0904", s: "#1a1808", tp: "#ffffff", ts: "#fbbf24" },
    ESMERALDA: { p: "#020617", s: "#0f172a", tp: "#ffffff", ts: "#10b981" }
};

export default function ModalCrearTorneo({ onClose, onCreated }) {
    const { user } = useContext(AuthContext);
    const esAdmin = user?.role === "ROLE_ADMIN" || user?.role === "ADMIN";

    const [nombre, setNombre] = useState("");
    const [division, setDivision] = useState("");
    const [encargadoEmail, setEncargadoEmail] = useState("");
    const [estado, setEstado] = useState("activo");
    const [tipo, setTipo] = useState("CERRADO"); // Modalidad: ABIERTO o CERRADO
    const [puntosGanador, setPuntosGanador] = useState(3);
    const [puntosEmpate, setPuntosEmpate] = useState(1);
    const [plantillaActiva, setPlantillaActiva] = useState("NEGRO");
    const [fotoUrl, setFotoUrl] = useState("");
    const [genero, setGenero] = useState("MASCULINO");
    const [redSocial, setRedSocial] = useState("");

    // Nuevos atributos de visibilidad inicial
    const [mostrarGrupos, setMostrarGrupos] = useState(true);
    const [mostrarFinal, setMostrarFinal] = useState(true);

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

        // Bloquear scroll del body al abrir
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
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
                redSocial: redSocial || null,
                faseGrupos: mostrarGrupos,
                faseFinal: mostrarFinal
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

    return createPortal(
        <div
            className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-[999999] p-2 md:p-6"
            onClick={onClose}
        >
            <form
                className="bg-[#05070a] border border-white/10 rounded-[2.5rem] w-full max-w-4xl shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden flex flex-col max-h-[95vh] relative animate-in fade-in zoom-in duration-200"
                onClick={(e) => e.stopPropagation()}
                onSubmit={crearTorneo}
            >
                {/* Header Fijo */}
                <div className="bg-[#0a0c10] px-8 py-6 border-b border-white/5 flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic flex items-center gap-3">
                            <FaTrophy className="text-slate-400" size={22} /> Crear Torneo
                        </h2>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-1">
                            Configuración de Competencia Profesional
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-500 hover:text-white transition-colors p-2 bg-white/5 rounded-full"
                    >
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* FOTO y NOMBRE */}
                        <div className="col-span-1 flex flex-col items-center justify-center bg-white/5 p-8 rounded-[2rem] border border-white/5 shadow-inner">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">
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

                        <div className="col-span-1 flex flex-col justify-center space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                    Nombre de la Competición
                                </label>
                                <input
                                    placeholder="TORNEO APERTURA..."
                                    className={`w-full px-6 py-5 bg-black border rounded-2xl outline-none focus:border-slate-400 text-sm font-black text-white placeholder:text-slate-900 transition-all italic uppercase ${
                                        nombre.length > 0 && nombre.length < 6 ? "border-red-500/50" : "border-white/10"
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
                        </div>

                        {/* PLANTILLAS */}
                        <div className="col-span-1 md:col-span-2 space-y-4 pt-6 border-t border-white/5">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <FaPalette className="text-slate-400" /> Estilo de Plantilla
                            </label>
                            <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
                                {Object.keys(PLANTILLAS).map((key) => (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => setPlantillaActiva(key)}
                                        className={`h-14 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-1 group ${plantillaActiva === key ? "border-white scale-110 shadow-[0_0_25px_rgba(255,255,255,0.15)] z-10" : "border-white/5 opacity-40 hover:opacity-100"}`}
                                        style={{ backgroundColor: PLANTILLAS[key].p }}
                                    >
                                        <div className="w-4 h-1 rounded-full" style={{ backgroundColor: PLANTILLAS[key].ts }}></div>
                                        <span className={`text-[7px] font-black uppercase tracking-tighter ${PLANTILLAS[key].p === "#ffffff" ? "text-black" : "text-white"}`}>{key}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* SELECTORES DE MODALIDAD Y REDES */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 col-span-1 md:col-span-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <FaCogs size={10} /> Modalidad de Gestión
                                </label>
                                <select
                                    className="w-full px-6 py-5 bg-black border border-white/10 rounded-2xl outline-none focus:border-slate-400 text-xs font-black text-white appearance-none cursor-pointer uppercase italic shadow-inner"
                                    value={tipo}
                                    onChange={e => setTipo(e.target.value)}
                                >
                                    <option value="CERRADO">MODALIDAD CERRADA (AUTOMÁTICA)</option>
                                    <option value="ABIERTO">MODALIDAD ABIERTA (MANUAL)</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <FaGlobe size={10} /> Red Social
                                </label>
                                <div className="relative">
                                    <FaGlobe className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700" />
                                    <input
                                        placeholder="URL o Usuario"
                                        className="w-full pl-14 pr-6 py-5 bg-black border border-white/10 rounded-2xl outline-none focus:border-slate-400 text-xs font-bold text-white placeholder:text-slate-900 shadow-inner"
                                        value={redSocial}
                                        onChange={e => setRedSocial(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* LEYENDA EXPLICATIVA DE MODALIDAD */}
                            <div className="col-span-1 md:col-span-2 bg-white/5 p-6 rounded-[2rem] border border-white/5 space-y-4">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <FaInfoCircle size={12} />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Información de Modalidad</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className={`p-4 rounded-2xl border transition-all ${tipo === 'CERRADO' ? 'bg-slate-400/10 border-slate-400/30' : 'opacity-30 border-transparent'}`}>
                                        <p className="text-[10px] leading-relaxed text-slate-200">
                                            <span className="font-black text-slate-400 uppercase">* CERRADO:</span> Ya tengo mis equipos y quiero fixture automático para solo cerrar partidos con el resultado (ideal para torneos profesionales).
                                        </p>
                                    </div>
                                    <div className={`p-4 rounded-2xl border transition-all ${tipo === 'ABIERTO' ? 'bg-slate-400/10 border-slate-400/30' : 'opacity-30 border-transparent'}`}>
                                        <p className="text-[10px] leading-relaxed text-slate-200">
                                            <span className="font-black text-slate-400 uppercase">* ABIERTO:</span> Voy a permitir añadir equipos a mitad del torneo y voy a gestionar el fixture manualmente (ideal para torneos barriales).
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">División</label>
                                <select
                                    className="w-full px-6 py-5 bg-black border border-white/10 rounded-2xl outline-none focus:border-slate-400 text-xs font-black text-white appearance-none cursor-pointer uppercase italic shadow-inner"
                                    value={division}
                                    onChange={e => setDivision(e.target.value)}
                                >
                                    <option value="" className="bg-black">SIN ESPECIFICAR</option>
                                    {["A", "B", "C", "D", "E"].map(d => (
                                        <option key={d} value={d} className="bg-black">DIVISIÓN {d}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">Género</label>
                                <select
                                    className="w-full px-6 py-5 bg-black border border-white/10 rounded-2xl outline-none focus:border-slate-400 text-xs font-black text-white appearance-none cursor-pointer uppercase italic shadow-inner"
                                    value={genero}
                                    onChange={e => setGenero(e.target.value)}
                                >
                                    <option value="MASCULINO" className="bg-black">MASCULINO</option>
                                    <option value="FEMENINO" className="bg-black">FEMENINO</option>
                                    <option value="MIXTO" className="bg-black">MIXTO</option>
                                </select>
                            </div>
                        </div>

                        {/* ESTRUCTURA DE FASES */}
                        <div className="col-span-1 md:col-span-2 space-y-4 pt-6 border-t border-white/5">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Estructura de Fases Iniciales</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setMostrarGrupos(!mostrarGrupos)}
                                    className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${mostrarGrupos ? 'bg-white/10 border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.05)]' : 'bg-black border-white/5 opacity-50'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <FaLayerGroup className={mostrarGrupos ? "text-white" : "text-slate-600"} />
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Fase de Grupos</span>
                                    </div>
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${mostrarGrupos ? 'border-white bg-white' : 'border-white/20'}`}>
                                        {mostrarGrupos && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setMostrarFinal(!mostrarFinal)}
                                    className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${mostrarFinal ? 'bg-white/10 border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.05)]' : 'bg-black border-white/5 opacity-50'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <FaSitemap className={mostrarFinal ? "text-white" : "text-slate-600"} />
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Fase Final</span>
                                    </div>
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${mostrarFinal ? 'border-white bg-white' : 'border-white/20'}`}>
                                        {mostrarFinal && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Sistema de Puntuación */}
                        <div className="col-span-1 md:col-span-2 bg-white/5 p-8 rounded-[2rem] border border-white/5 shadow-inner">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-center gap-3">
                                    <FaChartLine className="text-slate-400" />
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Sistema de Puntos</span>
                                </div>
                                <div className="flex gap-6">
                                    <div className="flex-1 md:flex-none flex flex-col gap-2">
                                        <span className="text-[8px] font-black text-slate-700 uppercase ml-2 tracking-widest">Victoria</span>
                                        <input
                                            type="number"
                                            className="w-full md:w-28 bg-black border border-white/10 outline-none text-white font-black text-center py-4 rounded-xl focus:border-slate-400 shadow-inner"
                                            value={puntosGanador}
                                            onChange={e => setPuntosGanador(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex-1 md:flex-none flex flex-col gap-2">
                                        <span className="text-[8px] font-black text-slate-700 uppercase ml-2 tracking-widest">Empate</span>
                                        <input
                                            type="number"
                                            className="w-full md:w-28 bg-black border border-white/10 outline-none text-white font-black text-center py-4 rounded-xl focus:border-slate-400 shadow-inner"
                                            value={puntosEmpate}
                                            onChange={e => setPuntosEmpate(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Encargado */}
                        {esAdmin && (
                            <div className="col-span-1 md:col-span-2 space-y-2 bg-slate-400/5 p-8 rounded-[2rem] border border-white/5 shadow-inner">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <FaUserAlt size={10} /> Responsable Técnico
                                </label>
                                <select
                                    className="w-full px-6 py-5 bg-black border border-white/10 rounded-2xl outline-none focus:border-slate-400 text-xs font-black text-slate-400 appearance-none cursor-pointer italic"
                                    value={encargadoEmail}
                                    onChange={e => setEncargadoEmail(e.target.value)}
                                >
                                    <option value="" className="bg-black">SIN ENCARGADO</option>
                                    {listaEncargados.map(enc => (
                                        <option key={enc.id} value={enc.email} className="bg-black">
                                            {enc.nombre.toUpperCase()}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Fijo */}
                <div className="p-8 bg-[#0a0c10] border-t border-white/5 flex gap-4 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 border border-white/5 hover:bg-white/5 transition-all"
                        disabled={loading}
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-5 bg-gradient-to-r from-slate-200 to-slate-400 hover:from-white hover:to-slate-300 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-black transition-all shadow-[0_10px_30px_rgba(0,0,0,0.5)] active:scale-95 disabled:opacity-50"
                    >
                        {loading ? "PROCESANDO..." : "CREAR TORNEO"}
                    </button>
                </div>
            </form>
        </div>,
        document.body
    );
}