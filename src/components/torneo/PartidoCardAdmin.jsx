import { FaEdit, FaCheckCircle, FaMapMarkerAlt, FaClock, FaCalendarAlt, FaUserTie } from "react-icons/fa";

export default function PartidoCardAdmin({
                                             partido,
                                             equiposDuplicados,
                                             onCerrar,
                                             onEditar,
                                             onEditarInfo
                                         }) {
    const finalizado = partido.estado === "FINALIZADO";

    const local = partido.local || "Local";
    const visitante = partido.visitante || "Visitante";

    const esLocalDuplicado = equiposDuplicados?.has(local);
    const esVisitaDuplicado = equiposDuplicados?.has(visitante);

    return (
        <div className={`
            relative overflow-hidden rounded-[2rem] border transition-all duration-300 mb-6
            ${finalizado
            ? "bg-emerald-500/5 border-emerald-500/20"
            : "bg-[#1e293b] border-slate-700/50 shadow-2xl"}
        `}>

            {/* 1. INFO DEL PARTIDO */}
            <div className="p-6 md:p-8">
                <div className="grid grid-cols-3 items-center gap-4">

                    {/* LOCAL */}
                    <div className="flex flex-col items-center gap-3">
                        <img
                            src={partido.localEscudo || "/default-escudo.png"}
                            alt={local}
                            className="w-14 h-14 md:w-20 md:h-20 object-contain drop-shadow-2xl"
                        />
                        <span className={`text-xs md:text-sm font-black uppercase text-center leading-tight tracking-tight transition-colors
                            ${esLocalDuplicado ? "text-red-500" : "text-slate-100"}`}>
                            {local}
                        </span>
                    </div>

                    {/* INFO CENTRAL (Marcador) */}
                    <div className="flex flex-col items-center justify-center">
                        <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] mb-4
                            ${finalizado ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>
                            {finalizado ? "Finalizado" : "Pendiente"}
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-3xl md:text-5xl font-black text-white tracking-tighter">
                                {finalizado ? (partido.golesLocal ?? 0) : ""}
                            </span>
                            <span className={`font-black ${finalizado ? "text-slate-600" : "text-emerald-500 italic text-2xl md:text-3xl"}`}>
                                {finalizado ? "-" : "VS"}
                            </span>
                            <span className="text-3xl md:text-5xl font-black text-white tracking-tighter">
                                {finalizado ? (partido.golesVisitante ?? 0) : ""}
                            </span>
                        </div>
                    </div>

                    {/* VISITANTE */}
                    <div className="flex flex-col items-center gap-3">
                        <img
                            src={partido.visitanteEscudo || "/default-escudo.png"}
                            alt={visitante}
                            className="w-14 h-14 md:w-20 md:h-20 object-contain drop-shadow-2xl"
                        />
                        <span className={`text-xs md:text-sm font-black uppercase text-center leading-tight tracking-tight transition-colors
                            ${esVisitaDuplicado ? "text-red-500" : "text-slate-100"}`}>
                            {visitante}
                        </span>
                    </div>
                </div>

                {/* BLOQUE DE DATOS LOGÍSTICOS - 4 en línea en PC, 2x2 en Mobile */}
                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 border-t border-slate-700/30 pt-6">
                    {/* CANCHA */}
                    <div className="flex items-center justify-center gap-2 bg-blue-500/5 px-3 py-2 rounded-xl border border-blue-500/10 text-blue-400">
                        <FaMapMarkerAlt size={12} />
                        <span className="text-[10px] md:text-xs font-black uppercase truncate">{partido.cancha || "A definir"}</span>
                    </div>

                    {/* FECHA */}
                    <div className="flex items-center justify-center gap-2 bg-slate-500/5 px-3 py-2 rounded-xl border border-slate-700/20 text-slate-300">
                        <FaCalendarAlt size={11} />
                        <span className="text-[10px] md:text-xs font-bold uppercase">{partido.fecha || "S/F"}</span>
                    </div>

                    {/* HORA */}
                    <div className="flex items-center justify-center gap-2 bg-slate-500/5 px-3 py-2 rounded-xl border border-slate-700/20 text-slate-300">
                        <FaClock size={11} />
                        <span className="text-[10px] md:text-xs font-bold uppercase">{partido.hora ? `${partido.hora} HS` : "S/H"}</span>
                    </div>

                    {/* ARBITRO */}
                    <div className="flex items-center justify-center gap-2 bg-emerald-500/5 px-3 py-2 rounded-xl border border-emerald-500/10 text-emerald-400">
                        <FaUserTie size={12} />
                        <span className="text-[10px] md:text-xs font-black uppercase italic truncate">{partido.arbitro || "Sin Árbitro"}</span>
                    </div>
                </div>
            </div>

            {/* 2. BARRA DE ACCIONES */}
            <div className="flex border-t border-slate-700/50 bg-black/20 p-3 gap-3">
                {finalizado ? (
                    <button
                        onClick={() => onEditar(partido)}
                        className="w-full flex items-center justify-center gap-3 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-black uppercase transition-all shadow-lg shadow-blue-900/20"
                    >
                        <FaEdit size={14} /> Editar Resultado
                    </button>
                ) : (
                    <>
                        <button
                            onClick={() => onEditarInfo && onEditarInfo(partido)}
                            className="flex-1 flex items-center justify-center gap-3 py-4 bg-blue-600/10 hover:bg-blue-600 text-blue-500 hover:text-white border border-blue-500/20 rounded-2xl text-xs font-black uppercase transition-all"
                        >
                            <FaEdit size={14} /> Programar
                        </button>

                        <button
                            onClick={() => onCerrar(partido)}
                            className="flex-1 flex items-center justify-center gap-3 py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl text-xs font-black uppercase transition-all shadow-xl shadow-red-900/20"
                        >
                            <FaCheckCircle size={14} /> Finalizar
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}