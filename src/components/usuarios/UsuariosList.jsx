import { useEffect, useState } from "react";
import UsuarioCard from "./UsuarioCard";
import ModalCrearUsuario from "./ModalCrearUsuario";
import ModalEditarUsuario from "./ModalEditarUsuario";
import ConfirmModal from "../dashboard/ConfirmModal";
import { FaPlus, FaUsers, FaFutbol } from "react-icons/fa";
import { getUsuarios, eliminarUsuario } from "../../api/usuarios.api";

export default function UsuariosList() {
    const [usuarios, setUsuarios] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [loading, setLoading] = useState(true);

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

    const usuariosFiltrados = usuarios.filter(u =>
        u.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
        u.email?.toLowerCase().includes(busqueda.toLowerCase()) ||
        u.rol?.toLowerCase().includes(busqueda.toLowerCase())
    );

    if (loading) return (
        <div className="flex flex-col items-center py-32 gap-4">
            <FaFutbol className="text-5xl text-emerald-600 animate-spin" />
            <span className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Cargando Usuarios...</span>
        </div>
    );

    return (
        <div className="w-full max-w-6xl mx-auto">
            {/* HEADER - Identico a Torneos y Equipos */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <FaUsers className="text-emerald-500 text-xl" />
                        <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">
                            Gestión de Usuarios
                        </h2>
                    </div>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] italic">
                        Control de acceso y roles del sistema
                    </p>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-5 w-full lg:w-auto">
                    {/* BUSCADOR ESTILIZADO */}
                    <input
                        type="text"
                        placeholder="Buscar por nombre, email o rol..."
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                        className="w-full md:w-80 px-5 py-3.5 rounded-2xl bg-[#0f172a] text-sm text-slate-200 border border-slate-700/50 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-700"
                    />

                    <button
                        onClick={() => setCrear(true)}
                        className="w-full md:w-auto flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white px-7 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl active:scale-95"
                    >
                        <FaPlus size={14} /> Nuevo Usuario
                    </button>
                </div>
            </div>

            {/* LISTA DE TARJETAS */}
            <div className="grid grid-cols-1 gap-6">
                {usuariosFiltrados.length === 0 ? (
                    <div className="text-center py-20 bg-[#1c213b]/30 rounded-[2rem] border border-dashed border-slate-700/50">
                        <p className="text-slate-600 text-[11px] font-black uppercase tracking-widest italic">
                            No se encontraron usuarios en el sistema
                        </p>
                    </div>
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
            </div>

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
                    mensaje="¿ESTÁ SEGURO DE DESACTIVAR ESTE USUARIO?"
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