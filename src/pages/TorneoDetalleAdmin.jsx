import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api";
import {
    FaArrowLeft, FaPlus, FaTrophy, FaTrash,
    FaEdit, FaCalendarAlt, FaMagic, FaCogs, FaCheckCircle, FaLock, FaFutbol
} from "react-icons/fa";

// Modales
import ModalInscribirEnZona from "../components/dashboard/ModalInscribirEnZona";
import ModalCrearZona from "../components/dashboard/ModalCrearZona";
import ModalEditarZona from "../components/dashboard/ModalEditarZona";
import ModalEditarTorneo from "../components/dashboard/ModalEditarTorneo";
import ModalEquipoEditar from "../components/equipos/ModalEditarEquipo";
import ModalCrearEquipo from "../components/equipos/ModalCrearEquipo";
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

    const [zonaSeleccionada, setZonaSeleccionada] = useState(null);
    const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);

    const cargarDatos = useCallback(async () => {
        try {
            const data = await apiFetch(`/api/torneos/${id}?t=${new Date().getTime()}`);
            setTorneo(data);
        } catch (error) {
            if (error.status === 403 || error.status === 401) {
                navigate("/dashboard/torneos");
            }
        } finally {
            setLoading(false);
        }
    }, [id, navigate]);

    useEffect(() => {
        if (id) cargarDatos();
    }, [id, cargarDatos]);

    const fixtureYaGenerado = useMemo(() => {
        if (!torneo?.zonas) return false;
        return torneo.zonas.some(z => z.partidos && z.partidos.length > 0);
    }, [torneo?.zonas]);

    const handleGenerarFixtureGlobal = async () => {
        setLoading(true);
        try {
            const promesas = torneo.zonas.map(zona =>
                apiFetch(`/api/partidos/zona/${zona.id}/fixture`, { method: "POST" })
            );
            await Promise.all(promesas);
            await new Promise(resolve => setTimeout(resolve, 500));
            await cargarDatos();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleEliminarZona = async (zonaId) => {
        if (!confirm("¿Seguro que deseas eliminar esta zona?")) return;
        try {
            await apiFetch(`/api/torneos/${torneo.id}/zonas/${zonaId}`, { method: "DELETE" });
            await cargarDatos();
        } catch (error) { console.error(error); }
    };

    const handleQuitarEquipo = async (equipoZonaId) => {
        if (!confirm("¿Quitar este equipo de la zona?")) return;
        try {
            await apiFetch(`/api/equipos-zona/${equipoZonaId}`, { method: "DELETE" });
            await cargarDatos();
        } catch (error) { console.error(error); }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#05081c] flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-cyan-500/10 border-t-cyan-500 rounded-full animate-spin"></div>
            <span className="text-xs font-bold text-cyan-500 uppercase tracking-widest text-center">Actualizando Panel...</span>
        </div>
    );

    if (!torneo) return null;
    const esAbierto = torneo.tipo === 'ABIERTO';

    return (
        <div className="min-h-screen w-full bg-[#05081c] text-slate-200">
            {/* Navbar fijo superior */}
            <div className="sticky top-0 z-[100] w-full border-b border-slate-800 bg-[#05081c]">
                <Navbar />
            </div>

            <main className="p-4 md:p-8 max-w-[1600px] mx-auto w-full">
                {/* Botón Volver */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-500 hover:text-cyan-400 mb-8 transition-all group"
                >
                    <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold uppercase text-[10px] tracking-widest">Panel Principal</span>
                </button>

                {/* Header Profesional */}
                <header className="bg-[#0a0f2c] p-8 rounded-[2rem] border border-slate-800 mb-10 shadow-2xl flex flex-col xl:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-6">
                        <div className="bg-[#040714] p-5 rounded-2xl border border-slate-800 text-cyan-500 shadow-inner">
                            <FaTrophy size={32} />
                        </div>
                        <div>
                            <div className="flex items-center gap-4">
                                <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-white leading-none">
                                    {torneo.nombre}
                                </h1>
                                <button onClick={() => setModalTorneoEditar(true)} className="p-2.5 bg-[#040714] rounded-xl text-slate-500 hover:text-cyan-400 border border-slate-800 transition shadow-sm">
                                    <FaEdit size={16}/>
                                </button>
                            </div>
                            <p className="text-cyan-500 font-bold uppercase text-[10px] tracking-[0.4em] mt-3 opacity-80">
                                División {torneo.division} • {torneo.estado}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 w-full xl:w-auto">
                        {(esAbierto || !fixtureYaGenerado) && (
                            <button onClick={() => setModalZonaCrear(true)} className="bg-[#040714] hover:bg-[#0a0f2c] px-6 py-4 rounded-2xl font-bold flex items-center gap-3 border border-slate-800 text-cyan-500 transition-all uppercase text-[10px] tracking-widest shadow-lg">
                                <FaPlus /> Nueva Zona
                            </button>
                        )}

                        {!esAbierto && (
                            <button
                                onClick={handleGenerarFixtureGlobal}
                                disabled={fixtureYaGenerado}
                                className={`px-6 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all shadow-lg uppercase text-[10px] tracking-widest border ${
                                    fixtureYaGenerado
                                        ? "bg-[#040714] text-slate-500 border-slate-800 cursor-default"
                                        : "bg-cyan-600 hover:bg-cyan-500 text-white border-cyan-500 shadow-cyan-900/20"
                                }`}
                            >
                                {fixtureYaGenerado ? <><FaCheckCircle /> Fixture Generado</> : <><FaMagic /> Generar Fixture</>}
                            </button>
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

                {/* Grid de Zonas */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                    {torneo.zonas?.map((zona) => (
                        <div key={zona.id} className="bg-[#0a0f2c] p-6 rounded-[2rem] border border-slate-800 flex flex-col shadow-xl hover:border-cyan-500/30 transition-all duration-300">

                            <div className="bg-[#040714] border border-slate-800 p-5 rounded-2xl mb-6 flex justify-between items-center shadow-inner">
                                <div className="flex flex-col text-left">
                                    <h3 className="font-bold text-white uppercase text-xl tracking-tight">
                                        {zona.nombre}
                                    </h3>
                                    {esAbierto && (
                                        <button onClick={() => navigate(`/dashboard/programacion/zona/${zona.id}`)} className="text-[9px] text-cyan-500 font-bold mt-2 hover:text-cyan-400 transition uppercase tracking-widest">
                                            <FaCalendarAlt size={10} className="inline mr-1" /> Programación
                                        </button>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => { setZonaSeleccionada(zona); setModalZonaEditar(true); }} className="p-2 text-slate-500 hover:text-cyan-400 transition bg-[#0a0f2c] rounded-lg border border-slate-800">
                                        <FaEdit size={14}/>
                                    </button>
                                    {(!fixtureYaGenerado || esAbierto) && (
                                        <button onClick={() => handleEliminarZona(zona.id)} className="p-2 text-slate-500 hover:text-red-500 transition bg-[#0a0f2c] rounded-lg border border-slate-800">
                                            <FaTrash size={14}/>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Equipos con Escudos */}
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
                                                <span className="text-slate-300 font-bold uppercase text-[10px] tracking-widest truncate">
                                                    {equipo.nombre}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => { setEquipoSeleccionado(equipo); setModalEquipoEditar(true); }}
                                                    className="text-cyan-500 hover:text-cyan-400 transition p-1"
                                                >
                                                    <FaEdit size={12}/>
                                                </button>

                                                {(!fixtureYaGenerado || esAbierto) && (
                                                    <button
                                                        onClick={() => handleQuitarEquipo(equipo.equipoZonaId)}
                                                        className="text-red-500 hover:text-red-400 transition p-1"
                                                    >
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
            </main>

            {/* Modales */}
            {modalTorneoEditar && <ModalEditarTorneo torneo={torneo} onClose={() => setModalTorneoEditar(false)} onUpdated={cargarDatos} />}
            {modalZonaEditar && zonaSeleccionada && <ModalEditarZona zona={zonaSeleccionada} onClose={() => setModalZonaEditar(false)} onUpdated={cargarDatos} />}
            {modalEquipoEditar && equipoSeleccionado && <ModalEquipoEditar equipo={equipoSeleccionado} onClose={() => setModalEquipoEditar(false)} onUpdated={cargarDatos} />}
            {modalZonaCrear && <ModalCrearZona torneo={torneo} onClose={() => setModalZonaCrear(false)} onCreated={cargarDatos} />}
            {modalInscribir && zonaSeleccionada && <ModalInscribirEnZona zona={zonaSeleccionada} torneo={torneo} onClose={() => setModalInscribir(false)} onUpdated={cargarDatos} />}
            {modalEquipoCrear && zonaSeleccionada && <ModalCrearEquipo zonaId={zonaSeleccionada.id} onClose={() => setModalEquipoCrear(false)} onCreated={cargarDatos} />}
        </div>
    );
}