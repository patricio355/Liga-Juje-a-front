import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api";
import {
    FaArrowLeft, FaFutbol, FaChevronDown, FaChevronLeft,
    FaChevronRight, FaCogs, FaRegCalendarAlt, FaShieldAlt
} from "react-icons/fa";

import Navbar from "../components/Navbar";
import PartidoGestionCard from "../components/torneo/PartidoGestionCard";

// Modales
import CerrarPartidoModal from "../components/modal/CerrarPartidoModal.jsx";
import EditarResultadoModal from "../components/modal/EditarResultadoModal.jsx";
import EditarInfoModal from "../components/modal/EditarInfoModal.jsx";

export default function GestionPartidosFixture() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [torneo, setTorneo] = useState(null);
    const [zonas, setZonas] = useState([]);
    const [zonaActiva, setZonaActiva] = useState(null);
    const [fixture, setFixture] = useState([]);
    const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
    const [loading, setLoading] = useState(true);
    const [menuAbierto, setMenuAbierto] = useState(false);

    const [partidoSeleccionado, setPartidoSeleccionado] = useState(null);
    const [modalCerrar, setModalCerrar] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const [modalEditarInfo, setModalEditarInfo] = useState(false);

    const ordenarPartidos = (partidos) => {
        return [...partidos].sort((a, b) => {
            const canchaA = (a.canchaNombre || a.cancha || "ZZZ").toLowerCase();
            const canchaB = (b.canchaNombre || b.cancha || "ZZZ").toLowerCase();
            if (canchaA < canchaB) return -1;
            if (canchaA > canchaB) return 1;
            const horaA = a.hora || a.Hora || "99:99";
            const horaB = b.hora || b.Hora || "99:99";
            return horaA.localeCompare(horaB);
        });
    };

    const cargarTorneo = useCallback(async () => {
        try {
            const data = await apiFetch(`/api/torneos/${id}?t=${new Date().getTime()}`);
            setTorneo(data);
            setZonas(data.zonas || []);
            if (data.zonas?.length > 0 && !zonaActiva) setZonaActiva(data.zonas[0]);
        } catch (e) { console.error(e); }
    }, [id, zonaActiva]);

    const cargarFixture = useCallback(async () => {
        if (!zonaActiva) return;
        setLoading(true);
        try {
            const data = await apiFetch(`/api/partidos/zona/${zonaActiva.id}/fixture?t=${new Date().getTime()}`);
            const fixtureArray = Array.isArray(data) ? data : [];
            setFixture(fixtureArray);
            if (fixtureArray.length > 0 && !fechaSeleccionada) {
                setFechaSeleccionada(fixtureArray[0].numeroFecha);
            }
        } catch (e) {
            console.error(e);
            setFixture([]);
        }
        finally { setLoading(false); }
    }, [zonaActiva, fechaSeleccionada]);

    useEffect(() => { cargarTorneo(); }, [id]);
    useEffect(() => { cargarFixture(); }, [zonaActiva]);

    return (
        <div className="min-h-screen bg-[#05081c] text-slate-200">
            <Navbar />
            <main className="max-w-[1200px] mx-auto p-4 md:px-8">

                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-500 hover:text-cyan-400 mt-6 mb-8 uppercase text-[10px] font-black tracking-widest transition-all group"
                >
                    <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> REGRESAR AL PANEL
                </button>

                {/* Header Profesional */}
                <header className="bg-[#0a0f2c] p-8 rounded-[2.5rem] border border-slate-800 mb-10 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-6">
                        <div className="bg-[#040714] p-5 rounded-2xl border border-slate-800 text-cyan-500 shadow-inner">
                            <FaCogs size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-white leading-none">
                                GESTIÓN DE <span className="text-cyan-500">PARTIDOS</span>
                            </h1>
                            {torneo && (
                                <p className="text-cyan-500/60 font-bold uppercase text-[10px] tracking-[0.4em] mt-3">
                                    {torneo.nombre} • DIV. {torneo.division}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Selector de Zona Estilizado */}
                    <div className="relative z-50">
                        <div
                            onClick={() => setMenuAbierto(!menuAbierto)}
                            className="flex items-center justify-between gap-6 bg-[#040714] px-6 py-4 rounded-2xl border border-slate-800 cursor-pointer hover:border-cyan-500/50 transition-all min-w-[200px] shadow-lg"
                        >
                            <span className="text-[11px] font-black text-cyan-500 uppercase tracking-widest flex items-center gap-2">
                                <FaShieldAlt size={12} /> {zonaActiva?.nombre || "ZONA"}
                            </span>
                            <FaChevronDown size={10} className={`text-cyan-500 transition-transform ${menuAbierto ? "rotate-180" : ""}`} />
                        </div>
                        {menuAbierto && (
                            <div className="absolute top-full right-0 w-full mt-2 bg-[#0a0f2c] border border-slate-800 rounded-2xl p-2 shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-50 animate-in fade-in zoom-in-95 duration-200">
                                {zonas.map(z => (
                                    <button
                                        key={z.id}
                                        onClick={() => { setZonaActiva(z); setMenuAbierto(false); setFechaSeleccionada(null); }}
                                        className={`w-full px-4 py-3 rounded-xl text-[10px] font-black uppercase text-left transition-all mb-1 last:mb-0 ${zonaActiva?.id === z.id ? "bg-cyan-600 text-white shadow-lg" : "text-slate-400 hover:bg-cyan-900/40 hover:text-cyan-400"}`}
                                    >
                                        {z.nombre}
                                    </button>
                                ))}
                            </div>
                        )}
                        {menuAbierto && <div className="fixed inset-0 z-[-1]" onClick={() => setMenuAbierto(false)}></div>}
                    </div>
                </header>

                {/* SELECTOR JORNADAS (Formato Champions) */}
                <div className="bg-[#0a0f2c] border border-slate-800 rounded-[2.5rem] p-8 mb-10 shadow-xl flex flex-col items-center gap-6">
                    <div className="flex items-center gap-3">
                        <FaRegCalendarAlt className="text-cyan-500" size={14} />
                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em]">JORNADA DEL FIXTURE</span>
                    </div>

                    <div className="flex items-center justify-center gap-5 w-full">
                        <button
                            onClick={() => setFechaSeleccionada(f => Math.max(fixture[0]?.numeroFecha || 1, f - 1))}
                            disabled={!fixture.length || fechaSeleccionada === fixture[0]?.numeroFecha}
                            className="w-12 h-12 flex items-center justify-center rounded-full border border-slate-800 text-cyan-400 bg-[#040714] disabled:opacity-20 hover:border-cyan-500 hover:text-white transition-all shadow-inner"
                        >
                            <FaChevronLeft size={16} />
                        </button>

                        <div className="flex flex-wrap items-center justify-center gap-3">
                            {fixture.map(f => (
                                <button
                                    key={f.numeroFecha}
                                    onClick={() => setFechaSeleccionada(f.numeroFecha)}
                                    className={`w-12 h-12 rounded-2xl text-sm font-black border transition-all active:scale-95 ${fechaSeleccionada === f.numeroFecha ? "bg-cyan-600 text-white border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] scale-110" : "bg-[#040714] text-slate-600 border-slate-800 hover:text-cyan-400 hover:border-cyan-900"}`}
                                >
                                    {f.numeroFecha}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setFechaSeleccionada(f => Math.min(fixture[fixture.length - 1]?.numeroFecha || 1, f + 1))}
                            disabled={!fixture.length || fechaSeleccionada === fixture[fixture.length - 1]?.numeroFecha}
                            className="w-12 h-12 flex items-center justify-center rounded-full border border-slate-800 text-cyan-400 bg-[#040714] disabled:opacity-20 hover:border-cyan-500 hover:text-white transition-all shadow-inner"
                        >
                            <FaChevronRight size={16} />
                        </button>
                    </div>
                </div>

                {/* Lista de Partidos */}
                <div className="space-y-6 pb-32">
                    {loading ? (
                        <div className="py-32 flex flex-col items-center gap-4">
                            <FaFutbol className="animate-spin text-cyan-500 text-5xl" />
                            <span className="text-[10px] font-black text-cyan-900 uppercase tracking-[0.3em]">Cargando Cronograma...</span>
                        </div>
                    ) : fixture.filter(f => f.numeroFecha === fechaSeleccionada).length > 0 ? (
                        fixture.filter(f => f.numeroFecha === fechaSeleccionada).map(fechaObj => (
                            ordenarPartidos(fechaObj.partidos).map(partido => (
                                <PartidoGestionCard
                                    key={partido.id || partido.partidoId}
                                    partido={{
                                        ...partido,
                                        equipoLocalNombre: partido.equipoLocalNombre || partido.local,
                                        equipoVisitanteNombre: partido.equipoVisitanteNombre || partido.visitante,
                                        equipoLocalEscudo: partido.equipoLocalEscudo || partido.localEscudo,
                                        equipoVisitanteEscudo: partido.equipoVisitanteEscudo || partido.visitanteEscudo,
                                        canchaNombre: partido.canchaNombre || partido.cancha,
                                        hora: partido.hora || partido.Hora,
                                        arbitro: partido.arbitro || partido.arbitroNombre,
                                        golesLocal: partido.golesLocal ?? partido.golesL,
                                        golesVisitante: partido.golesVisitante ?? partido.golesV,
                                        partidoId: partido.partidoId || partido.id
                                    }}
                                    onEditInfo={(p) => { setPartidoSeleccionado(p); setModalEditarInfo(true); }}
                                    onFinalize={(p) => { setPartidoSeleccionado(p); setModalCerrar(true); }}
                                    onEditResult={(p) => { setPartidoSeleccionado(p); setModalEditar(true); }}
                                />
                            ))
                        ))
                    ) : (
                        <div className="py-20 text-center bg-[#0a0f2c] border border-dashed border-slate-800 rounded-[2.5rem]">
                            <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">No hay partidos programados en esta jornada</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Modales con el nuevo sistema de estados */}
            <CerrarPartidoModal
                open={modalCerrar}
                partido={partidoSeleccionado}
                onClose={() => setModalCerrar(false)}
                onSuccess={cargarFixture}
            />
            <EditarResultadoModal
                open={modalEditar}
                partido={partidoSeleccionado}
                onClose={() => setModalEditar(false)}
                onSuccess={cargarFixture}
            />
            <EditarInfoModal
                open={modalEditarInfo}
                partido={partidoSeleccionado}
                zonaId={zonaActiva?.id}
                fecha={fechaSeleccionada}
                onClose={() => setModalEditarInfo(false)}
                onSuccess={cargarFixture}
            />
        </div>
    );
}