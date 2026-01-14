import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api";
import {
    FaArrowLeft, FaPlus, FaTrophy, FaTrash,
    FaEdit, FaCalendarAlt, FaMagic, FaCogs, FaCheckCircle, FaLock, FaFutbol, FaLayerGroup, FaInfoCircle,
    FaProjectDiagram, // Icono para Fase Final
    FaMars, FaVenus, FaVenusMars // Nuevos iconos
} from "react-icons/fa";

// Modales
import ModalInscribirEnZona from "../components/dashboard/ModalInscribirEnZona";
import ModalCrearZona from "../components/dashboard/ModalCrearZona";
import ModalEditarZona from "../components/dashboard/ModalEditarZona";
import ModalEditarTorneo from "../components/dashboard/ModalEditarTorneo";
import ModalEquipoEditar from "../components/equipos/ModalEditarEquipo";
import ModalCrearEquipo from "../components/equipos/ModalCrearEquipo";
import ConfirmarEliminacionModal from "../components/modal/ConfirmarEliminacionModal";
import Navbar from "../components/Navbar.jsx";

export default function TorneoDetalleAdmin() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [torneo, setTorneo] = useState(null);
    const [loading, setLoading] = useState(true);

    const [modalInscribir, setModalInscribir] = useState(false);
    const [modalZonaCrear, setModalZonaCrear] = useState(false);
    const [modalZonaEditar, setModalZonaEditar] = useState(false);
    const [modalTorneoEditar, setModalTorneoEditar] = useState(false);
    const [modalEquipoEditar, setModalEquipoEditar] = useState(false);
    const [modalEquipoCrear, setModalEquipoCrear] = useState(false);

    const [showTooltipMobile, setShowTooltipMobile] = useState(false);

    // ESTADOS PARA MODALES DE CONFIRMACIÓN
    const [modalConfirmar, setModalConfirmar] = useState({ open: false, type: null, id: null });
    const [modalConfirmarFixture, setModalConfirmarFixture] = useState(false);
    const [loadingAccion, setLoadingAccion] = useState(false);

    const [zonaSeleccionada, setZonaSeleccionada] = useState(null);
    const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);

    const cargarDatos = useCallback(async () => {
        try {
            const data = await apiFetch(`/api/torneos/${id}?t=${new Date().getTime()}`);
            setTorneo(data);
        } catch (error) {
            if (!loadingAccion && (error.status === 403 || error.status === 401)) {
                navigate("/dashboard/torneos");
            }
        } finally {
            setLoading(false);
        }
    }, [id, navigate, loadingAccion]);

    useEffect(() => {
        if (id) cargarDatos();
    }, [id, cargarDatos]);

    // LÓGICA DE ELIMINACIÓN UNIFICADA
    const ejecutarEliminacion = async () => {
        setLoadingAccion(true);
        try {
            if (modalConfirmar.type === 'ZONA') {
                await apiFetch(`/api/torneos/${torneo.id}/zonas/${modalConfirmar.id}`, { method: "DELETE" });
            } else if (modalConfirmar.type === 'EQUIPO') {
                await apiFetch(`/api/equipos-zona/${modalConfirmar.id}`, { method: "DELETE" });
            }
            await cargarDatos();
            setModalConfirmar({ open: false, type: null, id: null });
        } catch (error) {
            console.error("Error al eliminar:", error);
            alert(error.message || "Error al procesar la solicitud");
        } finally {
            setLoadingAccion(false);
        }
    };

    // FUNCIÓN: Ejecutar Generación de Fixture
    const handleEjecutarGenerarFixture = async () => {
        setLoadingAccion(true);
        try {
            const promesas = torneo.zonas.map(zona =>
                apiFetch(`/api/partidos/zona/${zona.id}/fixture`, { method: "POST" })
            );
            await Promise.all(promesas);
            await cargarDatos();
            setModalConfirmarFixture(false);
        } catch (error) {
            alert("Error al generar fixture");
        } finally {
            setLoadingAccion(false);
        }
    };

    const fixtureYaGenerado = useMemo(() => {
        if (!torneo?.zonas) return false;
        return torneo.zonas.some(z => z.partidos && z.partidos.length > 0);
    }, [torneo?.zonas]);

    const puedeGenerarFixture = useMemo(() => {
        if (!torneo?.zonas || torneo.zonas.length === 0) return false;
        return torneo.zonas.some(zona => zona.equipos && zona.equipos.length >= 2);
    }, [torneo?.zonas]);

    // Helper para icono de género
    const getGeneroIcon = () => {
        if (torneo.genero === "MASCULINO") return <FaMars className="text-blue-400" />;
        if (torneo.genero === "FEMENINO") return <FaVenus className="text-pink-400" />;
        if (torneo.genero === "MIXTO") return <FaVenusMars className="text-purple-400" />;
        return null;
    };

    if (loading) return (
        <div className="min-h-screen bg-[#05081c] flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-cyan-500/10 border-t-cyan-500 rounded-full animate-spin"></div>
            <span className="text-xs font-bold text-cyan-500 uppercase tracking-widest text-center">Actualizando Panel...</span>
        </div>
    );

    if (!torneo) return null;

    // VARIABLE CLAVE: Determina si el torneo es Abierto
    const esAbierto = torneo.tipo === 'ABIERTO';

    return (
        <div className="min-h-screen w-full bg-[#05081c] text-slate-200" onClick={() => setShowTooltipMobile(false)}>
            <div className="sticky top-0 z-[100] w-full border-b border-slate-800 bg-[#05081c]">
                <Navbar />
            </div>

            <main className="p-4 md:p-8 max-w-[1600px] mx-auto w-full">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-500 hover:text-cyan-400 mb-8 transition-all group"
                >
                    <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold uppercase text-[10px] tracking-widest">Panel Principal</span>
                </button>

                <header className="bg-[#0a0f2c] p-8 rounded-[2rem] border border-slate-800 mb-10 shadow-2xl flex flex-col xl:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-6">

                        {/* --- FOTO / LOGO --- */}
                        <div className="w-24 h-24 md:w-28 md:h-28 bg-[#040714] rounded-full border border-slate-800 flex items-center justify-center shadow-inner overflow-hidden shrink-0">
                            {torneo.fotoUrl ? (
                                <img src={torneo.fotoUrl} alt={torneo.nombre} className="w-full h-full object-cover" />
                            ) : (
                                <FaTrophy size={32} className="text-cyan-500" />
                            )}
                        </div>

                        <div>
                            <div className="flex items-center gap-4">
                                <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-white leading-none">{torneo.nombre}</h1>
                                <button onClick={() => setModalTorneoEditar(true)} className="p-2.5 bg-[#040714] rounded-xl text-slate-500 hover:text-cyan-400 border border-slate-800 transition shadow-sm">
                                    <FaEdit size={16}/>
                                </button>
                            </div>

                            {/* --- INFO: GÉNERO + DIVISIÓN + ESTADO --- */}
                            <div className="flex items-center gap-3 mt-3 flex-wrap">
                                {torneo.genero && (
                                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/50 border border-slate-700 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                        {getGeneroIcon()}
                                        {torneo.genero}
                                    </span>
                                )}
                                <p className="text-cyan-500 font-bold uppercase text-[10px] tracking-[0.4em] opacity-80">
                                    División {torneo.division} • {torneo.estado}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 w-full xl:w-auto">

                        {/* BOTÓN GESTIONAR FASE FINAL */}
                        <button
                            onClick={() => navigate(`/dashboard/torneos/${torneo.id}/fase-final`)}
                            className="bg-[#0e1630] hover:bg-blue-900/40 text-blue-400 px-6 py-4 rounded-2xl font-bold flex items-center gap-3 border border-blue-800/40 transition-all uppercase text-[10px] tracking-widest shadow-lg active:scale-95"
                        >
                            <FaProjectDiagram className="text-lg" /> Gestión Fase Final
                        </button>

                        {(esAbierto || !fixtureYaGenerado) && (
                            <button
                                onClick={() => setModalZonaCrear(true)}
                                className="bg-cyan-600 hover:bg-cyan-500 px-6 py-4 rounded-2xl font-bold flex items-center gap-3 border border-cyan-500 text-white transition-all uppercase text-[10px] tracking-widest shadow-lg shadow-cyan-900/20 active:scale-95"
                            >
                                <FaPlus /> Nueva Zona
                            </button>
                        )}

                        {!esAbierto && (
                            <div className="relative group">
                                <button
                                    onClick={(e) => {
                                        if (!puedeGenerarFixture && !fixtureYaGenerado) {
                                            e.stopPropagation();
                                            setShowTooltipMobile(!showTooltipMobile);
                                        } else if (!fixtureYaGenerado) {
                                            setModalConfirmarFixture(true);
                                        }
                                    }}
                                    disabled={fixtureYaGenerado}
                                    className={`px-6 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all shadow-lg uppercase text-[10px] tracking-widest border ${
                                        fixtureYaGenerado
                                            ? "bg-[#040714] text-slate-500 border-slate-800 cursor-default"
                                            : !puedeGenerarFixture
                                                ? "bg-slate-800 text-slate-600 border-slate-700 md:cursor-not-allowed opacity-60"
                                                : "bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500 shadow-emerald-900/20 active:scale-95 animate-pulse"
                                    }`}
                                >
                                    {fixtureYaGenerado ? (
                                        <><FaCheckCircle /> Fixture Generado</>
                                    ) : (
                                        <><FaMagic /> Generar Fixture</>
                                    )}
                                </button>

                                {!puedeGenerarFixture && !fixtureYaGenerado && (
                                    <div className={`absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-64 bg-slate-900 border-2 border-cyan-500 text-white p-4 rounded-2xl shadow-2xl z-[110] transition-all duration-300 ${showTooltipMobile ? 'flex' : 'hidden md:group-hover:flex'} flex-col items-center gap-2`}>
                                        <FaInfoCircle className="text-cyan-400 text-xl" />
                                        <p className="text-[11px] font-black uppercase tracking-tighter text-center leading-tight">
                                            Requisito de Inicio: <br/>
                                            <span className="text-cyan-400 text-[13px]">Mínimo 1 zona con 2 equipos</span>
                                        </p>
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-cyan-500"></div>
                                    </div>
                                )}
                            </div>
                        )}

                        {fixtureYaGenerado && !esAbierto && (
                            <button
                                onClick={() => navigate(`/dashboard/gestion-partidos/${torneo.id}`)}
                                className="bg-indigo-600 hover:bg-indigo-500 px-6 py-4 rounded-2xl font-bold flex items-center gap-3 border border-indigo-400/50 text-white transition-all uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-900/40"
                            >
                                <FaCogs className="text-lg" /> Gestión de Partidos
                            </button>
                        )}
                    </div>
                </header>

                {torneo.zonas && torneo.zonas.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                        {torneo.zonas?.map((zona) => (
                            <div key={zona.id} className="bg-[#0a0f2c] p-6 rounded-[2rem] border border-slate-800 flex flex-col shadow-xl hover:border-cyan-500/30 transition-all duration-300">

                                <div className="bg-[#040714] border border-slate-800 p-5 rounded-2xl mb-6 flex flex-col gap-4 shadow-inner">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-bold text-white uppercase text-xl tracking-tight">{zona.nombre}</h3>
                                        <div className="flex gap-2">
                                            <button onClick={() => { setZonaSeleccionada(zona); setModalZonaEditar(true); }} className="p-2 text-slate-500 hover:text-cyan-400 transition bg-[#0a0f2c] rounded-lg border border-slate-800">
                                                <FaEdit size={14}/>
                                            </button>
                                            {(!fixtureYaGenerado || esAbierto) && (
                                                <button onClick={() => setModalConfirmar({ open: true, type: 'ZONA', id: zona.id })} className="p-2 text-slate-500 hover:text-red-500 transition bg-[#0a0f2c] rounded-lg border border-slate-800">
                                                    <FaTrash size={14}/>
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* CORRECCIÓN: Botón Programar SÓLO si es torneo ABIERTO */}
                                    {esAbierto && (
                                        <button
                                            onClick={() => navigate(`/dashboard/programacion/zona/${zona.id}`)}
                                            className="w-full bg-cyan-600 hover:bg-cyan-500 border border-cyan-400 py-3 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-cyan-900/20 active:scale-95"
                                        >
                                            <FaCalendarAlt className="text-white" size={14} />
                                            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">GESTIÓN DE PARTIDOS</span>
                                        </button>
                                    )}
                                </div>

                                <div className="space-y-2.5 mb-8 flex-1">
                                    {zona.equipos?.length > 0 ? (
                                        zona.equipos.map((equipo) => (
                                            <div key={equipo.id} className="bg-[#040714] p-3 rounded-xl border border-slate-800 flex justify-between items-center transition-all hover:border-cyan-500/20 group/item">
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <div className="w-8 h-8 rounded-full bg-[#0a0f2c] border border-slate-800 flex items-center justify-center shrink-0 overflow-hidden shadow-inner group-hover/item:border-cyan-500/30 transition-colors">
                                                        {equipo.escudo ? (
                                                            <img src={equipo.escudo} alt={equipo.nombre} className="w-full h-full object-contain p-1" />
                                                        ) : (
                                                            <FaFutbol className="text-slate-700 text-sm" />
                                                        )}
                                                    </div>
                                                    <span className="text-slate-300 font-bold uppercase text-[10px] tracking-widest truncate">{equipo.nombre}</span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => { setEquipoSeleccionado(equipo); setModalEquipoEditar(true); }} className="text-cyan-500 hover:text-cyan-400 transition p-1">
                                                        <FaEdit size={12}/>
                                                    </button>
                                                    {(!fixtureYaGenerado || esAbierto) && (
                                                        <button onClick={() => setModalConfirmar({ open: true, type: 'EQUIPO', id: equipo.equipoZonaId })} className="text-red-500 hover:text-red-400 transition p-1">
                                                            <FaTrash size={12}/>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-10 border border-dashed border-slate-800 rounded-xl">
                                            <p className="text-slate-700 text-[9px] font-bold uppercase tracking-widest">Sin equipos registrados</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-3 mt-auto border-t border-slate-800 pt-6">
                                    {(esAbierto || !fixtureYaGenerado) && (
                                        <>
                                            <button onClick={() => { setZonaSeleccionada(zona); setModalInscribir(true); }} className="flex-1 bg-cyan-600 py-4 rounded-xl text-[10px] font-bold uppercase text-white hover:bg-cyan-500 transition-all shadow-lg shadow-cyan-900/20 active:scale-95">Inscribir</button>
                                            <button onClick={() => { setZonaSeleccionada(zona); setModalEquipoCrear(true); }} className="flex-1 bg-[#040714] border border-slate-800 py-4 rounded-xl text-[10px] font-bold text-slate-500 uppercase hover:text-cyan-400 transition-all active:scale-95">Crear</button>
                                        </>
                                    )}
                                    {fixtureYaGenerado && !esAbierto && (
                                        <div className="w-full py-2 flex items-center justify-center gap-2 text-cyan-500/40 text-[9px] font-bold uppercase tracking-[0.4em]">
                                            <FaLock size={10} /> Fixture Iniciado
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-[#0a0f2c] border border-dashed border-slate-800 rounded-[3rem] p-20 flex flex-col items-center justify-center text-center shadow-2xl">
                        <div className="bg-[#040714] p-8 rounded-full border border-slate-800 text-slate-700 mb-6 shadow-inner">
                            <FaLayerGroup size={48} />
                        </div>
                        <h2 className="text-2xl font-bold text-white uppercase tracking-tight mb-2">No hay zonas configuradas</h2>
                        <p className="text-slate-500 text-sm max-w-md mb-8 leading-relaxed">
                            Aún no has creado ninguna zona para este torneo. Comienza agregando una para inscribir o crear equipos.
                        </p>
                        <button
                            onClick={() => setModalZonaCrear(true)}
                            className="bg-cyan-600 hover:bg-cyan-500 text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all shadow-lg shadow-cyan-900/20 uppercase text-[10px] tracking-widest active:scale-95"
                        >
                            <FaPlus /> Crear Primera Zona
                        </button>
                    </div>
                )}
            </main>

            {/* Modales */}
            {modalTorneoEditar && <ModalEditarTorneo torneo={torneo} onClose={() => setModalTorneoEditar(false)} onUpdated={cargarDatos} />}
            {modalZonaEditar && zonaSeleccionada && <ModalEditarZona zona={zonaSeleccionada} onClose={() => setModalZonaEditar(false)} onUpdated={cargarDatos} />}
            {modalEquipoEditar && equipoSeleccionado && <ModalEquipoEditar equipo={equipoSeleccionado} onClose={() => setModalEquipoEditar(false)} onUpdated={cargarDatos} />}
            {modalZonaCrear && <ModalCrearZona torneo={torneo} onClose={() => setModalZonaCrear(false)} onCreated={cargarDatos} />}
            {modalInscribir && zonaSeleccionada && <ModalInscribirEnZona zona={zonaSeleccionada} torneo={torneo} onClose={() => setModalInscribir(false)} onUpdated={cargarDatos} />}
            {modalEquipoCrear && zonaSeleccionada && <ModalCrearEquipo zonaId={zonaSeleccionada.id} onClose={() => setModalEquipoCrear(false)} onCreated={cargarDatos} />}

            <ConfirmarEliminacionModal
                open={modalConfirmar.open}
                onClose={() => setModalConfirmar({ open: false, type: null, id: null })}
                onConfirm={ejecutarEliminacion}
                loading={loadingAccion}
                requiereEscritura={esAbierto}
                titulo={modalConfirmar.type === 'ZONA' ? "Eliminar Zona" : "Quitar Equipo"}
                mensaje={
                    modalConfirmar.type === 'ZONA'
                        ? (esAbierto
                            ? "¡ADVERTENCIA! Se borrarán permanentemente todos los partidos jugados, estadísticas y programaciones de esta zona."
                            : "Se eliminará la zona y la lista de equipos inscritos en ella.")
                        : (esAbierto
                            ? "El equipo será removido de la zona, se actualizarán los datos de los demás equipos, se recalculará la tabla automáticamente y se eliminará cualquier registro de su existencia."
                            : "El equipo será quitado de la lista de inscritos de esta zona.")
                }
            />

            <ConfirmarEliminacionModal
                open={modalConfirmarFixture}
                onClose={() => setModalConfirmarFixture(false)}
                onConfirm={handleEjecutarGenerarFixture}
                loading={loadingAccion}
                requiereEscritura={true}
                titulo="Generar Fixture Automático"
                mensaje="Se generará partidos automáticos para cada equipo. Una vez generado ya no se podrá eliminar zonas ni equipos."
            />
        </div>
    );
}