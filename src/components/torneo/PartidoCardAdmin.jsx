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
            ? "bg-cyan-500/5 border-cyan-500/20"
            : "bg-[#0a0f2c] border-slate-800 shadow-xl"}
        `}>

            {/* 1. INFO DEL PARTIDO */}
            <div className="p-6 md:p-8">
                <div className="grid grid-cols-3 items-center gap-4">

                    {/* LOCAL */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full bg-[#040714] border border-slate-800 p-2 shadow-inner">
                            <img
                                src={partido.localEscudo || "/default-escudo.png"}
                                alt={local}
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <span className={`text-[10px] md:text-xs font-bold uppercase text-center leading-tight tracking-widest transition-colors
                            ${esLocalDuplicado ? "text-red-500" : "text-slate-300"}`}>
                            {local}
                        </span>
                    </div>

                    {/* INFO CENTRAL (Marcador) */}
                    <div className="flex flex-col items-center justify-center">
                        <div className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest mb-4 border
                            ${finalizado
                            ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                            : "bg-amber-500/10 text-amber-500 border-amber-500/20"}`}>
                            {finalizado ? "Finalizado" : "Pendiente"}
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-3xl md:text-5xl font-bold text-white tracking-tighter">
                                {finalizado ? (partido.golesLocal ?? 0) : ""}
                            </span>
                            <span className={`font-bold ${finalizado ? "text-slate-700" : "text-cyan-500 text-xl md:text-2xl tracking-widest"}`}>
                                {finalizado ? "-" : "VS"}
                            </span>
                            <span className="text-3xl md:text-5xl font-bold text-white tracking-tighter">
                                {finalizado ? (partido.golesVisitante ?? 0) : ""}
                            </span>
                        </div>
                    </div>

                    {/* VISITANTE */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full bg-[#040714] border border-slate-800 p-2 shadow-inner">
                            <img
                                src={partido.visitanteEscudo || "/default-escudo.png"}
                                alt={visitante}
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <span className={`text-[10px] md:text-xs font-bold uppercase text-center leading-tight tracking-widest transition-colors
                            ${esVisitaDuplicado ? "text-red-500" : "text-slate-300"}`}>
                            {visitante}
                        </span>
                    </div>
                </div>

                {/* BLOQUE DE DATOS LOGÍSTICOS */}
                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 border-t border-slate-800/50 pt-6">
                    {/* CANCHA */}
                    <div className="flex items-center justify-center gap-2 bg-[#040714] px-3 py-2.5 rounded-xl border border-slate-800 text-cyan-500">
                        <FaMapMarkerAlt size={12} className="opacity-70" />
                        <span className="text-[10px] font-bold uppercase truncate">{partido.cancha || "A definir"}</span>
                    </div>

                    {/* FECHA */}
                    <div className="flex items-center justify-center gap-2 bg-[#040714] px-3 py-2.5 rounded-xl border border-slate-800 text-slate-400">
                        <FaCalendarAlt size={11} className="opacity-70" />
                        <span className="text-[10px] font-bold uppercase">{partido.fecha || "S/F"}</span>
                    </div>

                    {/* HORA */}
                    <div className="flex items-center justify-center gap-2 bg-[#040714] px-3 py-2.5 rounded-xl border border-slate-800 text-slate-400">
                        <FaClock size={11} className="opacity-70" />
                        <span className="text-[10px] font-bold uppercase">{partido.hora ? `${partido.hora} HS` : "S/H"}</span>
                    </div>

                    {/* ARBITRO */}
                    <div className="flex items-center justify-center gap-2 bg-[#040714] px-3 py-2.5 rounded-xl border border-slate-800 text-cyan-500">
                        <FaUserTie size={12} className="opacity-70" />
                        <span className="text-[10px] font-bold uppercase truncate">{partido.arbitro || "Sin Árbitro"}</span>
                    </div>
                </div>
            </div>

            {/* 2. BARRA DE ACCIONES */}
            <div className="flex border-t border-slate-800 bg-[#040714]/50 p-4 gap-3">
                {finalizado ? (
                    <button
                        onClick={() => onEditar(partido)}
                        className="w-full flex items-center justify-center gap-3 py-3.5 bg-cyan-700 hover:bg-cyan-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-cyan-900/20"
                    >
                        <FaEdit size={14} /> Editar Resultado
                    </button>
                ) : (
                    <>
                        <button
                            onClick={() => onEditarInfo && onEditarInfo(partido)}
                            className="flex-1 flex items-center justify-center gap-3 py-3.5 bg-[#0a0f2c] hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
                        >
                            <FaEdit size={14} /> Programar
                        </button>

                        <button
                            onClick={() => onCerrar(partido)}
                            className="flex-1 flex items-center justify-center gap-3 py-3.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-red-900/20"
                        >
                            <FaCheckCircle size={14} /> Finalizar
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}