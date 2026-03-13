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
        <div className="min-h-screen bg-black text-slate-200">
            <Navbar />
            <main className="max-w-[1200px] mx-auto p-4 md:px-8">

                {/* Botón Volver Resaltado */}
                <div className="mt-8 mb-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-3 bg-white text-black px-6 py-2.5 rounded-full hover:bg-slate-200 transition-all group shadow-[0_0_20px_rgba(255,255,255,0.15)] active:scale-95 uppercase text-[10px] font-black tracking-widest"
                    >
                        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> REGRESAR AL PANEL
                    </button>
                </div>

                {/* Header Principal Imponente */}
                <header className="bg-[#0a0a0a] p-8 md:p-12 rounded-[3rem] border border-white/10 mb-10 shadow-2xl relative">
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-10 relative z-10">

                        <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                            {/* Logo/Imagen del Torneo */}
                            <div className="w-32 h-32 md:w-40 md:h-40 bg-black rounded-[2.5rem] border border-white/10 p-4 shadow-inner flex items-center justify-center shrink-0">
                                {torneo?.fotoUrl ? (
                                    <img src={torneo.fotoUrl} alt="Logo Torneo" className="w-full h-full object-contain" />
                                ) : (
                                    <FaShieldAlt className="text-white/20 text-6xl" />
                                )}
                            </div>

                            <div>
                                <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-white leading-[0.9]">
                                    {torneo?.nombre || "CARGANDO..."}
                                </h1>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4">
                                    <span className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-white text-[10px] font-black uppercase tracking-[0.2em]">
                                        Gestión de Partidos
                                    </span>
                                    {torneo && (
                                        <span className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em]">
                                            División: {torneo.division}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Selector de Zona Silver */}
                        <div className="relative w-full md:w-auto">
                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 block text-center md:text-left ml-2">Seleccionar Grupo</label>
                            <div
                                onClick={() => setMenuAbierto(!menuAbierto)}
                                className="flex items-center justify-between gap-8 bg-black px-8 py-5 rounded-[1.5rem] border border-white/10 cursor-pointer hover:border-white/30 transition-all min-w-[240px] shadow-2xl"
                            >
                                <span className="text-[12px] font-black text-white uppercase tracking-widest flex items-center gap-3">
                                    <FaShieldAlt size={14} /> {zonaActiva?.nombre || "ZONA"}
                                </span>
                                <FaChevronDown size={10} className={`text-white transition-transform ${menuAbierto ? "rotate-180" : ""}`} />
                            </div>
                            {menuAbierto && (
                                <div className="absolute top-[calc(100%+10px)] right-0 w-full bg-[#111] border border-white/10 rounded-[1.5rem] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-50 animate-in fade-in slide-in-from-top-2 duration-200 max-h-[400px] overflow-y-auto">
                                    {zonas.map(z => (
                                        <button
                                            key={z.id}
                                            onClick={() => { setZonaActiva(z); setMenuAbierto(false); setFechaSeleccionada(null); }}
                                            className={`w-full px-5 py-4 rounded-xl text-[11px] font-black uppercase text-left transition-all mb-1 last:mb-0 ${zonaActiva?.id === z.id ? "bg-white text-black" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}
                                        >
                                            {z.nombre}
                                        </button>
                                    ))}
                                </div>
                            )}
                            {menuAbierto && <div className="fixed inset-0 z-[-1]" onClick={() => setMenuAbierto(false)}></div>}
                        </div>
                    </div>
                </header>

                {/* Selector Jornadas Silver */}
                <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-10 mb-12 shadow-xl flex flex-col items-center gap-8">
                    <div className="flex items-center gap-4">
                        <FaRegCalendarAlt className="text-white" size={16} />
                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em]">Cronograma de Jornadas</span>
                    </div>

                    <div className="flex items-center justify-center gap-6 w-full">
                        <button
                            onClick={() => setFechaSeleccionada(f => Math.max(fixture[0]?.numeroFecha || 1, f - 1))}
                            disabled={!fixture.length || fechaSeleccionada === fixture[0]?.numeroFecha}
                            className="w-14 h-14 flex items-center justify-center rounded-full border border-white/10 text-white bg-black disabled:opacity-10 hover:bg-white hover:text-black transition-all"
                        >
                            <FaChevronLeft size={18} />
                        </button>

                        <div className="flex flex-wrap items-center justify-center gap-4">
                            {fixture.map(f => (
                                <button
                                    key={f.numeroFecha}
                                    onClick={() => setFechaSeleccionada(f.numeroFecha)}
                                    className={`w-14 h-14 rounded-2xl text-base font-black border transition-all active:scale-90 ${fechaSeleccionada === f.numeroFecha ? "bg-white text-black border-white shadow-[0_0_30px_rgba(255,255,255,0.2)] scale-110" : "bg-black text-slate-600 border-white/5 hover:text-white hover:border-white/20"}`}
                                >
                                    {f.numeroFecha}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setFechaSeleccionada(f => Math.min(fixture[fixture.length - 1]?.numeroFecha || 1, f + 1))}
                            disabled={!fixture.length || fechaSeleccionada === fixture[fixture.length - 1]?.numeroFecha}
                            className="w-14 h-14 flex items-center justify-center rounded-full border border-white/10 text-white bg-black disabled:opacity-10 hover:bg-white hover:text-black transition-all"
                        >
                            <FaChevronRight size={18} />
                        </button>
                    </div>
                </div>

                {/* Lista de Partidos */}
                <div className="space-y-6 pb-32">
                    {loading ? (
                        <div className="py-32 flex flex-col items-center gap-4">
                            <div className="w-12 h-12 border-2 border-white/10 border-t-white rounded-full animate-spin" />
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Actualizando Fixture...</span>
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
                        <div className="py-24 text-center bg-[#0a0a0a] border border-dashed border-white/5 rounded-[3rem]">
                            <FaFutbol className="mx-auto text-white/5 mb-4 text-4xl" />
                            <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">No hay encuentros programados en esta fecha</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Modales */}
            <CerrarPartidoModal open={modalCerrar} partido={partidoSeleccionado} onClose={() => setModalCerrar(false)} onSuccess={cargarFixture} />
            <EditarResultadoModal open={modalEditar} partido={partidoSeleccionado} onClose={() => setModalEditar(false)} onSuccess={cargarFixture} />
            <EditarInfoModal open={modalEditarInfo} partido={partidoSeleccionado} zonaId={zonaActiva?.id} fecha={fechaSeleccionada} onClose={() => setModalEditarInfo(false)} onSuccess={cargarFixture} />
        </div>
    );
}