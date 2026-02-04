import {useContext, useEffect, useState} from "react";
import UsuarioCard from "./UsuarioCard";
import ModalCrearUsuario from "./ModalCrearUsuario";
import ModalEditarUsuario from "./ModalEditarUsuario";
import ConfirmModal from "../dashboard/ConfirmModal";
import { FaPlus, FaUsers, FaSearch } from "react-icons/fa";
import { getUsuarios, eliminarUsuario } from "../../api/usuarios.api";
import {AuthContext} from "../../context/AuthContext.jsx";

export default function UsuariosList() {
    const [usuarios, setUsuarios] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [filtro, setFiltro] = useState("activos");
    const [loading, setLoading] = useState(true);

    const { user } = useContext(AuthContext);

    const userRole = user?.role?.toUpperCase().trim().replace("ROLE_", "") || "";
    const esAdmin = userRole === "ADMIN";
    const esEncargadoTorneo = userRole === "ENCARGADOTORNEO";

    const puedeGestionar = esAdmin || esEncargadoTorneo;

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

    const usuariosFiltrados = usuarios
        .filter((u) => {
            if (puedeGestionar) {
                if (filtro === "activos") return u.activo === true;
                if (filtro === "inactivos") return u.activo === false;
                return true;
            }
            return u.activo === true;
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
            <div className="w-12 h-12 border-4 border-white/5 border-t-slate-400 rounded-full animate-spin"></div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] text-center">
                Sincronizando Usuarios...
            </span>
        </div>
    );

    return (
        <div className="w-full max-w-6xl mx-auto px-4">
            {/* HEADER */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                            <FaUsers className="text-slate-400 text-2xl" />
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none">
                            Usuarios
                        </h2>
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                        {puedeGestionar
                            ? "Administración de Miembros y Accesos"
                            : "Directorio de Personal Autorizado"}
                    </p>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:w-auto">

                    {/* SELECTOR DE ESTADOS (Estilo Plateado) */}
                    {puedeGestionar && (
                        <div className="bg-white/5 p-1.5 rounded-xl border border-white/10 flex gap-1 w-full md:w-auto shadow-inner">
                            {["activos", "inactivos", "todos"].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFiltro(f)}
                                    className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                                        filtro === f
                                            ? "bg-slate-700 text-white shadow-lg"
                                            : "text-slate-500 hover:text-slate-300"
                                    }`}
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
                            placeholder="BUSCAR MIEMBRO..."
                            value={busqueda}
                            onChange={e => setBusqueda(e.target.value)}
                            className="w-full pl-10 pr-5 py-3 rounded-xl bg-white/5 text-xs font-bold text-slate-200 border border-white/10 focus:border-slate-600 outline-none transition-all placeholder:text-slate-700 shadow-inner"
                        />
                    </div>

                    <button
                        onClick={() => setCrear(true)}
                        className="w-full md:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-slate-100 to-slate-400 hover:from-white hover:to-slate-300 text-black px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95"
                    >
                        <FaPlus size={10} /> Registrar Miembro
                    </button>
                </div>
            </div>

            {/* LISTADO DE TARJETAS */}
            <div className="grid grid-cols-1 gap-4">
                {usuariosFiltrados.length === 0 ? (
                    <div className="text-center py-24 bg-white/5 rounded-[2.5rem] border border-dashed border-white/10">
                        <p className="text-slate-700 text-[10px] font-black uppercase tracking-[0.4em] italic">
                            {busqueda
                                ? "Sin coincidencias"
                                : `No hay registros: ${filtro}`}
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
                    mensaje="¿ESTÁ SEGURO DE SUSPENDER EL ACCESO DE ESTE USUARIO?"
                    subMensaje="El usuario será movido a la lista de inactivos."
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