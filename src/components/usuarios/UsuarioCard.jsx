import { FaEdit, FaTrash } from "react-icons/fa";

export default function UsuarioCard({ usuario, onEdit, onDelete }) {
    return (
        <div className="bg-[#262b45] p-4 rounded-lg flex justify-between items-center">
            <div>
                <p className="font-bold">{usuario.nombre}</p>
                <p className="text-sm text-gray-400">{usuario.email}</p>
                <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                    {usuario.rol}
                </span>
            </div>

            <div className="flex gap-4 text-xl">
                <button
                    className="text-yellow-400"
                    onClick={() => onEdit(usuario)}
                >
                    <FaEdit />
                </button>

                <button
                    className="text-red-500"
                    onClick={() => onDelete(usuario.id)}
                >
                    <FaTrash />
                </button>
            </div>
        </div>
    );
}
