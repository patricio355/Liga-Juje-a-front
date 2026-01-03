import { FaEdit, FaTrash, FaPlus, FaCircle, FaShieldAlt, FaExternalLinkAlt } from "react-icons/fa";

export default function EquipoCard({
                                       equipo,
                                       onEdit,
                                       onDelete,
                                       onInscribir,
                                       onEliminarInscripcion
                                   }) {
    const inscripciones = equipo.inscripciones || [];

    return (
        <div className="bg-[#1c213b] border border-slate-800 rounded-[2rem] p-5 shadow-2xl hover:border-emerald-500/30 transition-all group">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

                {/* SECCIÓN IZQUIERDA: INFO PRINCIPAL */}
                <div className="flex items-start gap-5">
                    {/* CONTENEDOR DE ESCUDO ESTANDARIZADO */}
                    <div className="shrink-0 w-16 h-16 bg-[#0f172a] rounded-2xl border border-slate-800 p-2 flex items-center justify-center shadow-inner">
                        {equipo.escudo ? (
                            <img
                                src={equipo.escudo}
                                alt={equipo.nombre}
                                className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(16,185,129,0.2)]"
                            />
                        ) : (
                            <FaShieldAlt className="text-slate-700 text-2xl" />
                        )}
                    </div>

                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-lg font-black uppercase italic tracking-tighter text-white group-hover:text-emerald-400 transition-colors">
                                {equipo.nombre}
                            </h3>
                            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${
                                equipo.estado
                                    ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500'
                                    : 'bg-red-500/5 border-red-500/20 text-red-500'
                            }`}>
                                <FaCircle size={6} className={equipo.estado ? 'animate-pulse' : ''} />
                                <span className="text-[9px] font-black uppercase tracking-widest">
                                    {equipo.estado ? "Activo" : "Inactivo"}
                                </span>
                            </div>
                        </div>

                        {/* LISTADO DE TORNEOS COMO "PILLS" */}
                        <div className="flex flex-wrap gap-2">
                            {inscripciones.length > 0 ? (
                                inscripciones.map((i) => (
                                    <div
                                        key={i.id}
                                        className="flex items-center gap-2 bg-[#0f172a] border border-slate-800 pl-3 pr-1 py-1 rounded-xl group/tag hover:border-red-500/50 transition-all"
                                    >
                                        <span className="text-[10px] font-bold text-slate-400 uppercase italic">
                                            {i.nombreTorneo} <span className="text-emerald-500/50">({i.nombreZona})</span>
                                        </span>
                                        <button
                                            onClick={() => onEliminarInscripcion(i)}
                                            className="p-1.5 text-slate-600 hover:text-red-500 transition-colors"
                                            title="Desvincular"
                                        >
                                            <FaTrash size={10} />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest italic">
                                    Sin inscripciones activas
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* SECCIÓN DERECHA: ACCIONES RÁPIDAS */}
                <div className="flex items-center justify-end gap-2 border-t border-slate-800/50 pt-4 md:pt-0 md:border-0">
                    <button
                        onClick={() => onInscribir(equipo)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                        <FaPlus size={10} /> <span className="hidden sm:inline">Inscribir</span>
                    </button>

                    <button
                        onClick={() => onEdit(equipo)}
                        className="p-3 bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white rounded-xl transition-all shadow-lg shadow-amber-900/10"
                        title="Editar"
                    >
                        <FaEdit size={14} />
                    </button>

                    <button
                        onClick={() => onDelete(equipo.id)}
                        className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-lg shadow-red-900/10"
                        title="Eliminar"
                    >
                        <FaTrash size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}