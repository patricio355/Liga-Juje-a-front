import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { apiFetch } from "../api/api";
import {
    getOpcionesProgramacion,
    getProgramacionFecha,
    programarPartido,
} from "../api/programacion.api";
import FilaProgramacion from "../components/programacion/FilaProgramacion";
import PartidoCardAdmin from "../components/torneo/PartidoCardAdmin.jsx";
import CerrarPartidoModal from "../components/modal/CerrarPartidoModal.jsx";
import EditarResultadoModal from "../components/modal/EditarResultadoModal.jsx";
import EditarInfoModal from "../components/modal/EditarInfoModal.jsx";
import { FaArrowLeft, FaUserCircle, FaExclamationTriangle, FaPlus, FaFutbol, FaCalendarAlt } from "react-icons/fa";

export default function ProgramacionZona() {
    const { zonaId } = useParams();
    const navigate = useNavigate();

    const [totalFechas, setTotalFechas] = useState(1);
    const [fechaSeleccionada, setFechaSeleccionada] = useState(1);
    const [tarjetas, setTarjetas] = useState([]);
    const [programados, setProgramados] = useState([]);
    const [nombreZona, setNombreZona] = useState("");
    const [openEquipoId, setOpenEquipoId] = useState(null);
    const [loading, setLoading] = useState(true);

    const [partidoSeleccionado, setPartidoSeleccionado] = useState(null);
    const [modalCerrar, setModalCerrar] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const [modalEditarInfo, setModalEditarInfo] = useState(false);

    const userEmail = "m@gmail.com";

    const obtenerNombreZona = useCallback(async () => {
        try {
            const data = await apiFetch(`/api/zonas/${zonaId}`);
            if (data?.nombre) setNombreZona(data.nombre);
        } catch (error) { console.error("Error nombre zona:", error); }
    }, [zonaId]);

    const cargarTodo = useCallback(async () => {
        setLoading(true);
        try {
            const fechasReales = await apiFetch(`/api/programacion/zona/${zonaId}/fechas-disponibles`);
            if (Array.isArray(fechasReales) && fechasReales.length > 0) {
                const maxFecha = Math.max(...fechasReales);
                if (maxFecha > totalFechas) setTotalFechas(maxFecha);
            }

            const [opciones, prog] = await Promise.all([
                getOpcionesProgramacion(zonaId, fechaSeleccionada),
                getProgramacionFecha(zonaId, fechaSeleccionada)
            ]);

            setTarjetas(opciones || []);
            setProgramados(prog || []);
            setOpenEquipoId(null);
        } catch (error) {
            console.error("Error cargando datos:", error);
        } finally {
            setLoading(false);
        }
    }, [zonaId, fechaSeleccionada, totalFechas]);

    useEffect(() => {
        if (zonaId) {
            cargarTodo();
            obtenerNombreZona();
        }
    }, [zonaId, fechaSeleccionada, cargarTodo, obtenerNombreZona]);

    const agregarFecha = () => {
        setTotalFechas(prev => prev + 1);
        setFechaSeleccionada(totalFechas + 1);
    };

    const handleSeleccionDirecta = async (partidoId) => {
        try {
            await programarPartido(zonaId, fechaSeleccionada, partidoId);
            await cargarTodo();
        } catch (error) {
            alert("Error al programar: Verifique sus permisos");
        }
    };

    const programadosIds = useMemo(() => new Set((programados || []).map(p => p.partidoId)), [programados]);

    const equiposOcupadosSet = useMemo(() => {
        const set = new Set();
        (programados || []).forEach(p => {
            set.add(p.local || p.equipoLocalNombre);
            set.add(p.visitante || p.equipoVisitanteNombre);
        });
        return set;
    }, [programados]);

    const equiposDuplicados = useMemo(() => {
        const conteo = {};
        (programados || []).forEach(p => {
            const l = p.local || p.equipoLocalNombre;
            const v = p.visitante || p.equipoVisitanteNombre;
            if (l) conteo[l] = (conteo[l] || 0) + 1;
            if (v) conteo[v] = (conteo[v] || 0) + 1;
        });
        return new Set(Object.keys(conteo).filter(n => conteo[n] > 1));
    }, [programados]);

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans">
            <Navbar />
            <main className="p-4 md:p-8 max-w-[1500px] mx-auto w-full">

                <div className="flex justify-between items-center mb-10">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-emerald-500 transition group">
                        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-black uppercase text-[10px] tracking-widest">Volver</span>
                    </button>
                    <div className="bg-[#1e293b] px-4 py-2 rounded-xl border border-slate-700/50 flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest shadow-lg">
                        <FaUserCircle className="text-emerald-500 text-sm" /> {userEmail}
                    </div>
                </div>

                <div className="text-center lg:text-left mb-12">
                    <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-white">
                        Programación <span className="text-emerald-500">"{nombreZona || '...'}"</span>
                    </h1>
                </div>

                <div className="flex items-center gap-4 mb-12 bg-[#1e293b] p-3 rounded-2xl border border-slate-700/50 w-fit overflow-x-auto">
                    <div className="flex gap-2">
                        {Array.from({ length: totalFechas }, (_, i) => i + 1).map((f) => (
                            <button
                                key={`btn-fecha-${f}`}
                                onClick={() => setFechaSeleccionada(f)}
                                className={`px-6 py-2 rounded-xl font-black text-[10px] uppercase transition-all ${
                                    fechaSeleccionada === f
                                        ? "bg-emerald-600 text-white shadow-lg border-emerald-500"
                                        : "bg-transparent text-slate-500 border border-transparent hover:text-slate-300"
                                }`}
                            > Fecha {f} </button>
                        ))}
                    </div>
                    <button onClick={agregarFecha} className="bg-emerald-600/10 hover:bg-emerald-600 text-emerald-500 hover:text-white border border-emerald-500/20 px-4 py-2 rounded-xl flex items-center gap-2 transition-all group shrink-0">
                        <FaPlus size={10} className="group-hover:rotate-90 transition-transform" />
                        <span className="text-[10px] font-black uppercase">Nueva Fecha</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-5 gap-10">
                    <section className="xl:col-span-3 space-y-6">
                        <div className="bg-[#1e293b] border border-slate-700/50 rounded-[2rem] p-8 shadow-2xl">
                            <div className="flex items-center gap-3 mb-8">
                                <FaFutbol className="text-emerald-500" />
                                <h2 className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">Enfrentamientos Disponibles</h2>
                            </div>

                            {loading ? (
                                <div className="py-20 flex flex-col items-center gap-3 opacity-30">
                                    <FaFutbol size={30} className="animate-spin" />
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {tarjetas.map((t) => (
                                        <FilaProgramacion
                                            key={t.equipoId}
                                            tarjeta={t}
                                            opciones={(t.opciones || []).filter(op => !op.jugado && !programadosIds.has(op.partidoId))}
                                            equipoYaProgramado={equiposOcupadosSet.has(t.equipoNombre)}
                                            open={openEquipoId === t.equipoId}
                                            onOpen={() => setOpenEquipoId(t.equipoId)}
                                            onClose={() => setOpenEquipoId(null)}
                                            onSelect={(op) => handleSeleccionDirecta(op.partidoId)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>

                    <aside className="xl:col-span-2">
                        <div className="bg-[#1e293b] border border-slate-700/50 rounded-[2rem] p-6 shadow-2xl sticky top-24">

                            {/* CABECERA DERECHA CORREGIDA CON CARTEL ROJO */}
                            <div className="flex flex-wrap items-center justify-between gap-3 mb-8 px-2">
                                <div className="flex items-center gap-3">
                                    <FaCalendarAlt className="text-emerald-500" />
                                    <h2 className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">JORNADA {fechaSeleccionada}</h2>
                                </div>

                                {equiposDuplicados.size > 0 && (
                                    <div className="flex items-center gap-2 bg-red-600/20 border border-red-500/50 px-3 py-1.5 rounded-xl animate-pulse">
                                        <FaExclamationTriangle className="text-red-500" size={12} />
                                        <span className="text-red-500 text-[9px] font-black uppercase tracking-wider">Equipos con 2 partidos</span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3">
                                {programados.length === 0 ? (
                                    <div className="py-16 text-center border border-dashed border-slate-700/50 rounded-2xl">
                                        <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest italic">Sin partidos</p>
                                    </div>
                                ) : (
                                    programados.map((p) => (
                                        <PartidoCardAdmin
                                            key={p.programacionId || p.partidoId}
                                            partido={p}
                                            equiposDuplicados={equiposDuplicados}
                                            onCerrar={() => { setPartidoSeleccionado(p); setModalCerrar(true); }}
                                            onEditar={() => { setPartidoSeleccionado(p); setModalEditar(true); }}
                                            onEditarInfo={() => { setPartidoSeleccionado(p); setModalEditarInfo(true); }}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            <CerrarPartidoModal open={modalCerrar} partido={partidoSeleccionado} onClose={() => setModalCerrar(false)} onSuccess={cargarTodo} />
            <EditarResultadoModal open={modalEditar} partido={partidoSeleccionado} onClose={() => setModalEditar(false)} onSuccess={cargarTodo} />
            <EditarInfoModal
                open={modalEditarInfo}
                partido={partidoSeleccionado}
                zonaId={zonaId}
                fecha={fechaSeleccionada}
                onClose={() => setModalEditarInfo(false)}
                onSuccess={cargarTodo}
            />
        </div>
    );
}