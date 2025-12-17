import { useEffect, useState } from "react";
import UsuarioCard from "./UsuarioCard";
import ModalCrearUsuario from "./ModalCrearUsuario";
import ModalEditarUsuario from "./ModalEditarUsuario";
import ConfirmModal from "../dashboard/ConfirmModal";
import { getUsuarios, eliminarUsuario } from "../../api/usuarios.api";

export default function UsuariosList() {

    const [usuarios, setUsuarios] = useState([]);
    const [busqueda, setBusqueda] = useState("");

    const [crear, setCrear] = useState(false);
    const [editar, setEditar] = useState(null);
    const [eliminarId, setEliminarId] = useState(null);

    const cargar = async () => {
        const data = await getUsuarios();
        setUsuarios(data);
    };

    useEffect(() => {
        cargar();
    }, []);

    // 🔍 FILTRADO
    const usuariosFiltrados = usuarios.filter(u =>
        u.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
        u.email?.toLowerCase().includes(busqueda.toLowerCase()) ||
        u.rol?.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="space-y-4">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h2 className="text-2xl font-bold">Usuarios</h2>

                <button
                    onClick={() => setCrear(true)}
                    className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 transition"
                >
                    + Crear Usuario
                </button>
            </div>

            {/* BUSCADOR */}
            <input
                type="text"
                placeholder="Buscar por nombre, email o rol..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 outline-none"
            />

            {/* LISTA */}
            {usuariosFiltrados.length === 0 ? (
                <p className="text-gray-400 text-sm">
                    No se encontraron usuarios
                </p>
            ) : (
                usuariosFiltrados.map(u => (
                    <UsuarioCard
                        key={u.id}
                        usuario={u}
                        onEdit={setEditar}
                        onDelete={setEliminarId}
                    />
                ))
            )}

            {/* MODALES */}
            {crear && (
                <ModalCrearUsuario
                    onClose={() => setCrear(false)}
                    onCreated={cargar}
                />
            )}

            {editar && (
                <ModalEditarUsuario
                    usuario={editar}
                    onClose={() => setEditar(null)}
                    onUpdated={cargar}
                />
            )}

            {eliminarId && (
                <ConfirmModal
                    mensaje="¿Desactivar usuario?"
                    onCancel={() => setEliminarId(null)}
                    onConfirm={async () => {
                        await eliminarUsuario(eliminarId);
                        setEliminarId(null);
                        cargar();
                    }}
                />
            )}
        </div>
    );
}
