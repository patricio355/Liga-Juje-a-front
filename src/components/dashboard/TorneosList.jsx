import { useEffect, useState, useContext } from "react";
import { FaEdit, FaTrash, FaPlus, FaEye, FaFutbol } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ModalCrearTorneo from "./ModalCrearTorneo";
import ModalEditarTorneo from "./ModalEditarTorneo";
import ConfirmModal from "./ConfirmModal";
import { apiFetch } from "../../api/api";
import { AuthContext } from "../../context/AuthContext";

export default function TorneosList() {
    const { user } = useContext(AuthContext);

    // Usamos 'role' como pediste y normalizamos para evitar fallos de lectura
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
            setTorneos(data);
        } catch (err) { console.error(err); }
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
        setMensajeConfirm("¿Desea eliminar definitivamente este torneo?");
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
            // Si no es ADMIN, forzamos activos. Si es ADMIN, depende del botón.
            if (!esAdmin) return t.estado === "activo";
            return filtro === "activos" ? t.estado === "activo" : true;
        })
        .filter((t) => t.nombre.toLowerCase().includes(busqueda.toLowerCase()));

    if (loading) return (
        <div className="flex flex-col items-center py-32 gap-4">
            <FaFutbol className="text-5xl text-emerald-600 animate-spin" />
            <span className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Cargando...</span>
        </div>
    );

    return (
        <div className="w-full max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-8">
                <div>
                    <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">Gestión de Torneos</h2>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-3 italic">Panel de administración centralizada</p>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-5 w-full lg:w-auto">

                    {/* El botón de filtro solo aparece para ADMIN */}
                    {esAdmin && (
                        <div className="bg-[#0f172a] p-2 rounded-2xl border border-slate-700/50 flex gap-1 w-full md:w-auto">
                            {["activos", "todos"].map((f) => (
                                <button
                                    key={f}
                                    className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-[11px] font-black uppercase transition-all ${filtro === f ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20" : "text-slate-500 hover:text-slate-300"}`}
                                    onClick={() => setFiltro(f)}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    )}

                    <input
                        type="text"
                        placeholder="Buscar competencia..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="w-full md:w-64 px-5 py-3.5 rounded-2xl bg-[#0f172a] text-sm text-slate-200 border border-slate-700/50 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-700"
                    />

                    <button
                        onClick={() => setModalCrear(true)}
                        className="w-full md:w-auto flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white px-7 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl active:scale-95"
                    >
                        <FaPlus size={14} /> Nuevo Torneo
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {torneosFiltrados.map((t) => (
                    <div
                        key={t.id}
                        onClick={() => navigate(`/dashboard/torneos/${t.id}`)}
                        className="bg-[#1e293b] p-8 rounded-[2rem] border border-slate-700/30 shadow-2xl flex flex-col lg:flex-row justify-between items-start lg:items-center cursor-pointer hover:border-emerald-500/40 transition-all group relative overflow-hidden"
                    >
                        <div className="flex-1 w-full">
                            <div className="flex items-center gap-5 flex-wrap">
                                <h3 className="text-2xl font-black text-white uppercase italic tracking-tight group-hover:text-emerald-400 transition-colors">{t.nombre}</h3>
                                <span className={`text-[10px] px-3 py-1 rounded-xl font-black border ${t.tipo === 'ABIERTO' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                    {t.tipo}
                                </span>
                            </div>

                            {/* Detalles del Torneo Restaurados */}
                            <div className="mt-3 flex gap-6 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                <span>División: <span className="text-slate-200">{t.division}</span></span>
                                <span>Zonas: <span className="text-slate-200">{t.zonas?.length || 0}</span></span>
                            </div>

                            <p className={`text-[10px] font-black uppercase mt-5 italic tracking-widest ${t.tipo === "CERRADO" ? "text-slate-600" : "text-emerald-500"}`}>
                                {t.tipo === "CERRADO" ? "• Competición Cerrada" : "• Inscripciones en curso"}
                            </p>
                        </div>

                        <div className="flex gap-3 mt-8 lg:mt-0 w-full lg:w-auto">
                            <button
                                title="Gestionar"
                                className="flex-1 lg:w-14 lg:h-14 p-4 bg-[#0f172a] hover:bg-emerald-600 border border-slate-700/50 rounded-2xl text-emerald-500 hover:text-white transition-all shadow-inner flex items-center justify-center"
                                onClick={() => navigate(`/dashboard/torneos/${t.id}`)}
                            >
                                <FaEye size={20} />
                            </button>
                            <button
                                title="Editar"
                                className="flex-1 lg:w-14 lg:h-14 p-4 bg-[#0f172a] hover:bg-amber-600 border border-slate-700/50 rounded-2xl text-amber-500 hover:text-white transition-all shadow-inner flex items-center justify-center"
                                onClick={(e) => abrirEdicion(e, t)}
                            >
                                <FaEdit size={20} />
                            </button>
                            <button
                                title="Eliminar"
                                className="flex-1 lg:w-14 lg:h-14 p-4 bg-[#0f172a] hover:bg-red-600 border border-slate-700/50 rounded-2xl text-red-500 hover:text-white transition-all shadow-inner flex items-center justify-center"
                                onClick={(e) => eliminarTorneo(e, t.id)}
                            >
                                <FaTrash size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {modalCrear && <ModalCrearTorneo onClose={() => setModalCrear(false)} onCreated={recargar} />}
            {modalEditar && torneoSeleccionado && <ModalEditarTorneo torneo={torneoSeleccionado} onClose={() => setModalEditar(false)} onUpdated={recargar} />}
            {modalConfirm && (
                <ConfirmModal
                    mensaje={mensajeConfirm}
                    onCancel={() => setModalConfirm(false)}
                    onConfirm={() => { accionEliminar(); setModalConfirm(false); }}
                />
            )}
        </div>
    );
}