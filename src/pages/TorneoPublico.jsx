import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../api/api";
import TablaPosiciones from "../components/torneo/TablaPosiciones";
import FixtureTorneo from "../components/torneo/FixtureTorneo";
import ProgramacionComoFixture from "../components/torneo/ProgramacionComoFixture";
import Navbar from "../components/Navbar";
import { FaTrophy, FaCalendarAlt, FaFutbol, FaChevronDown } from "react-icons/fa";

export default function TorneoPublico() {
    const { slug } = useParams();
    const [torneo, setTorneo] = useState(null);
    const [zonas, setZonas] = useState([]);
    const [zonaActiva, setZonaActiva] = useState(null);
    const [posiciones, setPosiciones] = useState([]);
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [loadingTorneo, setLoadingTorneo] = useState(true);

    // 1. Carga inicial del Torneo (Solo bloquea el nombre y las zonas)
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

    // 2. Carga de Posiciones (Carga independiente al fixture)
    useEffect(() => {
        if (!zonaActiva) return;
        const cargarPosiciones = async () => {
            try {
                const data = await apiFetch(`/api/equipos/posiciones/zona/${zonaActiva.id}`);
                setPosiciones(data);
            } catch (e) {
                console.error("Error cargando posiciones:", e);
            }
        };
        cargarPosiciones();
    }, [zonaActiva]);

    // Pantalla de carga solo para los datos base del torneo
    if (loadingTorneo || !torneo) return (
        <div className="min-h-screen bg-[#02040a] flex flex-col items-center justify-center gap-4">
            <FaFutbol className="text-4xl text-blue-500 animate-spin" />
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] animate-pulse">
                Cargando Torneo
            </span>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#02040a] relative overflow-hidden text-slate-200 font-sans">
            {/* Fondo con resplandor */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-50%] left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(37,99,235,0.15)_0%,_transparent_65%)]"></div>
            </div>

            <div className="relative z-10">
                <Navbar />
                <main className="max-w-[1100px] mx-auto p-4 md:px-8 animate-in fade-in duration-500">

                    {/* Header del Torneo */}
                    <div className="text-center mt-2 mb-6">
                        <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white leading-tight">
                            {torneo.nombre}
                            {torneo.division && (
                                <span className="text-blue-500 block md:inline md:ml-4 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                                    Div. "{torneo.division}"
                                </span>
                            )}
                        </h1>
                    </div>

                    {/* Selector de Zona */}
                    <div className="relative mb-8 flex justify-center z-50">
                        <div className="relative w-fit min-w-[150px]">
                            <div
                                onClick={() => setMenuAbierto(!menuAbierto)}
                                className="flex items-center justify-between gap-4 bg-[#0e1630] px-5 py-3 rounded-xl border border-blue-900/40 cursor-pointer hover:border-blue-500 transition-all select-none shadow-lg"
                            >
                                <span className="text-xs font-black text-blue-400 uppercase tracking-widest">
                                    {zonaActiva?.nombre || "SELECCIONAR ZONA"}
                                </span>
                                <FaChevronDown size={10} className={`text-blue-500 transition-transform ${menuAbierto ? "rotate-180" : ""}`} />
                            </div>

                            {menuAbierto && (
                                <div className="absolute top-full left-0 w-full mt-2 bg-[#0e1630] border border-blue-800 rounded-xl p-1 shadow-2xl animate-in slide-in-from-top-2">
                                    {zonas.map(z => (
                                        <button
                                            key={z.id}
                                            onClick={() => {
                                                setZonaActiva(z);
                                                setMenuAbierto(false);
                                            }}
                                            className={`w-full px-4 py-3 rounded-lg text-[10px] font-black uppercase text-center mb-1 last:mb-0 transition-colors
                                                ${zonaActiva?.id === z.id ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-blue-900/40"}
                                            `}
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
                        {/* Tabla de Posiciones */}
                        <section className="bg-[#0e1630]/40 backdrop-blur-md rounded-3xl border border-blue-900/40 overflow-hidden shadow-xl">
                            <div className="bg-[#050814]/80 px-6 py-4 border-b border-blue-900/40 flex items-center gap-2">
                                <FaTrophy size={14} className="text-blue-500" />
                                <h2 className="font-black uppercase italic tracking-wider text-xs text-white">Tabla de Posiciones</h2>
                            </div>
                            <div className="p-2 md:p-6 overflow-x-auto">
                                <TablaPosiciones posiciones={posiciones} />
                            </div>
                        </section>

                        {/* Fixture / Programación */}
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

                    <footer className="mt-16 mb-8 text-center opacity-30">
                        <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.5em] italic">
                            LIGAS DE JUJUY • SISTEMA DE GESTIÓN
                        </p>
                    </footer>
                </main>
            </div>
        </div>
    );
}