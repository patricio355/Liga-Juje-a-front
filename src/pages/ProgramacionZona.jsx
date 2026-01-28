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
import { FaArrowLeft, FaUserCircle, FaExclamationTriangle, FaPlus, FaFutbol, FaCalendarAlt, FaMinus } from "react-icons/fa";
import Swal from 'sweetalert2';

export default function ProgramacionZona() {
    const { zonaId } = useParams();
    const navigate = useNavigate();

    const [totalFechas, setTotalFechas] = useState(1);
    const [fechaSeleccionada, setFechaSeleccionada] = useState(1);
    const [tarjetas, setTarjetas] = useState([]);
    const [programados, setProgramados] = useState([]);
    const [nombreZona, setNombreZona] = useState("");
    const [nombreTorneo, setNombreTorneo] = useState("");
    const [openEquipoId, setOpenEquipoId] = useState(null);
    const [loading, setLoading] = useState(true);

    const [partidoSeleccionado, setPartidoSeleccionado] = useState(null);
    const [modalCerrar, setModalCerrar] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const [modalEditarInfo, setModalEditarInfo] = useState(false);

    const userEmail = "";

    const obtenerNombres = useCallback(async () => {
        try {
            const zonaData = await apiFetch(`/api/zonas/${zonaId}`);
            if (zonaData?.nombre) setNombreZona(zonaData.nombre);
            if (zonaData?.torneoNombre) {
                setNombreTorneo(zonaData.torneoNombre);
            } else if (zonaData?.torneo?.nombre) {
                setNombreTorneo(zonaData.torneo.nombre);
            }
        } catch (error) {
            console.error("Error obteniendo nombres:", error);
        }
    }, [zonaId]);

    const cargarTodo = useCallback(async () => {
        setLoading(true);
        setTarjetas([]);
        setProgramados([]);
        setOpenEquipoId(null);

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
        } catch (error) {
            console.error("Error en la carga:", error);
        } finally {
            setLoading(false);
        }
    }, [zonaId, fechaSeleccionada, totalFechas]);

    useEffect(() => {
        if (zonaId) {
            cargarTodo();
            obtenerNombres();
        }
    }, [zonaId, fechaSeleccionada, cargarTodo, obtenerNombres]);

    const agregarFecha = () => {
        setTotalFechas(prev => prev + 1);
        setFechaSeleccionada(totalFechas + 1);
    };

    const quitarUltimaFecha = () => {
        // Validación de seguridad adicional
        if (totalFechas <= 1) return;

        // Validación de partidos (Importante para tu proyecto de Analista)
        if (programados.length > 0) {
            Swal.fire({
                title: 'Fecha con partidos',
                text: 'Esta fecha contiene partidos programados. Debés eliminarlos antes de quitar la fecha.',
                icon: 'error',
                background: '#0a0f2c',
                color: '#cbd5e1'
            });
            return;
        }

        setTotalFechas(prev => prev - 1);
        setFechaSeleccionada(prev => prev - 1);

        Swal.fire({
            title: 'Fecha eliminada',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            background: '#0a0f2c',
            color: '#cbd5e1'
        });
    };

    const handleSeleccionDirecta = async (partidoId) => {
        try {
            await programarPartido(zonaId, fechaSeleccionada, partidoId);
            await cargarTodo();
        } catch (error) {
            alert("Error al programar");
        }
    };

    const handleEliminarPartido = (p) => {
        Swal.fire({
            title: '¿Eliminar partido?',
            text: "Se borrará de la programación y los equipos volverán a estar disponibles. Si el partido está finalizado, se borrarán los datos",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#0f172a',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            background: '#0a0f2c',
            color: '#cbd5e1'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await apiFetch(`/api/partidos/${p.partidoId}`, { method: 'DELETE' });
                    Swal.fire({
                        title: 'Eliminado',
                        icon: 'success',
                        background: '#0a0f2c',
                        color: '#cbd5e1',
                        timer: 1500,
                        showConfirmButton: false
                    });
                    await cargarTodo();
                } catch (error) {
                    Swal.fire('Error', 'No se pudo eliminar el partido', 'error');
                }
            }
        });
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
        <div className="min-h-screen bg-[#05081c] text-slate-200">
            <Navbar />
            <main className="p-4 md:p-8 max-w-[1500px] mx-auto w-full">

                <div className="flex justify-between items-center mb-10">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-cyan-500 transition-all group">
                        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold uppercase text-[10px] tracking-widest text-white">Volver</span>
                    </button>
                    <div className="bg-[#0a0f2c] px-4 py-2 rounded-xl border border-slate-800 flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest shadow-lg">
                        <FaUserCircle className="text-cyan-500 text-sm" /> {userEmail || "ADMIN"}
                    </div>
                </div>

                <div className="text-center lg:text-left mb-12 px-2">
                    <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-white mb-2 leading-none">
                        {nombreTorneo || "CARGANDO..."}
                    </h1>
                    <p className="text-slate-500 font-bold uppercase text-[11px] md:text-xs tracking-[0.3em] opacity-80 flex flex-col lg:flex-row lg:items-center">
                        Programación de fechas
                        <span className="hidden lg:inline mx-2 text-slate-800">|</span>
                        <span className="text-cyan-500 mt-2 lg:mt-0 italic font-black">"{nombreZona || '...'}"</span>
                    </p>
                </div>

                <div className="flex items-center gap-4 mb-12 bg-[#0a0f2c] p-3 rounded-2xl border border-slate-800 w-full lg:w-fit overflow-x-auto shadow-xl">
                    <div className="flex gap-2">
                        {Array.from({ length: totalFechas }, (_, i) => i + 1).map((f) => (
                            <button
                                key={`btn-fecha-${f}`}
                                onClick={() => setFechaSeleccionada(f)}
                                className={`px-6 py-2 rounded-xl font-bold text-[10px] uppercase transition-all ${
                                    fechaSeleccionada === f
                                        ? "bg-cyan-600 text-white shadow-lg border-cyan-500"
                                        : "bg-transparent text-slate-500 border border-transparent hover:text-slate-300 hover:bg-slate-800"
                                }`}
                            > Fecha {f} </button>
                        ))}
                    </div>

                    <div className="flex gap-2 ml-4 pl-4 border-l border-slate-800">
                        <button onClick={agregarFecha} className="bg-cyan-600/10 hover:bg-cyan-600 text-cyan-500 hover:text-white border border-cyan-500/20 px-4 py-2 rounded-xl flex items-center gap-2 transition-all group shrink-0">
                            <FaPlus size={10} className="group-hover:rotate-90 transition-transform" />
                            <span className="text-[10px] font-bold uppercase">Nueva Fecha</span>
                        </button>

                        {/* REGLA: Solo aparece si NO es la Fecha 1 Y si es la ÚLTIMA FECHA de la lista */}
                        {fechaSeleccionada !== 1 && fechaSeleccionada === totalFechas && (
                            <button
                                onClick={quitarUltimaFecha}
                                className="bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/20 px-4 py-2 rounded-xl flex items-center gap-2 transition-all group shrink-0 animate-in fade-in zoom-in duration-300"
                            >
                                <FaMinus size={10} />
                                <span className="text-[10px] font-bold uppercase">Quitar Fecha</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Resto del contenido (Grid de enfrentamientos y Aside) se mantiene igual */}
                <div className="grid grid-cols-1 xl:grid-cols-5 gap-10">
                    <section className="xl:col-span-3 space-y-6">
                        <div className="bg-[#0a0f2c] border border-slate-800 rounded-[2.5rem] p-6 md:p-8 shadow-2xl relative overflow-hidden">
                            <div className="flex items-center gap-3 mb-8">
                                <FaFutbol className="text-cyan-500" />
                                <h2 className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em]">Enfrentamientos Disponibles</h2>
                            </div>

                            {loading ? (
                                <div className="py-20 flex flex-col items-center gap-3 opacity-30">
                                    <div className="w-10 h-10 border-4 border-cyan-500/10 border-t-cyan-500 rounded-full animate-spin"></div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {tarjetas.length === 0 ? (
                                        <div className="py-20 text-center border border-dashed border-slate-800 rounded-2xl">
                                            <p className="text-slate-700 text-[10px] font-bold uppercase tracking-widest">No hay equipos para programar</p>
                                        </div>
                                    ) : (
                                        tarjetas.map((t) => (
                                            <FilaProgramacion
                                                key={t.equipoId}
                                                tarjeta={t}
                                                opciones={(t.opciones || []).filter(op => !programadosIds.has(op.partidoId))}
                                                equipoYaProgramado={equiposOcupadosSet.has(t.equipoNombre)}
                                                open={openEquipoId === t.equipoId}
                                                onOpen={() => setOpenEquipoId(t.equipoId)}
                                                onClose={() => setOpenEquipoId(null)}
                                                onSelect={(op) => handleSeleccionDirecta(op.partidoId)}
                                            />
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    </section>

                    <aside className="xl:col-span-2">
                        <div className="bg-[#0a0f2c] border border-slate-800 rounded-[2.5rem] p-6 shadow-2xl sticky top-24">
                            <div className="flex flex-wrap items-center justify-between gap-3 mb-8 px-2">
                                <div className="flex items-center gap-3">
                                    <FaCalendarAlt className="text-cyan-500" />
                                    <h2 className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em]">FECHA {fechaSeleccionada}</h2>
                                </div>
                                {equiposDuplicados.size > 0 && (
                                    <div className="flex items-center gap-2 bg-red-600/20 border border-red-500/50 px-3 py-1.5 rounded-xl">
                                        <FaExclamationTriangle className="text-red-500" size={12} />
                                        <span className="text-red-500 text-[9px] font-bold uppercase tracking-wider">Juega 2 partidos</span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3">
                                {programados.length === 0 ? (
                                    <div className="py-16 text-center border border-dashed border-slate-800 rounded-2xl">
                                        <p className="text-slate-700 text-[10px] font-bold uppercase tracking-widest">Sin partidos programados</p>
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
                                            onEliminar={() => handleEliminarPartido(p)}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            <CerrarPartidoModal
                open={modalCerrar}
                partido={partidoSeleccionado}
                onClose={() => setModalCerrar(false)}
                onSuccess={cargarTodo}
            />
            <EditarResultadoModal
                open={modalEditar}
                partido={partidoSeleccionado}
                onClose={() => setModalEditar(false)}
                onSuccess={cargarTodo}
            />
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