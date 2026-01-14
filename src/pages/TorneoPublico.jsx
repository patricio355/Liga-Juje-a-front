import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../api/api";
import TablaPosiciones from "../components/torneo/TablaPosiciones";
import FixtureTorneo from "../components/torneo/FixtureTorneo";
import ProgramacionComoFixture from "../components/torneo/ProgramacionComoFixture";
import CuadroFaseFinal from "./CuadroFaseFinal"; // Importante
import Navbar from "../components/Navbar";
import { FaTrophy, FaCalendarAlt, FaFutbol, FaChevronDown, FaProjectDiagram, FaLayerGroup } from "react-icons/fa";

export default function TorneoPublico() {
    const { slug } = useParams();
    const [torneo, setTorneo] = useState(null);
    const [zonas, setZonas] = useState([]);
    const [zonaActiva, setZonaActiva] = useState(null);
    const [posiciones, setPosiciones] = useState([]);
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [loadingTorneo, setLoadingTorneo] = useState(true);

    // ESTADO PARA NAVEGACIÓN
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
        <div className="min-h-screen bg-[#02040a] flex flex-col items-center justify-center gap-4">
            <FaFutbol className="text-4xl text-blue-500 animate-spin" />
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Cargando torneo</span>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#02040a] relative overflow-hidden text-slate-200 font-sans">
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-50%] left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(37,99,235,0.12)_0%,_transparent_70%)]"></div>
            </div>

            <div className="relative z-10">
                <Navbar />
                <main className="max-w-[1200px] mx-auto p-4 md:px-8 animate-in fade-in duration-500">

                    <div className="text-center mt-6 mb-10">
                        <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white">
                            {torneo.nombre}
                        </h1>
                        {torneo.division && (
                            <p className="text-blue-500 font-black uppercase tracking-[0.3em] text-[10px] mt-2">
                                Divisional: {torneo.division}
                            </p>
                        )}
                    </div>

                    {/* SELECTOR DE SECCIÓN (ZONAS O FINAL) */}
                    <div className="flex justify-center gap-2 mb-8 bg-[#0e1630]/60 p-1.5 rounded-2xl border border-blue-900/30 w-fit mx-auto backdrop-blur-md">
                        <button
                            onClick={() => setSeccionActiva("ZONAS")}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${seccionActiva === "ZONAS" ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]" : "text-slate-400 hover:text-white"}`}
                        >
                            <FaLayerGroup /> Fase de Grupos
                        </button>
                        <button
                            onClick={() => setSeccionActiva("FINAL")}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${seccionActiva === "FINAL" ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]" : "text-slate-400 hover:text-white"}`}
                        >
                            <FaProjectDiagram /> Fase Final
                        </button>
                    </div>

                    {/* RENDERIZADO CONDICIONAL SEGÚN SECCIÓN */}
                    {seccionActiva === "ZONAS" ? (
                        <div className="animate-in slide-in-from-bottom-4 duration-500">
                            {/* Selector de Zona */}
                            <div className="relative mb-8 flex justify-center z-50">
                                <div className="relative w-fit min-w-[200px]">
                                    <div
                                        onClick={() => setMenuAbierto(!menuAbierto)}
                                        className="flex items-center justify-between gap-4 bg-[#0e1630] px-5 py-3 rounded-xl border border-blue-900/40 cursor-pointer hover:border-blue-500 transition-all shadow-lg"
                                    >
                                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
                                            {zonaActiva?.nombre || "SELECCIONAR ZONA"}
                                        </span>
                                        <FaChevronDown size={10} className={`text-blue-500 transition-transform ${menuAbierto ? "rotate-180" : ""}`} />
                                    </div>
                                    {menuAbierto && (
                                        <div className="absolute top-full left-0 w-full mt-2 bg-[#0e1630] border border-blue-800 rounded-xl p-1 shadow-2xl z-50">
                                            {zonas.map(z => (
                                                <button
                                                    key={z.id}
                                                    onClick={() => { setZonaActiva(z); setMenuAbierto(false); }}
                                                    className={`w-full px-4 py-3 rounded-lg text-[10px] font-black uppercase text-center mb-1 transition-colors ${zonaActiva?.id === z.id ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-blue-900/40"}`}
                                                >
                                                    {z.nombre}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    {menuAbierto && <div className="fixed inset-0 z-[-1]" onClick={() => setMenuAbierto(false)}></div>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-10">
                                <section className="bg-[#0e1630]/40 backdrop-blur-md rounded-3xl border border-blue-900/40 overflow-hidden shadow-xl">
                                    <div className="bg-[#050814]/80 px-6 py-4 border-b border-blue-900/40 flex items-center gap-2">
                                        <FaTrophy size={14} className="text-blue-500" />
                                        <h2 className="font-black uppercase italic tracking-wider text-xs text-white">Tabla de Posiciones</h2>
                                    </div>
                                    <div className="p-2 md:p-6 overflow-x-auto">
                                        <TablaPosiciones posiciones={posiciones} />
                                    </div>
                                </section>

                                <section className="bg-[#0e1630]/40 backdrop-blur-md rounded-3xl border border-blue-900/40 overflow-hidden shadow-xl">
                                    <div className="bg-[#050814]/80 px-6 py-4 border-b border-blue-900/40 flex items-center gap-2">
                                        <FaCalendarAlt size={14} className="text-blue-500" />
                                        <h2 className="font-black uppercase italic tracking-wider text-xs text-white">Cronograma de Partidos</h2>
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
                        /* SECCIÓN DE FASE FINAL */
                        <div className="animate-in slide-in-from-bottom-4 duration-500">
                            <CuadroFaseFinal torneoId={torneo.id} />
                        </div>
                    )}

                    <footer className="mt-20 mb-10 text-center opacity-20">
                        <p className="text-[8px] font-black text-blue-400 uppercase tracking-[0.8em] italic">
                            LIGAS JUJEÑAS • PLATAFORMA OFICIAL
                        </p>
                    </footer>
                </main>
            </div>
        </div>
    );
}