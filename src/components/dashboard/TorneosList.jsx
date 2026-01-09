import { useEffect, useState, useContext } from "react";
import { FaEdit, FaTrash, FaPlus, FaEye, FaTrophy, FaSearch, FaCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ModalCrearTorneo from "./ModalCrearTorneo";
import ModalEditarTorneo from "./ModalEditarTorneo";
import ConfirmModal from "./ConfirmModal";
import { apiFetch } from "../../api/api";
import { AuthContext } from "../../context/AuthContext";

export default function TorneosList() {
    const { user } = useContext(AuthContext);
    const userRole = user?.role?.toUpperCase().trim();
    const esAdmin = userRole === "ADMIN" || userRole === "ROLE_ADMIN";

    const [torneos, setTorneos] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [filtro, setFiltro] = useState("activos");
    const [busqueda, setBusqueda] = useState("");

    const [modalCrear, setModalCrear] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const [torneoSeleccionado, setTorneoSeleccionado] = useState(null);

    const [modalConfirm, setModalConfirm] = useState(false);
    const [mensajeConfirm, setMensajeConfirm] = useState("");
    const [accionEliminar, setAccionEliminar] = useState(null);

    const recargar = async () => {
        try {
            const data = await apiFetch("/api/torneos/dashboard");
            setTorneos([...data]);
        } catch (err) {
            console.error("Error al refrescar el dashboard:", err);
        }
    };

    useEffect(() => {
        const cargar = async () => {
            setLoading(true);
            try {
                const data = await apiFetch("/api/torneos/dashboard");
                setTorneos(data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        cargar();
    }, []);

    const eliminarTorneo = (e, id) => {
        e.stopPropagation();
        setMensajeConfirm("¿Desea eliminar definitivamente esta competencia?");
        setAccionEliminar(() => async () => {
            await apiFetch(`/api/torneos/${id}`, { method: "DELETE" });
            recargar();
        });
        setModalConfirm(true);
    };

    const abrirEdicion = (e, t) => {
        e.stopPropagation();
        setTorneoSeleccionado(t);
        setModalEditar(true);
    };

    const torneosFiltrados = torneos
        .filter((t) => {
            if (!esAdmin) return t.estado === "activo";
            return filtro === "activos" ? t.estado === "activo" : true;
        })
        .filter((t) => t.nombre.toLowerCase().includes(busqueda.toLowerCase()));

    if (loading) return (
        <div className="flex flex-col items-center py-40 gap-4">
            <div className="w-12 h-12 border-4 border-cyan-500/10 border-t-cyan-500 rounded-full animate-spin"></div>
            <span className="text-[11px] font-bold text-cyan-500 uppercase tracking-widest">Sincronizando Competencias...</span>
        </div>
    );

    return (
        <div className="w-full max-w-6xl mx-auto px-4">
            {/* HEADER PROFESIONAL */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <FaTrophy className="text-cyan-500 text-2xl" />
                        <h2 className="text-3xl font-bold text-white tracking-tight leading-none">Gestión de Torneos</h2>
                    </div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Panel de administración de ligas y divisiones</p>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:w-auto">
                    {esAdmin && (
                        <div className="bg-[#0a0f2c] p-1.5 rounded-xl border border-slate-800 flex gap-1 w-full md:w-auto">
                            {["activos", "todos"].map((f) => (
                                <button
                                    key={f}
                                    className={`px-6 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${filtro === f ? "bg-cyan-600 text-white shadow-lg shadow-cyan-900/20" : "text-slate-500 hover:text-slate-300"}`}
                                    onClick={() => setFiltro(f)}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="relative w-full md:w-64">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-xs" />
                        <input
                            type="text"
                            placeholder="Buscar competencia..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="w-full pl-10 pr-5 py-3 rounded-xl bg-[#0a0f2c] text-sm text-slate-200 border border-slate-800 focus:border-cyan-500 outline-none transition-all placeholder:text-slate-700 shadow-inner"
                        />
                    </div>

                    <button
                        onClick={() => setModalCrear(true)}
                        className="w-full md:w-auto flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg active:scale-95"
                    >
                        <FaPlus size={12} /> Nuevo Torneo
                    </button>
                </div>
            </div>

            {/* LISTADO TIPO LISTA (ESPACIO AMPLIO) */}
            <div className="grid grid-cols-1 gap-4">
                {torneosFiltrados.map((t) => (
                    <div
                        key={t.id}
                        onClick={() => navigate(`/dashboard/torneos/${t.slug || t.id}`)}
                        className="bg-[#0a0f2c] p-6 rounded-[1.8rem] border border-slate-800 hover:border-cyan-500/30 transition-all flex flex-col lg:flex-row justify-between items-start lg:items-center group cursor-pointer shadow-sm"
                    >
                        <div className="flex-1 w-full">
                            <div className="flex items-center gap-4 flex-wrap mb-3">
                                <h3 className="text-xl font-bold text-white tracking-tight">{t.nombre}</h3>
                                <span className={`text-[10px] px-3 py-1 rounded-lg font-bold border tracking-wider uppercase ${t.tipo === 'ABIERTO' ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20' : 'bg-red-500/5 text-red-400 border-red-500/20'}`}>
                                    {t.tipo}
                                </span>
                            </div>

                            <div className="flex gap-6 text-sm font-medium text-slate-400">
                                <span className="flex items-center gap-2">División: <span className="text-slate-200 font-bold">{t.division}</span></span>
                                <span className="flex items-center gap-2">Zonas: <span className="text-slate-200 font-bold">{t.zonas?.length || 0}</span></span>
                            </div>

                            <div className="mt-4 flex items-center gap-2 pt-3 border-t border-slate-800/50">
                                <FaCircle size={6} className={t.tipo === "ABIERTO" ? "text-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "text-slate-600"} />
                                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                                    {t.tipo === "CERRADO" ? "No permite inscripciones" : "Inscripciones habilitadas"}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-6 lg:mt-0 w-full lg:w-auto">
                            <button
                                title="Gestionar"
                                className="flex-1 lg:w-12 lg:h-12 p-3 bg-[#040714] border border-slate-800 text-cyan-500 hover:bg-cyan-600 hover:text-white rounded-xl transition-all flex items-center justify-center shadow-inner"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/dashboard/torneos/${t.slug || t.id}`);
                                }}
                            >
                                <FaEye size={18} />
                            </button>
                            <button
                                title="Editar"
                                className="flex-1 lg:w-12 lg:h-12 p-3 bg-[#040714] border border-slate-800 text-amber-500 hover:bg-amber-600 hover:text-white rounded-xl transition-all flex items-center justify-center shadow-inner"
                                onClick={(e) => abrirEdicion(e, t)}
                            >
                                <FaEdit size={18} />
                            </button>
                            <button
                                title="Eliminar"
                                className="flex-1 lg:w-12 lg:h-12 p-3 bg-[#040714] border border-slate-800 text-red-500 hover:bg-red-600 hover:text-white rounded-xl transition-all flex items-center justify-center shadow-inner"
                                onClick={(e) => eliminarTorneo(e, t.id)}
                            >
                                <FaTrash size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODALES */}
            {modalCrear && <ModalCrearTorneo onClose={() => setModalCrear(false)} onCreated={recargar} />}
            {modalEditar && torneoSeleccionado && <ModalEditarTorneo torneo={torneoSeleccionado} onClose={() => setModalEditar(false)} onUpdated={recargar} />}
            {modalConfirm && (
                <ConfirmModal
                    mensaje={mensajeConfirm}
                    onCancel={() => setModalConfirm(false)}
                    onConfirm={async () => {
                        await accionEliminar();
                        setModalConfirm(false);
                    }}
                />
            )}
        </div>
    );
}