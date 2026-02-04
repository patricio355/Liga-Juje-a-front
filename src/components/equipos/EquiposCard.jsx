import { FaEdit, FaTrash, FaCircle, FaShieldAlt } from "react-icons/fa";

export default function EquipoCard({ equipo, onEdit, onDelete, onInscribir, onEliminarInscripcion }) {
    const inscripciones = equipo.inscripciones || [];

    return (
        <div className="bg-[#0a0c10] border border-white/5 rounded-[2rem] p-5 md:p-6 hover:border-white/20 transition-all duration-500 flex flex-col md:flex-row md:items-center justify-between gap-6 group shadow-2xl relative overflow-hidden">

            {/* Brillo sutil de fondo al hacer hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-400/0 via-slate-400/0 to-slate-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="flex flex-1 items-start md:items-center gap-6 relative z-10">
                {/* ESCUDO ESTILO PREMIUM */}
                <div className="shrink-0 w-16 h-16 bg-black rounded-2xl border border-white/10 p-2.5 flex items-center justify-center shadow-[0_10px_20px_rgba(0,0,0,0.4)] group-hover:border-white/30 transition-colors">
                    {equipo.escudo ? (
                        <img
                            src={equipo.escudo}
                            alt={equipo.nombre}
                            className="w-full h-full object-contain opacity-90 group-hover:opacity-100 transition-opacity"
                        />
                    ) : (
                        <FaShieldAlt className="text-slate-800 text-2xl" />
                    )}
                </div>

                <div className="space-y-4 flex-1">
                    <div className="flex flex-wrap items-center gap-4">
                        <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">
                            {equipo.nombre}
                        </h3>

                        {/* BADGE DE ESTADO PLATEADO/OSCURO */}
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-[0.2em] transition-all ${
                            equipo.estado
                                ? 'bg-white/5 border-white/10 text-slate-300'
                                : 'bg-red-900/10 border-red-900/20 text-red-500'
                        }`}>
                            <FaCircle size={5} className={equipo.estado ? 'text-slate-400 animate-pulse' : 'text-red-600'} />
                            <span>{equipo.estado ? "Activo" : "Inactivo"}</span>
                        </div>
                    </div>

                    {/* COMPETENCIAS VINCULADAS */}
                    <div className="flex flex-wrap gap-2">
                        {inscripciones.length > 0 ? (
                            inscripciones.map((i) => (
                                <div
                                    key={i.id}
                                    className="flex items-center gap-3 bg-black/40 border border-white/5 pl-3 pr-1 py-1.5 rounded-xl group/tag hover:border-white/20 transition-all"
                                >
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">
                                        {i.nombreTorneo} <span className="text-slate-200 not-italic ml-1">[{i.nombreZona}]</span>
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
                            <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em] italic">
                                Sin competencias asignadas
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* ACCIONES EN GRISES METÁLICOS */}
            <div className="flex items-center justify-end gap-3 border-t border-white/5 md:border-0 pt-4 md:pt-0 relative z-10">
                <button
                    onClick={() => onEdit(equipo)}
                    className="flex-1 md:flex-none p-3.5 bg-white/5 border border-white/10 text-slate-400 hover:bg-white hover:text-black rounded-2xl transition-all shadow-xl active:scale-95"
                    title="Editar Equipo"
                >
                    <FaEdit size={16} />
                </button>

                <button
                    onClick={() => onDelete(equipo.id)}
                    className="flex-1 md:flex-none p-3.5 bg-white/5 border border-white/10 text-slate-700 hover:bg-red-600 hover:text-white hover:border-red-600 rounded-2xl transition-all shadow-xl active:scale-95"
                    title="Eliminar Equipo"
                >
                    <FaTrash size={16} />
                </button>
            </div>
        </div>
    );
}