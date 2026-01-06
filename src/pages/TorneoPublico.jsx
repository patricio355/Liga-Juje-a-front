import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../api/api";
import TablaPosiciones from "../components/torneo/TablaPosiciones";
import FixtureTorneo from "../components/torneo/FixtureTorneo";
import ProgramacionComoFixture from "../components/torneo/ProgramacionComoFixture";
import Navbar from "../components/Navbar";
import { FaTrophy, FaCalendarAlt, FaFutbol, FaChevronDown } from "react-icons/fa";

export default function TorneoPublico() {
    const { id } = useParams();
    const [torneo, setTorneo] = useState(null);
    const [zonas, setZonas] = useState([]);
    const [zonaActiva, setZonaActiva] = useState(null);
    const [posiciones, setPosiciones] = useState([]);
    const [loading, setLoading] = useState(true);

    // NUEVO ESTADO: Controla si el menú está abierto o cerrado con CLICK
    const [menuAbierto, setMenuAbierto] = useState(false);

    useEffect(() => {
        const cargarTorneo = async () => {
            try {
                const data = await apiFetch("/api/torneos/activos");
                const t = data.find(item => item.id === Number(id));
                if (t) {
                    // --- CORRECCIÓN AQUÍ: Ordenamos las zonas por nombre ---
                    const zonasOrdenadas = (t.zonas || []).sort((a, b) =>
                        a.nombre.localeCompare(b.nombre, undefined, { numeric: true, sensitivity: 'base' })
                    );

                    setTorneo(t);
                    setZonas(zonasOrdenadas);
                    // Ahora el primer elemento [0] será siempre la Zona A (o la de menor nombre)
                    setZonaActiva(zonasOrdenadas[0] ?? null);
                }
            } catch (e) { console.error(e); }
        };
        cargarTorneo();
    }, [id]);

    useEffect(() => {
        if (!zonaActiva) return;
        const cargarPosiciones = async () => {
            setLoading(true);
            try {
                const data = await apiFetch(`/api/equipos/posiciones/zona/${zonaActiva.id}`);
                setPosiciones(data);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        cargarPosiciones();
    }, [zonaActiva]);

    if (!torneo) return (
        <div className="min-h-screen bg-[#02040a] flex flex-col items-center justify-center gap-4">
            <FaFutbol className="text-4xl text-blue-500 animate-spin" />
            <span className="text-[10px] font-black text-blue-900 uppercase tracking-widest text-center italic">Cargando equipos...</span>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#02040a] relative overflow-hidden text-slate-200 font-sans">
            {/* Fondo */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-50%] left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(37,99,235,0.22)_0%,_transparent_65%)]"></div>
            </div>

            <div className="relative z-10">
                <Navbar />

                <main className="max-w-[1100px] mx-auto p-4 md:px-8">

                    {/* Título */}
                    <div className="text-center mt-2 mb-6">
                        <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white leading-[0.85] drop-shadow-2xl">
                            {torneo.nombre}
                            <span className="text-blue-500 bg-gradient-to-r from-blue-400 via-blue-200 to-indigo-300 bg-clip-text text-transparent block md:inline md:ml-4">
                                Div. "{torneo.division}"
                            </span>
                        </h1>
                    </div>

                    {/* SELECTOR DE ZONA (Corregido para Celular) */}
                    <div className="relative mb-8 flex justify-center z-50">
                        <div className="relative w-fit min-w-[120px]">

                            {/* BOTÓN DISPARADOR: Ahora usa onClick */}
                            <div
                                onClick={() => setMenuAbierto(!menuAbierto)}
                                className="flex items-center justify-between gap-4 bg-[#0e1630]/95 backdrop-blur-md px-5 py-2 rounded-xl border border-blue-900/40 shadow-xl cursor-pointer hover:border-blue-500/50 transition-all select-none"
                            >
                                <span className="text-[11px] md:text-xs font-black text-blue-400 uppercase tracking-[0.2em] whitespace-nowrap">
                                    {zonaActiva?.nombre || "ZONA"}
                                </span>
                                <FaChevronDown
                                    size={10}
                                    className={`text-blue-500 transition-transform duration-300 ${menuAbierto ? "rotate-180" : ""}`}
                                />
                            </div>

                            {/* LISTA DESPLEGABLE: Controlada por el estado menuAbierto */}
                            <div className={`absolute top-full left-1/2 -translate-x-1/2 w-full mt-2 bg-[#0e1630] border border-blue-800/50 rounded-xl p-1.5 shadow-[0_10px_40px_rgba(0,0,0,0.9)] transition-all duration-200 origin-top
                                ${menuAbierto ? "opacity-100 visible scale-100 translate-y-0" : "opacity-0 invisible scale-95 -translate-y-2"}
                            `}>
                                {zonas.map(z => (
                                    <button
                                        key={z.id}
                                        onClick={() => {
                                            setZonaActiva(z);
                                            setMenuAbierto(false); // Cerramos el menú al elegir
                                        }}
                                        className={`w-full px-3 py-2.5 rounded-lg text-[10px] font-black uppercase text-center transition-all mb-1 last:mb-0
                                            ${zonaActiva?.id === z.id
                                            ? "bg-blue-600 text-white shadow-lg"
                                            : "text-slate-400 hover:bg-blue-900/40 hover:text-blue-400"}
                                        `}
                                    >
                                        {z.nombre}
                                    </button>
                                ))}
                            </div>

                            {/* CERRAR AL HACER CLICK AFUERA (Fondo invisible) */}
                            {menuAbierto && (
                                <div
                                    className="fixed inset-0 z-[-1]"
                                    onClick={() => setMenuAbierto(false)}
                                ></div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-10">
                        {/* 1. SECCIÓN TABLA */}
                        <section className="bg-[#0e1630]/50 backdrop-blur-sm rounded-3xl border border-blue-900/40 overflow-hidden shadow-2xl">
                            <div className="bg-[#050814]/95 px-6 py-3 border-b border-blue-900/40 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <FaTrophy size={14} className="text-blue-500" />
                                    <h2 className="font-black uppercase italic tracking-wider text-[10px] text-white">Tabla de Posiciones</h2>
                                </div>
                                <span className="text-[8px] font-bold text-blue-400 uppercase bg-[#02040a] px-2 py-0.5 rounded-full border border-blue-900/40">
                                    {zonaActiva?.nombre}
                                </span>
                            </div>
                            <div className="p-1 md:p-4 overflow-x-auto">
                                {loading ? <div className="py-12 flex justify-center"><div className="w-6 h-6 border-2 border-blue-500/10 border-t-blue-500 rounded-full animate-spin" /></div> : <TablaPosiciones posiciones={posiciones} />}
                            </div>
                        </section>

                        {/* 2. SECCIÓN FIXTURE */}
                        <section className="bg-[#0e1630]/50 backdrop-blur-sm rounded-3xl border border-blue-900/40 overflow-hidden shadow-2xl">
                            <div className="bg-[#050814]/95 px-6 py-3 border-b border-blue-900/40 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <FaCalendarAlt size={14} className="text-blue-500" />
                                    <h2 className="font-black uppercase italic tracking-wider text-[10px] text-white">Fixture de Jornadas</h2>
                                </div>
                                <span className="text-[8px] font-bold text-blue-400 uppercase bg-[#02040a] px-2 py-0.5 rounded-full border border-blue-900/40">
                                    {zonaActiva?.nombre}
                                </span>
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

                    <footer className="mt-12 mb-6 text-center border-t border-blue-900/10 pt-4">
                        <p className="text-[8px] font-black text-blue-950 uppercase tracking-[0.3em] italic opacity-40">
                            UEFA Premium Management • 2026
                        </p>
                    </footer>
                </main>
            </div>
        </div>
    );
}