import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

import ModalCrearTorneo from "./ModalCrearTorneo";
import ModalEditarTorneo from "./ModalEditarTorneo";
import ModalCrearZona from "./ModalCrearZona";
import ModalEditarZona from "./ModalEditarZona";
import ConfirmModal from "./ConfirmModal";

import { apiFetch } from "../../api/api";

export default function TorneosList() {

    const [torneos, setTorneos] = useState([]);
    const [loading, setLoading] = useState(true);

    // FILTRO Y BUSQUEDA
    const [filtro, setFiltro] = useState("todos");
    const [busqueda, setBusqueda] = useState("");

    // MODALES TORNEO
    const [modalCrear, setModalCrear] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const [torneoSeleccionado, setTorneoSeleccionado] = useState(null);

    // MODALES ZONA
    const [modalZonaCrear, setModalZonaCrear] = useState(false);
    const [modalZonaEditar, setModalZonaEditar] = useState(false);
    const [zonaSeleccionada, setZonaSeleccionada] = useState(null);

    // MODAL CONFIRMACION
    const [modalConfirm, setModalConfirm] = useState(false);
    const [mensajeConfirm, setMensajeConfirm] = useState("");
    const [accionEliminar, setAccionEliminar] = useState(null);

    // ---------------------------------------------------
    // RECARGAR LISTA
    // ---------------------------------------------------
    const recargar = async () => {
        const data = await apiFetch("/api/torneos");
        setTorneos(data);
    };

    // ---------------------------------------------------
    // CARGAR INICIAL
    // ---------------------------------------------------
    useEffect(() => {
        const cargar = async () => {
            setLoading(true);
            try {
                const data = await apiFetch("/api/torneos");
                setTorneos(data);
            } catch (err) {
                console.error("Error cargando torneos:", err);
            } finally {
                setLoading(false);
            }
        };

        cargar();
    }, []);

    // ---------------------------------------------------
    // ELIMINAR TORNEO
    // ---------------------------------------------------
    const eliminarTorneo = (id) => {
        setMensajeConfirm("¿Seguro que desea eliminar este torneo?");
        setAccionEliminar(() => async () => {
            await apiFetch(`/api/torneos/${id}`, { method: "DELETE" });
            recargar();
        });

        setModalConfirm(true);
    };

    // ---------------------------------------------------
    // ELIMINAR ZONA
    // ---------------------------------------------------
    const eliminarZona = (idTorneo, idZona) => {
        setMensajeConfirm("¿Seguro que desea eliminar esta zona?");
        setAccionEliminar(() => async () => {
            await apiFetch(
                `/api/torneos/${idTorneo}/zonas/${idZona}`,
                { method: "DELETE" }
            );
            recargar();
        });

        setModalConfirm(true);
    };

    // ---------------------------------------------------
    // APLICAR FILTROS
    // ---------------------------------------------------
    const torneosFiltrados = torneos
        .filter((t) => (filtro === "activos" ? t.estado === "activo" : true))
        .filter((t) =>
            t.nombre.toLowerCase().includes(busqueda.toLowerCase())
        );

    if (loading) {
        return <p className="text-gray-300 text-center">Cargando torneos...</p>;
    }

    return (
        <div>

            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Lista de Torneos</h2>

                <div className="flex items-center gap-3">
                    <button
                        className={`px-4 py-2 rounded ${
                            filtro === "activos" ? "bg-blue-600" : "bg-gray-600"
                        }`}
                        onClick={() => setFiltro("activos")}
                    >
                        Activos
                    </button>

                    <button
                        className={`px-4 py-2 rounded ${
                            filtro === "todos" ? "bg-blue-600" : "bg-gray-600"
                        }`}
                        onClick={() => setFiltro("todos")}
                    >
                        Todos
                    </button>

                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="px-3 py-2 rounded bg-gray-700 text-white outline-none"
                    />

                    <button
                        onClick={() => setModalCrear(true)}
                        className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        <FaPlus /> Crear Torneo
                    </button>
                </div>
            </div>

            {/* LISTA */}
            <div className="space-y-4">
                {torneosFiltrados.map((t) => (
                    <div
                        key={t.id}
                        className="bg-[#262b45] p-4 rounded-lg shadow flex justify-between items-center"
                    >
                        <div>
                            <h3 className="text-xl font-bold">{t.nombre}</h3>
                            <p className="text-gray-400">División: {t.division}</p>

                            <p className="text-gray-400">Tipo: {t.tipo} </p>
                            {t.tipo === "CERRADO" && (
                                <p className="text-red-400 font-semibold">
                                    No se aceptan inscripciones
                                </p>
                            )}
                            {t.tipo === "ABIERTO" && (
                                <p className="text-green-400 font-semibold">
                                    Se aceptan inscripciones
                                </p>
                            )}
                            <p className="text-gray-400">Estado: {t.estado}</p>

                            {t.zonas?.length > 0 && (
                                <ul className="mt-3 text-sm text-gray-300 ml-5 space-y-1">
                                    {t.zonas.map((z) => (
                                        <li key={z.id} className="flex justify-between items-center">
                                            <span>• {z.nombre}</span>
                                            <div className="flex gap-3 text-lg">
                                                <button
                                                    className="text-yellow-400"
                                                    onClick={() => {
                                                        setZonaSeleccionada(z);
                                                        setModalZonaEditar(true);
                                                    }}
                                                >
                                                    ✏
                                                </button>

                                                <button
                                                    className="text-red-500"
                                                    onClick={() => eliminarZona(t.id, z.id)}
                                                >
                                                    🗑
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <button
                                className="mt-3 text-sm bg-blue-600 px-3 py-1 rounded"
                                onClick={() => {
                                    setTorneoSeleccionado(t);
                                    setModalZonaCrear(true);
                                }}
                            >
                                + Agregar Zona
                            </button>
                        </div>

                        <div className="flex gap-4 text-xl">
                            <button
                                className="text-yellow-400"
                                onClick={() => {
                                    setTorneoSeleccionado(t);
                                    setModalEditar(true);
                                }}
                            >
                                <FaEdit />
                            </button>

                            <button
                                className="text-red-500"
                                onClick={() => eliminarTorneo(t.id)}
                            >
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODALES */}
            {modalCrear && <ModalCrearTorneo onClose={() => setModalCrear(false)} onCreated={recargar} />}
            {modalEditar && torneoSeleccionado && <ModalEditarTorneo torneo={torneoSeleccionado} onClose={() => setModalEditar(false)} onUpdated={recargar} />}
            {modalZonaCrear && torneoSeleccionado && <ModalCrearZona torneo={torneoSeleccionado} onClose={() => setModalZonaCrear(false)} onCreated={recargar} />}
            {modalZonaEditar && zonaSeleccionada && <ModalEditarZona zona={zonaSeleccionada} onClose={() => setModalZonaEditar(false)} onUpdated={recargar} />}
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
