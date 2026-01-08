import { useEffect, useState, useContext } from "react";
import EquipoCard from "./EquiposCard";
import ModalInscribirEquipo from "./ModalInscribirEquipo";
import ConfirmModal from "../dashboard/ConfirmModal";
import ModalCrearEquipo from "./ModalCrearEquipo";
import ModalEditarEquipo from "./ModalEditarEquipo";
import { apiFetch } from "../../api/api";
import { AuthContext } from "../../context/AuthContext"; // Importante para roles
import { FaPlus, FaShieldAlt, FaFutbol, FaTrash, FaEdit } from "react-icons/fa";
import { eliminarEquipo } from "../../api/equipos.api";

export default function EquiposList() {
    const { user } = useContext(AuthContext);

    // Normalización de roles
    const userRole = user?.role?.toUpperCase().trim();
    const esAdmin = userRole === "ADMIN" || userRole === "ROLE_ADMIN";

    const [equipos, setEquipos] = useState([]);
    const [filtro, setFiltro] = useState("activos");
    const [busqueda, setBusqueda] = useState("");
    const [loading, setLoading] = useState(true);

    const [modalCrearEquipo, setModalCrearEquipo] = useState(false);
    const [equipoEditar, setEquipoEditar] = useState(null);
    const [equipoInscribir, setEquipoInscribir] = useState(null);
    const [inscripcionEliminar, setInscripcionEliminar] = useState(null);
    const [idEliminarEquipo, setIdEliminarEquipo] = useState(null);
    const [confirmEliminarEquipo, setConfirmEliminarEquipo] = useState(false);

    const cargar = async () => {
        setLoading(true);
        try {
            // Usamos el endpoint que filtra por el usuario autenticado (dueño/creador)
            const data = await apiFetch("/api/equipos/mis-equipos");
            setEquipos(data || []);
        } catch (error) {
            console.error("Error cargando equipos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargar();
    }, []);

    // Lógica de filtrado idéntica a TorneosList
    const equiposFiltrados = equipos
        .filter((e) => {
            // Si no es admin, solo ve activos. Si es admin, depende del botón de filtro.
            if (!esAdmin) return e.estado === true;
            return filtro === "activos" ? e.estado === true : true;
        })
        .filter((e) => e.nombre.toLowerCase().includes(busqueda.toLowerCase()));

    if (loading) return (
        <div className="flex flex-col items-center py-32 gap-4">
            <FaFutbol className="text-5xl text-emerald-600 animate-spin" />
            <span className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Cargando Equipos...</span>
        </div>
    );

    return (
        <div className="w-full max-w-6xl mx-auto">
            {/* HEADER - Identico a TorneosList */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-8">
                <div>
                    <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">Gestión de Equipos</h2>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-3 italic">Registro de clubes y plantillas</p>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-5 w-full lg:w-auto">
                    {/* Filtros Estilo Torneos: Solo visibles para Admin */}
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
                        placeholder="Buscar club..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="w-full md:w-64 px-5 py-3.5 rounded-2xl bg-[#0f172a] text-sm text-slate-200 border border-slate-700/50 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-700"
                    />

                    <button
                        onClick={() => setModalCrearEquipo(true)}
                        className="w-full md:w-auto flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white px-7 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl active:scale-95"
                    >
                        <FaPlus size={14} /> Nuevo Equipo
                    </button>
                </div>
            </div>

            {/* LISTADO TIPO GRID */}
            <div className="grid grid-cols-1 gap-6">
                {equiposFiltrados.length > 0 ? (
                    equiposFiltrados.map(e => (
                        <EquipoCard
                            key={e.id}
                            equipo={e}
                            onEdit={(equipo) => setEquipoEditar(equipo)}
                            onDelete={(id) => {
                                setIdEliminarEquipo(id);
                                setConfirmEliminarEquipo(true);
                            }}
                            onInscribir={(equipo) => setEquipoInscribir(equipo)}
                            onEliminarInscripcion={(insc) => setInscripcionEliminar(insc)}
                        />
                    ))
                ) : (
                    <div className="text-center py-20 bg-[#1c213b]/30 rounded-[2rem] border border-dashed border-slate-700/50">
                        <p className="text-slate-600 text-[11px] font-black uppercase tracking-widest italic">
                            {busqueda ? "No hay coincidencias para la búsqueda" : "No tienes equipos registrados o activos"}
                        </p>
                    </div>
                )}
            </div>

            {/* MODALES */}
            {modalCrearEquipo && (
                <ModalCrearEquipo onClose={() => setModalCrearEquipo(false)} onCreated={cargar} />
            )}

            {equipoEditar && (
                <ModalEditarEquipo equipo={equipoEditar} onClose={() => setEquipoEditar(null)} onUpdated={cargar} />
            )}

            {equipoInscribir && (
                <ModalInscribirEquipo equipo={equipoInscribir} onClose={() => setEquipoInscribir(null)} onInscripto={cargar} />
            )}

            {inscripcionEliminar && (
                <ConfirmModal
                    mensaje={`¿Eliminar del torneo ${inscripcionEliminar.nombreTorneo}?`}
                    onCancel={() => setInscripcionEliminar(null)}
                    onConfirm={async () => {
                        await apiFetch(`/api/equipos-zona/${inscripcionEliminar.id}`, { method: "DELETE" });
                        setInscripcionEliminar(null);
                        cargar();
                    }}
                />
            )}

            {confirmEliminarEquipo && (
                <ConfirmModal
                    mensaje="¿Eliminar definitivamente este equipo?"
                    onCancel={() => setConfirmEliminarEquipo(false)}
                    onConfirm={async () => {
                        await eliminarEquipo(idEliminarEquipo);
                        setConfirmEliminarEquipo(false);
                        cargar();
                    }}
                />
            )}
        </div>
    );
}