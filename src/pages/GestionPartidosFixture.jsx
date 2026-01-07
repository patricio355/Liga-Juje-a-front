import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api";
import { FaArrowLeft, FaFutbol, FaChevronDown, FaChevronLeft, FaChevronRight } from "react-icons/fa";

import Navbar from "../components/Navbar";
import PartidoGestionCard from "../components/torneo/PartidoGestionCard";

// Tus Modales
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
        <div className="min-h-screen bg-[#02040a] text-slate-200">
            <Navbar />
            <main className="max-w-[1100px] mx-auto p-4 md:px-8">

                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-emerald-500 mb-6 uppercase text-[10px] font-black transition-colors">
                    <FaArrowLeft /> Regresar
                </button>

                <header className="text-center mb-10">
                    <h1 className="text-4xl md:text-6xl font-black italic uppercase text-white leading-none">
                        PANEL <span className="text-emerald-500">GESTIÓN</span>
                    </h1>
                    {torneo && (
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-2">
                            {torneo.nombre} • {torneo.division}
                        </p>
                    )}
                </header>

                {/* SELECTOR ZONA */}
                <div className="relative mb-8 flex justify-center z-50">
                    <div className="relative w-fit min-w-[180px]">
                        <div onClick={() => setMenuAbierto(!menuAbierto)} className="flex items-center justify-between gap-4 bg-[#0e1630] px-5 py-3 rounded-xl border border-blue-900/40 cursor-pointer hover:border-emerald-500/50 transition-all">
                            <span className="text-[11px] font-black text-emerald-400 uppercase tracking-widest">{zonaActiva?.nombre || "ZONA"}</span>
                            <FaChevronDown size={10} className={`text-emerald-500 transition-transform ${menuAbierto ? "rotate-180" : ""}`} />
                        </div>
                        {menuAbierto && (
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-full mt-2 bg-[#0e1630] border border-blue-800 rounded-xl p-1 shadow-2xl z-50">
                                {zonas.map(z => (
                                    <button key={z.id} onClick={() => { setZonaActiva(z); setMenuAbierto(false); setFechaSeleccionada(null); }} className={`w-full px-3 py-2.5 rounded-lg text-[10px] font-black uppercase text-center mb-1 transition-colors ${zonaActiva?.id === z.id ? "bg-emerald-600 text-white" : "text-slate-400 hover:bg-emerald-900/40"}`}>
                                        {z.nombre}
                                    </button>
                                ))}
                            </div>
                        )}
                        {menuAbierto && <div className="fixed inset-0 z-[-1]" onClick={() => setMenuAbierto(false)}></div>}
                    </div>
                </div>

                {/* SELECTOR JORNADAS (FLECHAS ORIGINALES Y CENTRADO) */}
                <div className="bg-[#050814]/90 border border-blue-900/40 rounded-3xl p-6 mb-10 flex flex-col items-center gap-4">
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">JORNADA</span>
                    <div className="flex items-center justify-center gap-4 w-full">

                        <button
                            onClick={() => setFechaSeleccionada(f => Math.max(fixture[0]?.numeroFecha || 1, f - 1))}
                            disabled={!fixture.length || fechaSeleccionada === fixture[0]?.numeroFecha}
                            className="w-10 h-10 flex items-center justify-center rounded-full border border-blue-900/60 text-emerald-400 bg-[#02040a] disabled:opacity-20 hover:border-emerald-500 transition-all"
                        >
                            <FaChevronLeft size={12} />
                        </button>

                        <div className="flex items-center gap-2">
                            {fixture.map(f => (
                                <button
                                    key={f.numeroFecha}
                                    onClick={() => setFechaSeleccionada(f.numeroFecha)}
                                    className={`w-10 h-10 rounded-xl text-xs font-black border transition-all ${fechaSeleccionada === f.numeroFecha ? "bg-emerald-600 text-white border-emerald-400 shadow-lg scale-110" : "bg-[#02040a] text-emerald-900 border-blue-900/40 hover:text-emerald-400"}`}
                                >
                                    {f.numeroFecha}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setFechaSeleccionada(f => Math.min(fixture[fixture.length - 1]?.numeroFecha || 1, f + 1))}
                            disabled={!fixture.length || fechaSeleccionada === fixture[fixture.length - 1]?.numeroFecha}
                            className="w-10 h-10 flex items-center justify-center rounded-full border border-blue-900/60 text-emerald-400 bg-[#02040a] disabled:opacity-20 hover:border-emerald-500 transition-all"
                        >
                            <FaChevronRight size={12} />
                        </button>

                    </div>
                </div>

                <div className="space-y-4 pb-20">
                    {loading ? (
                        <div className="py-20 flex justify-center"><FaFutbol className="animate-spin text-emerald-500 text-3xl" /></div>
                    ) : (
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
                    )}
                </div>
            </main>

            <CerrarPartidoModal open={modalCerrar} partido={partidoSeleccionado} onClose={() => setModalCerrar(false)} onSuccess={cargarFixture} />
            <EditarResultadoModal open={modalEditar} partido={partidoSeleccionado} onClose={() => setModalEditar(false)} onSuccess={cargarFixture} />
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