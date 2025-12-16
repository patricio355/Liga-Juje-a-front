import { useEffect, useState } from "react";
import EquipoCard from "./EquiposCard";
import ModalInscribirEquipo from "./ModalInscribirEquipo";
import ConfirmModal from "../dashboard/ConfirmModal";
import ModalCrearEquipo from "./ModalCrearEquipo";
import ModalEditarEquipo from "./ModalEditarEquipo";
import { apiFetch } from "../../api/api";
import {
    getEquiposActivos,
    getTodosEquipos,
    eliminarEquipo
} from "../../api/equipos.api";

export default function EquiposList() {

    const [equipos, setEquipos] = useState([]);
    const [filtro, setFiltro] = useState("activos");
    const [busqueda, setBusqueda] = useState("");

    const [modalCrearEquipo, setModalCrearEquipo] = useState(false);
    const [equipoEditar, setEquipoEditar] = useState(null);
    const [equipoInscribir, setEquipoInscribir] = useState(null);

    const [inscripcionEliminar, setInscripcionEliminar] = useState(null);

    const [idEliminarEquipo, setIdEliminarEquipo] = useState(null);
    const [confirmEliminarEquipo, setConfirmEliminarEquipo] = useState(false);

    const cargar = async () => {
        const data =
            filtro === "activos"
                ? await getEquiposActivos()
                : await getTodosEquipos();

        setEquipos(data);
    };

    useEffect(() => {
        cargar();
    }, [filtro]);

    const equiposFiltrados = equipos.filter(e =>
        e.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="space-y-4">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                    Lista de Equipos
                </h2>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setFiltro("activos")}
                        className={`px-4 py-2 rounded ${
                            filtro === "activos" ? "bg-blue-600" : "bg-gray-600"
                        }`}
                    >
                        Activos
                    </button>

                    <button
                        onClick={() => setFiltro("todos")}
                        className={`px-4 py-2 rounded ${
                            filtro === "todos" ? "bg-blue-600" : "bg-gray-600"
                        }`}
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
                        onClick={() => setModalCrearEquipo(true)}
                        className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        + Crear Equipo
                    </button>
                </div>
            </div>

            {/* LISTA */}
            {equiposFiltrados.map(e => (
                <EquipoCard
                    key={e.id}
                    equipo={e}
                    onEdit={(equipo) => setEquipoEditar(equipo)}
                    onDelete={(id) => {
                        setIdEliminarEquipo(id);
                        setConfirmEliminarEquipo(true);
                    }}
                    onInscribir={(equipo) => setEquipoInscribir(equipo)}
                    onEliminarInscripcion={(insc) =>
                        setInscripcionEliminar(insc)
                    }
                />
            ))}

            {/* MODAL EDITAR */}
            {equipoEditar && (
                <ModalEditarEquipo
                    equipo={equipoEditar}
                    onClose={() => setEquipoEditar(null)}
                    onUpdated={cargar}
                />
            )}

            {/* MODAL INSCRIBIR */}
            {equipoInscribir && (
                <ModalInscribirEquipo
                    equipo={equipoInscribir}
                    onClose={() => setEquipoInscribir(null)}
                    onInscripto={cargar}
                />
            )}

            {/* CONFIRM ELIMINAR INSCRIPCIÓN */}
            {inscripcionEliminar && (
                <ConfirmModal
                    mensaje={`¿Eliminar del torneo ${inscripcionEliminar.nombreTorneo}?`}
                    onCancel={() => setInscripcionEliminar(null)}
                    onConfirm={async () => {
                        await apiFetch(
                            `/api/equipos-zona/${inscripcionEliminar.id}`,
                            { method: "DELETE" }
                        );
                        setInscripcionEliminar(null);
                        cargar();
                    }}
                />
            )}

            {/* CONFIRM ELIMINAR EQUIPO */}
            {confirmEliminarEquipo && (
                <ConfirmModal
                    mensaje="¿Eliminar equipo?"
                    onCancel={() => setConfirmEliminarEquipo(false)}
                    onConfirm={async () => {
                        await eliminarEquipo(idEliminarEquipo);
                        setConfirmEliminarEquipo(false);
                        cargar();
                    }}
                />
            )}

            {/* MODAL CREAR */}
            {modalCrearEquipo && (
                <ModalCrearEquipo
                    onClose={() => setModalCrearEquipo(false)}
                    onCreated={cargar}
                />
            )}

        </div>
    );
}
