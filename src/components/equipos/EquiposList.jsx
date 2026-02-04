import { useEffect, useState, useContext } from "react";
import EquipoCard from "./EquiposCard";
import ModalInscribirEquipo from "./ModalInscribirEquipo";
import ConfirmModal from "../dashboard/ConfirmModal";
import ModalCrearEquipo from "./ModalCrearEquipo";
import ModalEditarEquipo from "./ModalEditarEquipo";
import { apiFetch } from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import { FaPlus, FaShieldAlt, FaSearch } from "react-icons/fa";
import { eliminarEquipo } from "../../api/equipos.api";

export default function EquiposList() {
    const { user } = useContext(AuthContext);
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

    const cargar = async () => {
        setLoading(true);
        try {
            const data = await apiFetch("/api/equipos/mis-equipos");
            setEquipos(data || []);
        } catch (error) {
            console.error("Error cargando equipos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { cargar(); }, []);

    // LÓGICA DE FILTRADO Y ORDENAMIENTO ALFABÉTICO
    const equiposFiltrados = equipos
        .filter((e) => {
            if (!esAdmin) return e.estado === true;
            if (filtro === "activos") return e.estado === true;
            if (filtro === "inactivos") return e.estado === false;
            return true;
        })
        .filter((e) => e.nombre.toLowerCase().includes(busqueda.toLowerCase()))
        // ORDEN ALFABÉTICO: (a, b) => comparamos nombres
        .sort((a, b) => a.nombre.localeCompare(b.nombre));

    const handleEliminarEquipo = async (id) => {
        try {
            await eliminarEquipo(id);
            cargar(); // Recargar lista tras eliminar
        } catch (error) {
            console.error("Error al eliminar equipo:", error);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center py-40 gap-4">
            <div className="w-12 h-12 border-4 border-white/5 border-t-slate-400 rounded-full animate-spin"></div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] text-center">
                Sincronizando Clubes...
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
                            <FaShieldAlt className="text-slate-400 text-xl" />
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none">
                            Equipos
                        </h2>
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                        Gestión de Clubes y Afiliaciones
                    </p>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:w-auto">
                    {esAdmin && (
                        <div className="bg-white/5 p-1 rounded-xl border border-white/10 flex gap-1 w-full md:w-auto shadow-inner">
                            {["activos", "inactivos", "todos"].map((f) => (
                                <button
                                    key={f}
                                    className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${
                                        filtro === f
                                            ? "bg-slate-700 text-white shadow-lg"
                                            : "text-slate-500 hover:text-slate-300"
                                    }`}
                                    onClick={() => setFiltro(f)}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="relative w-full md:w-64">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 size-3" />
                        <input
                            type="text"
                            placeholder="BUSCAR CLUB..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="w-full pl-10 pr-5 py-3 rounded-xl bg-white/5 text-xs font-bold text-slate-200 border border-white/10 focus:border-slate-600 outline-none transition-all placeholder:text-slate-800"
                        />
                    </div>

                    <button
                        onClick={() => setModalCrearEquipo(true)}
                        className="w-full md:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-slate-100 to-slate-400 hover:from-white hover:to-slate-300 text-black px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95"
                    >
                        <FaPlus size={10} /> Nuevo Equipo
                    </button>
                </div>
            </div>

            {/* LISTADO */}
            <div className="grid grid-cols-1 gap-4">
                {equiposFiltrados.length > 0 ? (
                    equiposFiltrados.map(e => (
                        <EquipoCard
                            key={e.id}
                            equipo={e}
                            onEdit={(equipo) => setEquipoEditar(equipo)}
                            onDelete={handleEliminarEquipo} // La confirmación ocurre dentro de EquipoCard
                            onInscribir={(equipo) => setEquipoInscribir(equipo)}
                            onEliminarInscripcion={(insc) => setInscripcionEliminar(insc)}
                        />
                    ))
                ) : (
                    <div className="text-center py-24 bg-white/5 rounded-[2.5rem] border border-dashed border-white/10">
                        <p className="text-slate-700 text-[10px] font-black uppercase tracking-[0.4em] italic">
                            {busqueda ? "Sin coincidencias" : "Registro Vacío"}
                        </p>
                    </div>
                )}
            </div>

            {/* MODALES */}
            {modalCrearEquipo && <ModalCrearEquipo onClose={() => setModalCrearEquipo(false)} onCreated={cargar} />}
            {equipoEditar && <ModalEditarEquipo equipo={equipoEditar} onClose={() => setEquipoEditar(null)} onUpdated={cargar} />}
            {equipoInscribir && <ModalInscribirEquipo equipo={equipoInscribir} onClose={() => setEquipoInscribir(null)} onInscripto={cargar} />}

            {inscripcionEliminar && (
                <ConfirmModal
                    mensaje={`¿DESEA DESVINCULAR ESTE EQUIPO DEL TORNEO ${inscripcionEliminar.nombreTorneo?.toUpperCase() || 'SELECCIONADO'}?`}
                    onCancel={() => setInscripcionEliminar(null)}
                    onConfirm={async () => {
                        await apiFetch(`/api/equipos-zona/${inscripcionEliminar.id}`, { method: "DELETE" });
                        setInscripcionEliminar(null);
                        cargar();
                    }}
                />
            )}
        </div>
    );
}