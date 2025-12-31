import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api";
import { FaArrowLeft, FaPlus, FaTrophy, FaTrash, FaEdit, FaCalendarAlt, FaMagic, FaCogs, FaCheckCircle, FaLock } from "react-icons/fa";

// Modales
import ModalInscribirEnZona from "../components/dashboard/ModalInscribirEnZona";
import ModalCrearZona from "../components/dashboard/ModalCrearZona";
import ModalEditarZona from "../components/dashboard/ModalEditarZona";
import ModalEditarTorneo from "../components/dashboard/ModalEditarTorneo";
import ModalEditarEquipo from "../components/equipos/ModalEditarEquipo";
import Navbar from "../components/Navbar.jsx";

export default function TorneoDetalleAdmin() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [torneo, setTorneo] = useState(null);
    const [loading, setLoading] = useState(true);

    // ESTADOS PARA MODALES
    const [modalInscribir, setModalInscribir] = useState(false);
    const [modalZonaCrear, setModalZonaCrear] = useState(false);
    const [modalZonaEditar, setModalZonaEditar] = useState(false);
    const [modalTorneoEditar, setModalTorneoEditar] = useState(false);
    const [modalEquipoEditar, setModalEquipoEditar] = useState(false);

    const [zonaSeleccionada, setZonaSeleccionada] = useState(null);
    const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);

    const cargarDatos = async () => {
        setLoading(true);
        try {
            const data = await apiFetch(`/api/torneos/${id}`);
            setTorneo(data);
        } catch (error) {
            // Seguridad: Si no es el dueño, redirigir al listado
            if (error.status === 403) {
                alert("Acceso denegado: No eres el administrador de este torneo.");
                navigate("/dashboard/torneos");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { cargarDatos(); }, [id]);

    const fixtureYaGenerado = torneo?.tipo !== 'ABIERTO' && torneo?.zonas?.some(z => z.partidos && z.partidos.length > 0);

    const handleQuitarEquipo = async (equipoZonaId) => {
        if (!confirm("¿Quitar este equipo de la zona?")) return;
        try {
            await apiFetch(`/api/equipos-zona/${equipoZonaId}`, { method: "DELETE" });
            cargarDatos();
        } catch (error) {
            alert("No se pudo quitar el equipo");
        }
    };

    const handleEliminarZona = async (zonaId) => {
        if (!confirm("¿Seguro que deseas eliminar esta zona?")) return;
        try {
            await apiFetch(`/api/torneos/${id}/zonas/${zonaId}`, { method: "DELETE" });
            cargarDatos();
        } catch (error) {
            alert("No se pudo eliminar la zona");
        }
    };

    if (loading) return <div className="p-10 text-white text-center italic font-bold">Cargando gestión del torneo...</div>;
    if (!torneo) return <div className="p-10 text-red-400 text-center font-bold italic">Torneo no encontrado.</div>;

    const esAbierto = torneo.tipo === 'ABIERTO';

    return (
        <div className="min-h-screen bg-[#0f172a]">
            <Navbar />

            {/* Layout ensanchado a 1600px para paneles largos */}
            <div className="p-6 text-white font-sans max-w-[1600px] mx-auto w-full">

                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition group">
                    <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Volver al listado
                </button>

                {/* Banner de Torneo con edición de nombre */}
                <div className="bg-[#1c213b] p-8 rounded-2xl border border-gray-700 shadow-2xl flex flex-col md:flex-row justify-between items-center mb-10 gap-6 w-full">
                    <div className="flex items-center gap-6">
                        <div className="bg-blue-600/20 p-4 rounded-xl hidden sm:block">
                            <FaTrophy className="text-4xl text-blue-500" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-4xl font-bold uppercase tracking-tight">{torneo.nombre}</h1>
                                <button onClick={() => setModalTorneoEditar(true)} className="text-gray-500 hover:text-blue-400 transition">
                                    <FaEdit size={20}/>
                                </button>
                            </div>
                            <p className="text-gray-400 text-lg">División {torneo.division} • {torneo.estado}</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        {esAbierto ? (
                            <button onClick={() => navigate(`/dashboard/programacion/${torneo.id}`)} className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
                                <FaCalendarAlt /> Ir a programaciones
                            </button>
                        ) : (
                            <button onClick={() => navigate(`/dashboard/gestion-partidos/${torneo.id}`)} className="bg-gray-700 hover:bg-gray-600 px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 border border-gray-600 transition-all">
                                <FaCogs /> Gestionar Partidos
                            </button>
                        )}
                    </div>
                </div>

                {/* Grid de Zonas con Cards ensanchadas */}
                <div className="flex gap-8 overflow-x-auto pb-8 snap-x scrollbar-hide">
                    {torneo.zonas?.map((zona) => (
                        <div key={zona.id} className="bg-[#1e243a] min-w-[420px] p-6 rounded-2xl border border-gray-700 flex flex-col shadow-lg snap-center">

                            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl mb-6 flex justify-between items-center text-left">
                                <div className="flex flex-col">
                                    <h3 className="font-bold text-red-300 uppercase tracking-widest text-lg">{zona.nombre}</h3>
                                    <button
                                        onClick={() => navigate(`/dashboard/programacion/zona/${zona.id}`)}
                                        className="text-xs text-blue-400 font-bold flex items-center gap-1 mt-1 hover:underline transition"
                                    >
                                        <FaCalendarAlt size={12} /> IR A PROGRAMACIÓN
                                    </button>
                                </div>
                                <div className="flex gap-3">
                                    {/* Botón Editar Zona corregido */}
                                    <button onClick={() => { setZonaSeleccionada(zona); setModalZonaEditar(true); }} className="text-gray-400 hover:text-white transition">
                                        <FaEdit size={16}/>
                                    </button>
                                    {!fixtureYaGenerado && <button onClick={() => handleEliminarZona(zona.id)} className="text-gray-400 hover:text-red-400 transition"><FaTrash size={16}/></button>}
                                </div>
                            </div>

                            <div className="space-y-4 mb-6 flex-1">
                                {zona.equipos?.map((equipo) => (
                                    <div key={equipo.id} className="bg-[#1c213b] p-4 rounded-xl border border-gray-800 flex justify-between items-center group hover:border-gray-600 transition">
                                        <div className="flex items-center gap-3">
                                            <span className="text-gray-200 font-semibold text-base">{equipo.nombre}</span>
                                            {/* Botón Editar Equipo corregido */}
                                            <button onClick={() => { setEquipoSeleccionado(equipo); setModalEquipoEditar(true); }} className="opacity-0 group-hover:opacity-100 text-blue-400 transition">
                                                <FaEdit size={14}/>
                                            </button>
                                        </div>
                                        {!fixtureYaGenerado && (
                                            <button onClick={() => handleQuitarEquipo(equipo.equipoZonaId)} className="opacity-0 group-hover:opacity-100 text-red-500 transition">
                                                <FaTrash size={14}/>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {!fixtureYaGenerado && (
                                <div className="flex gap-3 mt-auto">
                                    <button onClick={() => { setZonaSeleccionada(zona); setModalInscribir(true); }} className="flex-1 bg-blue-600 py-3 rounded-xl text-xs font-bold uppercase transition-colors hover:bg-blue-500">+ Inscribir</button>
                                    <button className="flex-1 border border-blue-600/40 py-3 rounded-xl text-xs font-bold text-blue-400 uppercase transition-colors hover:bg-blue-600/10">+ Crear</button>
                                </div>
                            )}
                        </div>
                    ))}

                    <button onClick={() => setModalZonaCrear(true)} className="min-w-[280px] border-2 border-dashed border-gray-700 rounded-2xl flex flex-col items-center justify-center text-gray-500 hover:border-blue-500 transition-all group">
                        <FaPlus className="text-3xl mb-3 group-hover:scale-110 transition-transform" />
                        <span className="font-bold uppercase text-xs tracking-widest">Nueva Zona</span>
                    </button>
                </div>

                {/* MODALES CON PROPS CORREGIDAS */}
                {modalTorneoEditar && (
                    <ModalEditarTorneo torneo={torneo} onClose={() => setModalTorneoEditar(false)} onSuccess={cargarDatos} />
                )}
                {modalZonaEditar && zonaSeleccionada && (
                    <ModalEditarZona zona={zonaSeleccionada} onClose={() => setModalZonaEditar(false)} onSuccess={cargarDatos} />
                )}
                {modalEquipoEditar && equipoSeleccionado && (
                    <ModalEditarEquipo
                        equipo={equipoSeleccionado}
                        onClose={() => setModalEquipoEditar(false)}
                        onUpdated={cargarDatos} // Corregido para evitar el error "not a function"
                    />
                )}
                {modalInscribir && zonaSeleccionada && (
                    <ModalInscribirEnZona zona={zonaSeleccionada} torneo={torneo} onClose={() => setModalInscribir(false)} onSuccess={cargarDatos} />
                )}
                {modalZonaCrear && (
                    <ModalCrearZona torneo={torneo} onClose={() => setModalZonaCrear(false)} onCreated={cargarDatos} />
                )}
            </div>
        </div>
    );
}