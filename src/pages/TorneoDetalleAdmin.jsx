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

    const [zonaSeleccionada, setZonaSeleccionada] = useState(null);
    const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);

    // Función de carga optimizada: Ahora es "awaitable" para los manejadores de eventos
    const cargarDatos = useCallback(async () => {
        try {
            const data = await apiFetch(`/api/torneos/${id}`);
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

    // Lógica de Generar Fixture: Espera la confirmación del backend antes de refrescar
    const handleGenerarFixtureGlobal = async () => {
        // ... confirmaciones ...
        setLoading(true);
        try {
            const promesas = torneo.zonas.map(zona =>
                apiFetch(`/api/partidos/zona/${zona.id}/fixture`, { method: "POST" })
            );
            await Promise.all(promesas);

            // Pequeño delay de seguridad para que el caché de persistencia se asiente
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
            await apiFetch(`/api/torneos/${id}/zonas/${zonaId}`, { method: "DELETE" });
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
        <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center gap-4">
            <FaFutbol className="text-4xl text-emerald-500 animate-spin" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Actualizando Panel...</span>
        </div>
    );

    if (!torneo) return null;
    const esAbierto = torneo.tipo === 'ABIERTO';

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-emerald-500/30">
            <Navbar />

            <main className="p-4 md:p-8 max-w-[1600px] mx-auto w-full">

                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-emerald-500 mb-8 transition group">
                    <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-black uppercase text-[10px] tracking-[0.2em]">Volver al Panel</span>
                </button>

                {/* HEADER DEL TORNEO */}
                <header className="bg-[#1e293b] p-8 rounded-3xl border border-slate-700/50 mb-10 shadow-2xl flex flex-col xl:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-6">
                        <div className="bg-[#0f172a] p-5 rounded-2xl border border-slate-700/50 text-emerald-500 shadow-inner">
                            <FaTrophy size={32} />
                        </div>
                        <div>
                            <div className="flex items-center gap-4">
                                <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-white leading-none">
                                    {torneo.nombre}
                                </h1>
                                <button onClick={() => setModalTorneoEditar(true)} className="p-2 bg-[#0f172a] rounded-lg text-slate-500 hover:text-emerald-500 border border-slate-700/50 transition shadow-sm">
                                    <FaEdit size={16}/>
                                </button>
                            </div>
                            <p className="text-emerald-500 font-bold uppercase text-[10px] tracking-[0.4em] mt-3 italic opacity-70">
                                División {torneo.division} • {torneo.estado}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 w-full xl:w-auto">
                        {(esAbierto || !fixtureYaGenerado) && (
                            <button onClick={() => setModalZonaCrear(true)} className="bg-[#0f172a] hover:bg-[#162235] px-6 py-4 rounded-2xl font-black flex items-center gap-3 border border-slate-700/50 text-emerald-500 transition-all uppercase text-[10px] tracking-widest shadow-lg">
                                <FaPlus /> Nueva Zona
                            </button>
                        )}

                        {!esAbierto && (
                            <button
                                onClick={handleGenerarFixtureGlobal}
                                disabled={fixtureYaGenerado}
                                className={`px-6 py-4 rounded-2xl font-black flex items-center gap-3 transition-all shadow-lg uppercase text-[10px] tracking-widest border ${
                                    fixtureYaGenerado
                                        ? "bg-slate-800 text-slate-500 border-slate-700 cursor-default"
                                        : "bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500 shadow-emerald-900/20"
                                }`}
                            >
                                {fixtureYaGenerado ? <><FaCheckCircle /> Fixture Generado</> : <><FaMagic /> Generar Fixture</>}
                            </button>
                        )}

                        <button
                            onClick={() => navigate(`/dashboard/gestion-partidos/${torneo.id}`)}
                            className="bg-[#0f172a] hover:bg-slate-800 px-6 py-4 rounded-2xl font-black flex items-center gap-3 border border-slate-700/50 text-white transition-all uppercase text-[10px] tracking-widest shadow-lg"
                        >
                            <FaCogs /> Gestión de Partidos
                        </button>
                    </div>
                </header>

                {/* GRID DE ZONAS */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                    {torneo.zonas?.map((zona) => (
                        <div key={zona.id} className="bg-[#1e293b] p-6 rounded-3xl border border-slate-700/40 flex flex-col shadow-2xl hover:border-emerald-500/30 transition-all duration-300">

                            <div className="bg-[#0f172a] border border-slate-700/50 p-5 rounded-2xl mb-6 flex justify-between items-center shadow-inner">
                                <div className="flex flex-col text-left">
                                    <h3 className="font-black text-white uppercase text-xl italic tracking-tighter">
                                        {zona.nombre}
                                    </h3>
                                    {esAbierto && (
                                        <button onClick={() => navigate(`/dashboard/programacion/zona/${zona.id}`)} className="text-[9px] text-emerald-600 font-black mt-1 hover:text-emerald-400 transition uppercase tracking-widest">
                                            <FaCalendarAlt size={10} className="inline mr-1" /> Programación
                                        </button>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => { setZonaSeleccionada(zona); setModalZonaEditar(true); }} className="p-2 text-slate-500 hover:text-emerald-500 transition bg-[#1e293b] rounded-lg border border-slate-700/30">
                                        <FaEdit size={14}/>
                                    </button>
                                    {(!fixtureYaGenerado || esAbierto) && (
                                        <button onClick={() => handleEliminarZona(zona.id)} className="p-2 text-slate-500 hover:text-red-500 transition bg-[#1e293b] rounded-lg border border-slate-700/30">
                                            <FaTrash size={14}/>
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2.5 mb-8 flex-1">
                                {zona.equipos?.length > 0 ? (
                                    zona.equipos.map((equipo) => (
                                        <div key={equipo.id} className="bg-[#0f172a] p-4 rounded-xl border border-slate-700/30 flex justify-between items-center group transition-all hover:bg-slate-800">
                                            <div className="flex items-center gap-3">
                                                <span className="text-slate-300 font-black uppercase text-[10px] tracking-widest">{equipo.nombre}</span>
                                                <button onClick={() => { setEquipoSeleccionado(equipo); setModalEquipoEditar(true); }} className="opacity-0 group-hover:opacity-100 text-emerald-500 transition">
                                                    <FaEdit size={12}/>
                                                </button>
                                            </div>
                                            {(!fixtureYaGenerado || esAbierto) && (
                                                <button onClick={() => handleQuitarEquipo(equipo.equipoZonaId)} className="opacity-0 group-hover:opacity-100 text-red-500 transition">
                                                    <FaTrash size={12}/>
                                                </button>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-slate-600 text-[9px] font-bold uppercase py-10 border border-dashed border-slate-700 rounded-xl italic">Sin equipos inscritos</p>
                                )}
                            </div>

                            <div className="flex gap-3 mt-auto border-t border-slate-700/30 pt-6">
                                {(esAbierto || !fixtureYaGenerado) && (
                                    <>
                                        <button onClick={() => { setZonaSeleccionada(zona); setModalInscribir(true); }} className="flex-1 bg-emerald-600 py-4 rounded-xl text-[10px] font-black uppercase text-white hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/10">Inscribir</button>
                                        <button onClick={() => setModalZonaCrear(true)} className="flex-1 bg-[#0f172a] border border-slate-700/50 py-4 rounded-xl text-[10px] font-black text-slate-400 uppercase hover:text-emerald-500 transition-all">Nueva</button>
                                    </>
                                )}

                                {fixtureYaGenerado && !esAbierto && (
                                    <div className="w-full py-2 flex items-center justify-center gap-2 text-emerald-600/40 text-[9px] font-black uppercase tracking-[0.4em]">
                                        <FaLock size={10} /> Fixture Iniciado
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* MODALES SINCRONIZADOS */}
            {modalTorneoEditar && (
                <ModalEditarTorneo torneo={torneo} onClose={() => setModalTorneoEditar(false)} onUpdated={cargarDatos} />
            )}

            {modalZonaEditar && zonaSeleccionada && (
                <ModalEditarZona zona={zonaSeleccionada} onClose={() => setModalZonaEditar(false)} onUpdated={cargarDatos} />
            )}

            {modalEquipoEditar && equipoSeleccionado && (
                <ModalEquipoEditar equipo={equipoSeleccionado} onClose={() => setModalEquipoEditar(false)} onUpdated={cargarDatos} />
            )}

            {modalZonaCrear && (
                <ModalCrearZona torneo={torneo} onClose={() => setModalZonaCrear(false)} onCreated={cargarDatos} />
            )}

            {modalInscribir && zonaSeleccionada && (
                <ModalInscribirEnZona zona={zonaSeleccionada} torneo={torneo} onClose={() => setModalInscribir(false)} onUpdated={cargarDatos} />
            )}
        </div>
    );
}