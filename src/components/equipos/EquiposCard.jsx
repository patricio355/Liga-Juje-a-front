import { FaEdit, FaTrash } from "react-icons/fa";

export default function EquipoCard({
                                       equipo,
                                       onEdit,
                                       onDelete,
                                       onInscribir,
                                       onEliminarInscripcion
                                   }) {

    const inscripciones = equipo.inscripciones || [];

    return (
        <div className="bg-[#262b45] p-4 rounded-lg shadow flex justify-between items-center">

            <div className="space-y-1">

                <h3 className="text-xl font-bold flex items-center gap-3">
                    {equipo.nombre}

                    <button
                        onClick={() => onInscribir(equipo)}
                        className="
        flex items-center gap-2
        text-sm font-medium
        text-blue-300
        bg-blue-500/10
        px-3 py-1.5
        rounded-full
        hover:bg-blue-500/20
        hover:text-blue-200
        transition
    "
                    >
                        ➕ Inscribir en torneo
                    </button>

                </h3>

                <p className="text-gray-400">
                    Estado: {equipo.estado ? "Activo" : "Inactivo"}
                </p>

                {/* TORNEOS */}
                {inscripciones.length > 0 ? (
                    <div className="text-sm text-gray-300 mt-2">
                        <p className="font-semibold">Torneos:</p>

                        <ul className="ml-4 space-y-1">
                            {inscripciones.map((i) => (
                                <li
                                    key={i.id}
                                    className="flex justify-between items-center"
                                >
                                    <span>
                                        {i.nombreTorneo}
                                        {i.nombreZona && ` (${i.nombreZona})`}
                                    </span>

                                    <button
                                        className="text-red-400 hover:text-red-300"
                                        title="Eliminar del torneo"
                                        onClick={() => onEliminarInscripcion(i)}
                                    >
                                        <FaTrash size={14} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">
                        No participa en torneos
                    </p>
                )}
            </div>

            <div className="flex gap-4 text-xl">
                <button
                    className="text-yellow-400 hover:text-yellow-300"
                    onClick={() => onEdit(equipo)}
                >
                    <FaEdit />
                </button>

                <button
                    className="text-red-500 hover:text-red-400"
                    onClick={() => onDelete(equipo.id)}
                >
                    <FaTrash />
                </button>
            </div>
        </div>
    );
}
