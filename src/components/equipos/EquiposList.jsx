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
    const [filtro, setFiltro] = useState("activos"); // "activos", "inactivos", "todos"
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
            const data = await apiFetch("/api/equipos/mis-equipos");
            setEquipos(data || []);
        } catch (error) {
            console.error("Error cargando equipos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { cargar(); }, []);

    // LÓGICA DE FILTRADO ACTUALIZADA
    const equiposFiltrados = equipos
        .filter((e) => {
            // Si no es admin, el backend ya filtró lo que puede ver, pero por seguridad solo mostramos activos
            if (!esAdmin) return e.estado === true;

            // Si es admin, evaluamos el botón seleccionado
            if (filtro === "activos") return e.estado === true;
            if (filtro === "inactivos") return e.estado === false;
            return true; // "todos"
        })
        .filter((e) => e.nombre.toLowerCase().includes(busqueda.toLowerCase()));

    if (loading) return (
        <div className="flex flex-col items-center py-40 gap-4">
            <div className="w-12 h-12 border-4 border-cyan-500/10 border-t-cyan-500 rounded-full animate-spin"></div>
            <span className="text-xs font-bold text-cyan-500 uppercase tracking-widest text-center">
                Sincronizando Clubes...
            </span>
        </div>
    );

    return (
        <div className="w-full max-w-6xl mx-auto px-4">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <FaShieldAlt className="text-cyan-500 text-2xl" />
                        <h2 className="text-3xl font-bold text-white tracking-tight leading-none">
                            Gestión de Equipos
                        </h2>
                    </div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                        Registro oficial de clubes y plantillas institucionales
                    </p>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:w-auto">
                    {/* FILTROS TRIPLES PARA ADMIN */}
                    {esAdmin && (
                        <div className="bg-[#0a0f2c] p-1.5 rounded-xl border border-slate-800 flex gap-1 w-full md:w-auto">
                            {["activos", "inactivos", "todos"].map((f) => (
                                <button
                                    key={f}
                                    className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${filtro === f ? "bg-cyan-600 text-white shadow-lg shadow-cyan-900/20" : "text-slate-500 hover:text-slate-300"}`}
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
                            placeholder="Buscar club..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="w-full pl-10 pr-5 py-3 rounded-xl bg-[#0a0f2c] text-sm text-slate-200 border border-slate-800 focus:border-cyan-500 outline-none transition-all placeholder:text-slate-700"
                        />
                    </div>

                    <button
                        onClick={() => setModalCrearEquipo(true)}
                        className="w-full md:w-auto flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg active:scale-95"
                    >
                        <FaPlus size={12} /> Nuevo Equipo
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
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
                    <div className="text-center py-24 bg-[#0a0f2c]/50 rounded-[2.5rem] border border-dashed border-slate-800">
                        <p className="text-slate-600 text-sm font-semibold uppercase tracking-widest">
                            {busqueda ? "No hay coincidencias en el registro" : `No hay equipos ${filtro} registrados`}
                        </p>
                    </div>
                )}
            </div>

            {/* ... modales ... */}
            {modalCrearEquipo && <ModalCrearEquipo onClose={() => setModalCrearEquipo(false)} onCreated={cargar} />}
            {equipoEditar && <ModalEditarEquipo equipo={equipoEditar} onClose={() => setEquipoEditar(null)} onUpdated={cargar} />}
            {equipoInscribir && <ModalInscribirEquipo equipo={equipoInscribir} onClose={() => setEquipoInscribir(null)} onInscripto={cargar} />}
            {inscripcionEliminar && (
                <ConfirmModal
                    mensaje={`¿DESEA DESVINCULAR ESTE EQUIPO DEL TORNEO ${inscripcionEliminar.nombreTorneo.toUpperCase()}?`}
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
                    mensaje="¿ESTÁ SEGURO DE ELIMINAR ESTE EQUIPO DEL SISTEMA?"
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