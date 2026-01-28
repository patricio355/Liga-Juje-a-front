import { FaEdit, FaCheckCircle, FaMapMarkerAlt, FaClock, FaCalendarAlt, FaUserTie, FaTrash } from "react-icons/fa";

export default function PartidoCardAdmin({
                                             partido,
                                             equiposDuplicados,
                                             onCerrar,
                                             onEditar,
                                             onEditarInfo,
                                             onEliminar
                                         }) {
    const finalizado = partido.estado === "FINALIZADO";
    const logisticaCompleta = partido.fecha && partido.cancha && partido.hora;

    const local = partido.local || "Local";
    const visitante = partido.visitante || "Visitante";

    const esLocalDuplicado = equiposDuplicados?.has(local);
    const esVisitaDuplicado = equiposDuplicados?.has(visitante);

    const formatFechaCorta = (fechaStr) => {
        if (!fechaStr) return "S/F";
        try {
            const date = new Date(fechaStr + "T00:00:00");
            const dias = ["DOMINGO", "LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO"];
            return `${dias[date.getDay()]} ${date.getDate()}`;
        } catch (e) {
            return fechaStr;
        }
    };

    const formatFechaCompleta = (fechaStr) => {
        if (!fechaStr) return "FECHA NO CARGADA";
        try {
            const date = new Date(fechaStr + "T00:00:00");
            return new Intl.DateTimeFormat('es-AR', {
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
            }).format(date).toUpperCase();
        } catch (e) {
            return fechaStr;
        }
    };

    return (
        /* Agregamos overflow-hidden para que el fondo no se escape de las esquinas redondeadas */
        <div className={`
            relative overflow-hidden rounded-[2rem] border transition-all duration-500 mb-6
            ${finalizado
            ? "bg-cyan-500/5 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
            : logisticaCompleta
                ? "bg-[#0a0f2c] border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.1)]"
                : "bg-[#0a0f2c] border-slate-800 shadow-xl"}
        `}>

            {/* BOTÓN ELIMINAR - Lo ajustamos para que se vea bien con overflow-hidden */}
            <button
                onClick={() => onEliminar && onEliminar(partido)}
                className="absolute top-4 right-4 z-30 p-2.5 md:p-3 bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white rounded-full transition-all duration-300 group border border-red-500/30 backdrop-blur-sm shadow-lg"
                title="Eliminar partido permanentemente"
            >
                <FaTrash className="text-[10px] md:text-[12px] group-hover:scale-110 transition-transform" />
            </button>

            {/* 1. INFO DEL PARTIDO */}
            <div className="p-6 md:p-8">
                <div className="grid grid-cols-3 items-center gap-2 md:gap-4">
                    {/* LOCAL */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 md:w-20 md:h-20 flex items-center justify-center rounded-full bg-[#040714] border border-slate-800 p-2 shadow-inner">
                            <img src={partido.localEscudo || "/default-escudo.png"} alt={local} className="w-full h-full object-contain" />
                        </div>
                        <span className={`text-[9px] md:text-xs font-bold uppercase text-center leading-tight tracking-widest transition-colors ${esLocalDuplicado ? "text-red-500" : "text-slate-300"}`}>
                            {local}
                        </span>
                    </div>

                    {/* INFO CENTRAL */}
                    <div className="flex flex-col items-center justify-center">
                        <div className={`px-2 md:px-3 py-1 rounded-full text-[8px] md:text-[9px] font-bold uppercase tracking-widest mb-4 border transition-colors
                            ${finalizado ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                            : logisticaCompleta ? "bg-green-500/10 text-green-400 border-green-500/20"
                                : "bg-amber-500/10 text-amber-500 border-amber-500/20"}`}>
                            {finalizado ? "Finalizado" : logisticaCompleta ? "Programado" : "Pendiente"}
                        </div>
                        <div className="flex items-center gap-2 md:gap-4">
                            <span className="text-2xl md:text-5xl font-bold text-white tracking-tighter">{finalizado ? (partido.golesLocal ?? 0) : ""}</span>
                            <span className={`font-bold ${finalizado ? "text-slate-700" : "text-cyan-500 text-sm md:text-2xl tracking-widest"}`}>{finalizado ? "-" : "VS"}</span>
                            <span className="text-2xl md:text-5xl font-bold text-white tracking-tighter">{finalizado ? (partido.golesVisitante ?? 0) : ""}</span>
                        </div>
                    </div>

                    {/* VISITANTE */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 md:w-20 md:h-20 flex items-center justify-center rounded-full bg-[#040714] border border-slate-800 p-2 shadow-inner">
                            <img src={partido.visitanteEscudo || "/default-escudo.png"} alt={visitante} className="w-full h-full object-contain" />
                        </div>
                        <span className={`text-[9px] md:text-xs font-bold uppercase text-center leading-tight tracking-widest transition-colors ${esVisitaDuplicado ? "text-red-500" : "text-slate-300"}`}>
                            {visitante}
                        </span>
                    </div>
                </div>

                {/* BLOQUE LOGÍSTICO */}
                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 border-t border-slate-800/50 pt-6">
                    <div className={`flex items-center justify-center gap-2 bg-[#040714] px-3 py-2.5 rounded-xl border transition-colors ${partido.cancha ? 'border-green-500/30 text-green-500' : 'border-slate-800 text-slate-500'}`}>
                        <FaMapMarkerAlt size={12} className="opacity-70" />
                        <span className="text-[10px] font-bold uppercase truncate">{partido.cancha || "A definir"}</span>
                    </div>

                    <div className={`group/fecha relative flex items-center justify-center gap-2 bg-[#040714] px-3 py-2.5 rounded-xl border transition-colors cursor-help ${partido.fecha ? 'border-green-500/30 text-white' : 'border-slate-800 text-slate-500'}`}>
                        <FaCalendarAlt size={11} className={partido.fecha ? "text-green-500" : "text-slate-500"} />
                        <span className="text-[10px] font-bold uppercase">{formatFechaCorta(partido.fecha)}</span>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/fecha:opacity-100 transition-all duration-300 pointer-events-none z-[100] translate-y-2 group-hover/fecha:translate-y-0">
                            <div className="bg-slate-900 text-white text-[9px] font-black px-4 py-2 rounded-xl shadow-2xl border border-slate-700 whitespace-nowrap flex items-center gap-2 uppercase">
                                <FaCalendarAlt size={10} className="text-green-500" />
                                {formatFechaCompleta(partido.fecha)}
                            </div>
                            <div className="w-2 h-2 bg-slate-900 rotate-45 mx-auto -mt-1 border-r border-b border-slate-700"></div>
                        </div>
                    </div>

                    <div className={`flex items-center justify-center gap-2 bg-[#040714] px-3 py-2.5 rounded-xl border transition-colors ${partido.hora ? 'border-green-500/30 text-slate-300' : 'border-slate-800 text-slate-500'}`}>
                        <FaClock size={11} className={partido.hora ? "text-green-500" : "opacity-70"} />
                        <span className="text-[10px] font-bold uppercase">{partido.hora ? `${partido.hora} HS` : "S/H"}</span>
                    </div>

                    <div className="flex items-center justify-center gap-2 bg-[#040714] px-3 py-2.5 rounded-xl border border-slate-800 text-cyan-500">
                        <FaUserTie size={12} className="opacity-70" />
                        <span className="text-[10px] font-bold uppercase truncate">{partido.arbitro || "Sin Árbitro"}</span>
                    </div>
                </div>
            </div>

            {/* 2. BARRA DE ACCIONES - Al estar dentro de overflow-hidden, respetará la curva inferior */}
            <div className="flex border-t border-slate-800 bg-[#040714]/50 p-4 gap-3">
                {finalizado ? (
                    <button onClick={() => onEditar(partido)} className="w-full flex items-center justify-center gap-3 py-3.5 bg-cyan-700 hover:bg-cyan-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-cyan-900/20">
                        <FaEdit size={14} /> Editar Resultado
                    </button>
                ) : (
                    <>
                        <button onClick={() => onEditarInfo && onEditarInfo(partido)} className={`flex-1 flex items-center justify-center gap-3 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${logisticaCompleta ? 'bg-green-600/10 border-green-500/50 text-green-500 hover:bg-green-600 hover:text-white' : 'bg-[#0a0f2c] border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                            <FaEdit size={14} /> {logisticaCompleta ? "Re-Programar" : "Programar"}
                        </button>
                        <button onClick={() => onCerrar(partido)} className="flex-1 flex items-center justify-center gap-3 py-3.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-red-900/20">
                            <FaCheckCircle size={14} /> Finalizar
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}