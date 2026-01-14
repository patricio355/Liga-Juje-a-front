import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../api/api";
import TablaPosiciones from "../components/torneo/TablaPosiciones";
import FixtureTorneo from "../components/torneo/FixtureTorneo";
import ProgramacionComoFixture from "../components/torneo/ProgramacionComoFixture";
import CuadroFaseFinal from "./CuadroFaseFinal";
import Navbar from "../components/Navbar";
// ACTUALIZADO: Quitamos FaWhatsapp, Agregamos FaGlobe y FaPhone
import { FaTrophy, FaCalendarAlt, FaFutbol, FaChevronDown, FaProjectDiagram, FaLayerGroup, FaGlobe, FaVenusMars, FaMars, FaVenus, FaPhone } from "react-icons/fa";

export default function TorneoPublico() {
    const { slug } = useParams();
    const [torneo, setTorneo] = useState(null);
    const [zonas, setZonas] = useState([]);
    const [zonaActiva, setZonaActiva] = useState(null);
    const [posiciones, setPosiciones] = useState([]);
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [loadingTorneo, setLoadingTorneo] = useState(true);
    const [seccionActiva, setSeccionActiva] = useState("ZONAS");

    useEffect(() => {
        const cargarTorneo = async () => {
            try {
                setLoadingTorneo(true);
                const data = await apiFetch("/api/torneos/activos");
                const t = data.find(item => item.slug === slug);

                if (t) {
                    const zonasOrdenadas = (t.zonas || []).sort((a, b) =>
                        a.nombre.localeCompare(b.nombre, undefined, { numeric: true, sensitivity: 'base' })
                    );
                    setTorneo(t);
                    setZonas(zonasOrdenadas);
                    setZonaActiva(zonasOrdenadas[0] ?? null);
                }
            } catch (e) {
                console.error("Error cargando torneo:", e);
            } finally {
                setLoadingTorneo(false);
            }
        };
        cargarTorneo();
    }, [slug]);

    useEffect(() => {
        if (!zonaActiva || seccionActiva !== "ZONAS") return;
        const cargarPosiciones = async () => {
            try {
                const data = await apiFetch(`/api/equipos/posiciones/zona/${zonaActiva.id}`);
                setPosiciones(data);
            } catch (e) {
                console.error("Error cargando posiciones:", e);
            }
        };
        cargarPosiciones();
    }, [zonaActiva, seccionActiva]);

    if (loadingTorneo || !torneo) return (
        <div className="min-h-screen bg-[#05070a] flex flex-col items-center justify-center gap-4">
            <FaFutbol className="text-4xl text-slate-500 animate-spin" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Cargando competición</span>
        </div>
    );

    // --- CONFIGURACIÓN DE COLORES DINÁMICOS ---
    const vars = {
        "--p": torneo.colorPrimario || "#05070a",
        "--s": torneo.colorSecundario || "#0a0c10",
        "--tp": torneo.colorTextoPrimario || "#ffffff",
        "--ts": torneo.colorTextoSecundario || "#94a3b8",
    };

    return (
        <div style={vars} className="min-h-screen bg-[var(--p)] relative overflow-hidden text-[var(--tp)] font-sans transition-colors duration-700">

            {/* Aura de fondo dinámica */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div
                    className="absolute top-[-25%] left-1/2 -translate-x-1/2 w-full h-full opacity-40 blur-[120px]"
                    style={{ background: `radial-gradient(circle, ${torneo.colorTextoSecundario}44 0%, transparent 70%)` }}
                ></div>
            </div>

            <div className="relative z-10">
                <Navbar />

                {/* ESTRUCTURA CENTRADA SIN COLUMNAS LATERALES (PUBLICIDAD DESACTIVADA) */}
                <main className="max-w-[1200px] mx-auto p-4 md:px-8 animate-in fade-in duration-500">

                    {/* --- HEADER DEL TORNEO --- */}
                    <header className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 mt-8 mb-16">

                        {/* LOGO (Aumentado de tamaño) */}
                        {torneo.fotoUrl && (
                            <div
                                // CAMBIO: Aumentado a w-32 (celular) y w-48 (PC)
                                className="w-32 h-32 md:w-48 md:h-48 shrink-0 rounded-full p-1 shadow-[0_0_60px_-10px_var(--ts)] overflow-hidden bg-[var(--p)] animate-in zoom-in-50 duration-700"
                                style={{ border: "2px solid var(--ts)44" }}
                            >
                                <img src={torneo.fotoUrl} alt="Logo Torneo" className="w-full h-full object-cover" />
                            </div>
                        )}

                        {/* TEXTOS Y BADGES */}
                        <div className="flex flex-col items-center md:items-start text-center md:text-left">

                            {/* TÍTULO */}
                            <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter text-[var(--tp)] drop-shadow-2xl leading-[0.85]">
                                {torneo.nombre}
                            </h1>

                            {/* SUBTÍTULO: DIVISIÓN */}
                            {torneo.division && (
                                <h2
                                    className="text-xl md:text-3xl font-black uppercase tracking-[0.3em] mt-3 mb-5 drop-shadow-lg"
                                    style={{ color: "var(--ts)" }}
                                >
                                    DIVISIÓN {torneo.division}
                                </h2>
                            )}

                            {/* BADGES DE INFO EXTRA */}
                            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-2">

                                {/* Género */}
                                {torneo.genero && (
                                    <div className="px-4 py-1.5 rounded-full border border-dashed border-[var(--ts)]/30 bg-[var(--s)]/60 backdrop-blur-sm flex items-center gap-2">
                                        {torneo.genero === "MASCULINO" && <FaMars className="text-[var(--ts)]" />}
                                        {torneo.genero === "FEMENINO" && <FaVenus className="text-[var(--ts)]" />}
                                        {torneo.genero === "MIXTO" && <FaVenusMars className="text-[var(--ts)]" />}
                                        <p className="text-[var(--ts)] font-black uppercase tracking-[0.2em] text-[10px]">
                                            {torneo.genero}
                                        </p>
                                    </div>
                                )}

                                {/* Red Social (Con Icono Mundo) */}
                                {torneo.redSocial && (
                                    <a
                                        href={torneo.redSocial.startsWith('http') ? torneo.redSocial : `https://${torneo.redSocial}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-1.5 rounded-full border border-[var(--ts)] bg-[var(--ts)]/10 hover:bg-[var(--ts)] hover:text-[var(--p)] transition-all flex items-center gap-2 cursor-pointer group"
                                    >
                                        {/* CAMBIO: FaGlobe */}
                                        <FaGlobe className="text-[var(--ts)] group-hover:text-[var(--p)] transition-colors" />
                                        <p className="text-[var(--ts)] group-hover:text-[var(--p)] font-black uppercase tracking-[0.2em] text-[10px] transition-colors">
                                            SEGUINOS
                                        </p>
                                    </a>
                                )}

                                {/* Teléfono del Encargado (Icono Telefono + Número Texto) */}
                                {torneo.encargadoTelefono && (
                                    <a
                                        href={`https://wa.me/${torneo.encargadoTelefono.replace(/[^0-9]/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-1.5 rounded-full border border-green-500/50 bg-green-500/10 hover:bg-green-500 hover:text-white transition-all flex items-center gap-2 cursor-pointer group"
                                    >
                                        {/* CAMBIO: Icono FaPhone y texto del número */}
                                        <FaPhone className="text-green-500 group-hover:text-white transition-colors" size={12} />
                                        <p className="text-green-500 group-hover:text-white font-black uppercase tracking-[0.1em] text-[10px] transition-colors">
                                            {torneo.encargadoTelefono}
                                        </p>
                                    </a>
                                )}

                            </div>
                        </div>
                    </header>

                    {/* SELECTOR DE SECCIÓN */}
                    <div className="flex justify-center gap-2 mb-10 bg-[var(--s)]/80 p-1.5 rounded-2xl border border-[var(--ts)]/10 w-fit mx-auto backdrop-blur-xl shadow-2xl">
                        <button
                            onClick={() => setSeccionActiva("ZONAS")}
                            className={`flex items-center gap-2 px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${seccionActiva === "ZONAS" ? "bg-[var(--tp)] text-[var(--p)] shadow-xl scale-105" : "text-[var(--ts)] hover:text-[var(--tp)]"}`}
                        >
                            <FaLayerGroup /> Fase de Grupos
                        </button>
                        <button
                            onClick={() => setSeccionActiva("FINAL")}
                            className={`flex items-center gap-2 px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${seccionActiva === "FINAL" ? "bg-[var(--tp)] text-[var(--p)] shadow-xl scale-105" : "text-[var(--ts)] hover:text-[var(--tp)]"}`}
                        >
                            <FaProjectDiagram /> Fase Final
                        </button>
                    </div>

                    {/* CONTENIDO PRINCIPAL (Sin columnas laterales) */}
                    {seccionActiva === "ZONAS" ? (
                        <div className="animate-in slide-in-from-bottom-4 duration-500">
                            {/* Selector de Zona */}
                            <div className="relative mb-10 flex justify-center z-50">
                                <div className="relative w-fit min-w-[240px]">
                                    <div
                                        onClick={() => setMenuAbierto(!menuAbierto)}
                                        className="flex items-center justify-between gap-4 bg-[var(--s)] px-6 py-4 rounded-2xl border border-[var(--ts)]/20 cursor-pointer hover:border-[var(--ts)]/50 transition-all shadow-xl"
                                    >
                                        <span className="text-[11px] font-black text-[var(--tp)] uppercase tracking-widest">
                                            {zonaActiva?.nombre || "SELECCIONAR ZONA"}
                                        </span>
                                        <FaChevronDown size={12} className={`text-[var(--ts)] transition-transform duration-300 ${menuAbierto ? "rotate-180" : ""}`} />
                                    </div>
                                    {menuAbierto && (
                                        <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-[var(--s)] border border-[var(--ts)]/30 rounded-2xl p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 overflow-hidden animate-in zoom-in-95">
                                            {zonas.map(z => (
                                                <button
                                                    key={z.id}
                                                    onClick={() => { setZonaActiva(z); setMenuAbierto(false); }}
                                                    className={`w-full px-4 py-3.5 rounded-xl text-[10px] font-black uppercase text-center mb-1 transition-all ${zonaActiva?.id === z.id ? "bg-[var(--tp)] text-[var(--p)]" : "text-[var(--ts)] hover:bg-[var(--p)] hover:text-[var(--tp)]"}`}
                                                >
                                                    {z.nombre}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    {menuAbierto && <div className="fixed inset-0 z-[-1]" onClick={() => setMenuAbierto(false)}></div>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-12">
                                {/* Tabla de Posiciones */}
                                <section className="bg-[var(--s)]/50 backdrop-blur-md rounded-[2.5rem] border border-[var(--ts)]/10 overflow-hidden shadow-2xl">
                                    <div className="bg-[var(--p)]/60 px-8 py-5 border-b border-[var(--ts)]/10 flex items-center gap-3">
                                        <FaTrophy size={16} className="text-[var(--ts)]" />
                                        <h2 className="font-black uppercase italic tracking-widest text-[11px] text-[var(--tp)]">Tabla de Posiciones</h2>
                                    </div>
                                    <div className="p-4 md:p-8 overflow-x-auto">
                                        <TablaPosiciones posiciones={posiciones} />
                                    </div>
                                </section>

                                {/* Cronograma */}
                                <section className="bg-[var(--s)]/50 backdrop-blur-md rounded-[2.5rem] border border-[var(--ts)]/10 overflow-hidden shadow-2xl">
                                    <div className="bg-[var(--p)]/60 px-8 py-5 border-b border-[var(--ts)]/10 flex items-center gap-3">
                                        <FaCalendarAlt size={16} className="text-[var(--ts)]" />
                                        <h2 className="font-black uppercase italic tracking-widest text-[11px] text-[var(--tp)]">Cronograma de Partidos</h2>
                                    </div>
                                    <div className="w-full">
                                        {zonaActiva && (
                                            torneo.tipo === "CERRADO"
                                                ? <FixtureTorneo zonaId={zonaActiva.id} />
                                                : <ProgramacionComoFixture zonaId={zonaActiva.id} />
                                        )}
                                    </div>
                                </section>
                            </div>
                        </div>
                    ) : (
                        <div className="animate-in slide-in-from-bottom-4 duration-500">
                            <CuadroFaseFinal torneoId={torneo.id} />
                        </div>
                    )}

                    <footer className="mt-24 mb-12 text-center opacity-40">
                        <p className="text-[9px] font-black text-[var(--ts)] uppercase tracking-[1em] italic">
                            LIGAS JUJEÑAS • V1.0
                        </p>
                    </footer>
                </main>
            </div>
        </div>
    );
}