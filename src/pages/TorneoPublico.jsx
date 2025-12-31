import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../api/api";
import TablaPosiciones from "../components/torneo/TablaPosiciones";
import FixtureTorneo from "../components/torneo/FixtureTorneo";
import ProgramacionComoFixture from "../components/torneo/ProgramacionComoFixture";
import Navbar from "../components/Navbar";
import { FaTrophy, FaCalendarAlt, FaFutbol } from "react-icons/fa";

export default function TorneoPublico() {
    const { id } = useParams();
    const [torneo, setTorneo] = useState(null);
    const [zonas, setZonas] = useState([]);
    const [zonaActiva, setZonaActiva] = useState(null);
    const [posiciones, setPosiciones] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarTorneo = async () => {
            try {
                const data = await apiFetch("/api/torneos/activos");
                const t = data.find(item => item.id === Number(id));
                if (t) {
                    setTorneo(t);
                    setZonas(t.zonas || []);
                    setZonaActiva(t.zonas?.[0] ?? null);
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
        <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center gap-4">
            <FaFutbol className="text-4xl text-emerald-500 animate-spin" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center italic">Sincronizando Torneo...</span>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans">
            <Navbar />

            <main className="max-w-[1100px] mx-auto p-4 md:p-8">
                {/* ENCABEZADO ESTILO PREMIUM */}
                <div className="text-center mt-12 mb-12">
                    <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white">
                        {torneo.nombre} <span className="text-emerald-500 block md:inline">Divisional "{torneo.division}"</span>
                    </h1>
                    <div className="h-1 w-24 bg-emerald-600 mx-auto mt-6 rounded-full shadow-lg shadow-emerald-900/20" />
                </div>

                {/* SELECTOR DE ZONAS ESTILO "BADGE" */}
                <div className="flex justify-center gap-2 mb-12 flex-wrap bg-[#1e293b] p-2 rounded-2xl border border-slate-700/50 w-fit mx-auto">
                    {zonas.map(z => (
                        <button
                            key={z.id}
                            onClick={() => setZonaActiva(z)}
                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all border ${
                                zonaActiva?.id === z.id
                                    ? "bg-emerald-600 text-white border-emerald-500 shadow-lg"
                                    : "bg-transparent text-slate-500 border-transparent hover:text-slate-300"
                            }`}
                        >
                            {z.nombre}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-10">
                    {/* TABLA DE POSICIONES */}
                    <section className="bg-[#1e293b] rounded-3xl border border-slate-700/50 overflow-hidden shadow-2xl">
                        <div className="bg-[#111827]/50 px-8 py-5 border-b border-slate-700/50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FaTrophy className="text-emerald-500 text-lg" />
                                <h2 className="font-black uppercase italic tracking-wider text-xs text-white">Tabla de Posiciones</h2>
                            </div>
                            <span className="text-[9px] font-bold text-slate-500 uppercase bg-[#0f172a] px-3 py-1 rounded-full border border-slate-700/50">
                                {zonaActiva?.nombre}
                            </span>
                        </div>
                        <div className="p-2 md:p-6 overflow-x-auto">
                            {loading ? (
                                <div className="py-20 flex flex-col items-center gap-3">
                                    <div className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                                </div>
                            ) : (
                                <TablaPosiciones posiciones={posiciones} />
                            )}
                        </div>
                    </section>

                    {/* FIXTURE / PROGRAMACIÓN */}
                    <section className="bg-[#1e293b] rounded-3xl border border-slate-700/50 overflow-hidden shadow-2xl">
                        <div className="bg-[#111827]/50 px-8 py-5 border-b border-slate-700/50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FaCalendarAlt className="text-emerald-500 text-lg" />
                                <h2 className="font-black uppercase italic tracking-wider text-xs text-white">Fixture de Jornadas</h2>
                            </div>
                            <span className="text-[9px] font-bold text-slate-500 uppercase bg-[#0f172a] px-3 py-1 rounded-full border border-slate-700/50">
                                {zonaActiva?.nombre}
                            </span>
                        </div>
                        <div className="p-2 md:p-8">
                            {zonaActiva && (
                                torneo.tipo === "CERRADO"
                                    ? <FixtureTorneo zonaId={zonaActiva.id} />
                                    : <ProgramacionComoFixture zonaId={zonaActiva.id} />
                            )}
                        </div>
                    </section>
                </div>

                <footer className="mt-20 mb-10 text-center">
                    <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.4em] italic">
                        Plataforma Oficial Liga Jujeña • 2025
                    </p>
                </footer>
            </main>
        </div>
    );
}