import { FaEdit, FaTrash, FaPlus, FaCircle, FaShieldAlt } from "react-icons/fa";

export default function EquipoCard({ equipo, onEdit, onDelete, onInscribir, onEliminarInscripcion }) {
    const inscripciones = equipo.inscripciones || [];

    return (
        <div className="bg-[#0a0f2c] border border-slate-800 rounded-[1.8rem] p-5 hover:border-cyan-500/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group shadow-sm">

            <div className="flex flex-1 items-start md:items-center gap-6">
                {/* ESCUDO COMPACTO Y LIMPIO */}
                <div className="shrink-0 w-16 h-16 bg-[#040714] rounded-2xl border border-slate-800 p-2.5 flex items-center justify-center shadow-inner">
                    {equipo.escudo ? (
                        <img
                            src={equipo.escudo}
                            alt={equipo.nombre}
                            className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(6,182,212,0.2)]"
                        />
                    ) : (
                        <FaShieldAlt className="text-slate-800 text-2xl" />
                    )}
                </div>

                <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-4">
                        <h3 className="text-lg font-bold text-white tracking-tight">
                            {equipo.nombre}
                        </h3>
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${
                            equipo.estado
                                ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500'
                                : 'bg-red-500/5 border-red-500/20 text-red-500'
                        }`}>
                            <FaCircle size={6} className={equipo.estado ? 'animate-pulse' : ''} />
                            <span>{equipo.estado ? "Activo" : "Inactivo"}</span>
                        </div>
                    </div>

                    {/* TORNEOS VINCULADOS */}
                    <div className="flex flex-wrap gap-2">
                        {inscripciones.length > 0 ? (
                            inscripciones.map((i) => (
                                <div
                                    key={i.id}
                                    className="flex items-center gap-2 bg-[#040714] border border-slate-800 pl-3 pr-1 py-1 rounded-xl group/tag hover:border-red-500/40 transition-all"
                                >
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                                        {i.nombreTorneo} <span className="text-cyan-500/50">[{i.nombreZona}]</span>
                                    </span>
                                    <button
                                        onClick={() => onEliminarInscripcion(i)}
                                        className="p-1.5 text-slate-700 hover:text-red-500 transition-colors"
                                        title="Eliminar Inscripción"
                                    >
                                        <FaTrash size={10} />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-widest">
                                Sin competencias asignadas
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* ACCIONES PROFESIONALES */}
            <div className="flex items-center justify-end gap-2 border-t border-slate-800 md:border-0 pt-4 md:pt-0">
                <button
                    onClick={() => onInscribir(equipo)}
                    className="flex items-center gap-2 px-5 py-3 bg-cyan-600/10 hover:bg-cyan-600 text-cyan-400 hover:text-white rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all"
                >
                    <FaPlus size={10} /> Inscribir
                </button>

                <button
                    onClick={() => onEdit(equipo)}
                    className="p-3 bg-[#040714] border border-slate-800 text-slate-500 hover:text-amber-500 hover:border-amber-500/50 rounded-xl transition-all shadow-inner"
                    title="Editar Equipo"
                >
                    <FaEdit size={16} />
                </button>

                <button
                    onClick={() => onDelete(equipo.id)}
                    className="p-3 bg-[#040714] border border-slate-800 text-slate-500 hover:text-red-500 hover:border-red-500/50 rounded-xl transition-all shadow-inner"
                    title="Eliminar Equipo"
                >
                    <FaTrash size={16} />
                </button>
            </div>
        </div>
    );
}