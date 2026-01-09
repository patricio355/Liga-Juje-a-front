import {useContext, useEffect, useState} from "react";
import UsuarioCard from "./UsuarioCard";
import ModalCrearUsuario from "./ModalCrearUsuario";
import ModalEditarUsuario from "./ModalEditarUsuario";
import ConfirmModal from "../dashboard/ConfirmModal";
import { FaPlus, FaUsers, FaCircle, FaSearch } from "react-icons/fa";
import { getUsuarios, eliminarUsuario } from "../../api/usuarios.api";
import {AuthContext} from "../../context/AuthContext.jsx";

export default function UsuariosList() {
    const [usuarios, setUsuarios] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [filtro, setFiltro] = useState("activos"); // "activos", "inactivos", "todos"
    const [loading, setLoading] = useState(true);

    const { user } = useContext(AuthContext);
    const userRole = user?.role?.toUpperCase().trim();
    const esAdmin = userRole === "ADMIN" || userRole === "ROLE_ADMIN";

    const [crear, setCrear] = useState(false);
    const [editar, setEditar] = useState(null);
    const [eliminarId, setEliminarId] = useState(null);

    const cargar = async () => {
        setLoading(true);
        try {
            const data = await getUsuarios();
            setUsuarios(data);
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargar();
    }, []);

    // LÓGICA DE FILTRADO ACTUALIZADA (Activos, Inactivos, Todos)
    const usuariosFiltrados = usuarios
        .filter((u) => {
            // Si no es admin, solo ve los activos (el backend ya filtra por creador)
            if (!esAdmin) return u.activo === true;

            // Filtro por estado para el Admin
            if (filtro === "activos") return u.activo === true;
            if (filtro === "inactivos") return u.activo === false;
            return true; // "todos"
        })
        .filter((u) => {
            const term = busqueda.toLowerCase();
            return (
                u.nombre?.toLowerCase().includes(term) ||
                u.email?.toLowerCase().includes(term) ||
                u.rol?.toLowerCase().includes(term)
            );
        });

    if (loading) return (
        <div className="flex flex-col items-center py-40 gap-4">
            <div className="w-12 h-12 border-4 border-cyan-500/10 border-t-cyan-500 rounded-full animate-spin"></div>
            <span className="text-xs font-bold text-cyan-500 uppercase tracking-widest text-center">
                Sincronizando Base de Datos...
            </span>
        </div>
    );

    return (
        <div className="w-full max-w-6xl mx-auto px-4">
            {/* HEADER PROFESIONAL */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-cyan-500/10 rounded-lg">
                            <FaUsers className="text-cyan-500 text-2xl" />
                        </div>
                        <h2 className="text-3xl font-bold text-white tracking-tight leading-none">
                            Gestión de Usuarios
                        </h2>
                    </div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                        {esAdmin
                            ? "Control de acceso y administración de roles del sistema"
                            : "Gestión de personal y colaboradores autorizados"}
                    </p>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:w-auto">

                    {/* FILTROS TRIPLES PARA ADMIN */}
                    {esAdmin && (
                        <div className="bg-[#0a0f2c] p-1.5 rounded-xl border border-slate-800 flex gap-1 w-full md:w-auto">
                            {["activos", "inactivos", "todos"].map((f) => (
                                <button
                                    key={f}
                                    className={`px-5 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${
                                        filtro === f
                                            ? "bg-cyan-600 text-white shadow-lg shadow-cyan-900/20"
                                            : "text-slate-500 hover:text-slate-300"
                                    }`}
                                    onClick={() => setFiltro(f)}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* BUSCADOR */}
                    <div className="relative w-full md:w-64">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-xs" />
                        <input
                            type="text"
                            placeholder="Buscar miembro..."
                            value={busqueda}
                            onChange={e => setBusqueda(e.target.value)}
                            className="w-full pl-10 pr-5 py-3 rounded-xl bg-[#0a0f2c] text-sm text-slate-200 border border-slate-800 focus:border-cyan-500 outline-none transition-all placeholder:text-slate-700"
                        />
                    </div>

                    <button
                        onClick={() => setCrear(true)}
                        className="w-full md:w-auto flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg active:scale-95"
                    >
                        <FaPlus size={12} /> Nuevo Usuario
                    </button>
                </div>
            </div>

            {/* LISTADO */}
            <div className="grid grid-cols-1 gap-4">
                {usuariosFiltrados.length === 0 ? (
                    <div className="text-center py-24 bg-[#0a0f2c]/50 rounded-[2.5rem] border border-dashed border-slate-800">
                        <p className="text-slate-600 text-sm font-semibold uppercase tracking-widest">
                            {busqueda
                                ? "No hay resultados para la búsqueda"
                                : `No hay usuarios ${filtro} registrados`}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {usuariosFiltrados.map(u => (
                            <UsuarioCard
                                key={u.id}
                                usuario={u}
                                onEdit={setEditar}
                                onDelete={setEliminarId}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* MODALES */}
            {crear && <ModalCrearUsuario onClose={() => setCrear(false)} onCreated={cargar} />}
            {editar && <ModalEditarUsuario usuario={editar} onClose={() => setEditar(null)} onUpdated={cargar} />}
            {eliminarId && (
                <ConfirmModal
                    mensaje="¿ESTÁ SEGURO DE DESACTIVAR EL ACCESO DE ESTE USUARIO?"
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