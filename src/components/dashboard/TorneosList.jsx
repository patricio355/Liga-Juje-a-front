import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Importamos navegación

import ModalCrearTorneo from "./ModalCrearTorneo";
import ModalEditarTorneo from "./ModalEditarTorneo";
import ConfirmModal from "./ConfirmModal";

import { apiFetch } from "../../api/api";

export default function TorneosList() {
    const [torneos, setTorneos] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Hook para redirigir

    // FILTRO Y BUSQUEDA
    const [filtro, setFiltro] = useState("activos");
    const [busqueda, setBusqueda] = useState("");

    // MODALES TORNEO
    const [modalCrear, setModalCrear] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const [torneoSeleccionado, setTorneoSeleccionado] = useState(null);

    // MODAL CONFIRMACION
    const [modalConfirm, setModalConfirm] = useState(false);
    const [mensajeConfirm, setMensajeConfirm] = useState("");
    const [accionEliminar, setAccionEliminar] = useState(null);

    const recargar = async () => {
        try {
            const data = await apiFetch("/api/torneos/dashboard");
            setTorneos(data);
        } catch (err) {
            console.error("Error al recargar:", err);
        }
    };

    useEffect(() => {
        const cargar = async () => {
            setLoading(true);
            try {
                const data = await apiFetch("/api/torneos/dashboard");
                setTorneos(data);
            } catch (err) {
                console.error("Error cargando torneos:", err);
            } finally {
                setLoading(false);
            }
        };
        cargar();
    }, []);

    const eliminarTorneo = (e, id) => {
        e.stopPropagation(); // Evita que al hacer clic en borrar se abra el detalle
        setMensajeConfirm("¿Seguro que desea eliminar este torneo?");
        setAccionEliminar(() => async () => {
            await apiFetch(`/api/torneos/${id}`, { method: "DELETE" });
            recargar();
        });
        setModalConfirm(true);
    };

    const abrirEdicion = (e, t) => {
        e.stopPropagation(); // Evita redirigir al abrir el modal
        setTorneoSeleccionado(t);
        setModalEditar(true);
    };

    const torneosFiltrados = torneos
        .filter((t) => (filtro === "activos" ? t.estado === "activo" : true))
        .filter((t) => t.nombre.toLowerCase().includes(busqueda.toLowerCase()));

    if (loading) return <p className="text-gray-300 text-center p-10">Cargando torneos...</p>;

    return (
        <div className="p-4">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h2 className="text-2xl font-bold text-white">Administración de Torneos</h2>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="bg-gray-800 p-1 rounded-lg">
                        <button
                            className={`px-4 py-1.5 rounded-md transition ${filtro === "activos" ? "bg-blue-600 text-white" : "text-gray-400"}`}
                            onClick={() => setFiltro("activos")}
                        >
                            Activos
                        </button>
                        <button
                            className={`px-4 py-1.5 rounded-md transition ${filtro === "todos" ? "bg-blue-600 text-white" : "text-gray-400"}`}
                            onClick={() => setFiltro("todos")}
                        >
                            Todos
                        </button>
                    </div>

                    <input
                        type="text"
                        placeholder="Buscar torneo..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 outline-none"
                    />

                    <button
                        onClick={() => setModalCrear(true)}
                        className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 font-bold transition"
                    >
                        <FaPlus /> Nuevo Torneo
                    </button>
                </div>
            </div>

            {/* LISTA DE TORNEOS */}
            <div className="grid grid-cols-1 gap-4">
                {torneosFiltrados.map((t) => (
                    <div
                        key={t.id}
                        onClick={() => navigate(`/dashboard/torneos/${t.id}`)}
                        className="bg-[#1e243a] p-5 rounded-xl border border-gray-700 shadow-lg flex justify-between items-center cursor-pointer hover:border-blue-500 transition-all group"
                    >
                        <div className="flex-1">
                            <div className="flex items-center gap-3">
                                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition">{t.nombre}</h3>
                                <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${t.tipo === 'ABIERTO' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {t.tipo}
                                </span>
                            </div>

                            <div className="mt-2 flex gap-4 text-sm text-gray-400">
                                <span>División: <b className="text-gray-200">{t.division}</b></span>
                                <span>Zonas: <b className="text-gray-200">{t.zonas?.length || 0}</b></span>
                            </div>

                            {t.tipo === "CERRADO" ? (
                                <p className="text-red-400 text-xs mt-2 italic">Inscripciones cerradas - Fixture generado</p>
                            ) : (
                                <p className="text-green-400 text-xs mt-2 italic">En fase de inscripción</p>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <button
                                title="Ver Administración"
                                className="p-3 bg-gray-700/50 hover:bg-blue-600 rounded-lg text-white transition"
                                onClick={() => navigate(`/dashboard/torneos/${t.id}`)}
                            >
                                <FaEye />
                            </button>
                            <button
                                title="Editar"
                                className="p-3 bg-gray-700/50 hover:bg-yellow-600 rounded-lg text-white transition"
                                onClick={(e) => abrirEdicion(e, t)}
                            >
                                <FaEdit />
                            </button>
                            <button
                                title="Eliminar"
                                className="p-3 bg-gray-700/50 hover:bg-red-600 rounded-lg text-white transition"
                                onClick={(e) => eliminarTorneo(e, t.id)}
                            >
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))}

                {torneosFiltrados.length === 0 && (
                    <div className="text-center py-20 bg-gray-800/20 rounded-xl border border-dashed border-gray-700">
                        <p className="text-gray-500">No se encontraron torneos con esos filtros.</p>
                    </div>
                )}
            </div>

            {/* MODALES */}
            {modalCrear && <ModalCrearTorneo onClose={() => setModalCrear(false)} onCreated={recargar} />}
            {modalEditar && torneoSeleccionado && <ModalEditarTorneo torneo={torneoSeleccionado} onClose={() => setModalEditar(false)} onUpdated={recargar} />}
            {modalConfirm && (
                <ConfirmModal
                    mensaje={mensajeConfirm}
                    onCancel={() => setModalConfirm(false)}
                    onConfirm={() => {
                        accionEliminar();
                        setModalConfirm(false);
                    }}
                />
            )}
        </div>
    );
}