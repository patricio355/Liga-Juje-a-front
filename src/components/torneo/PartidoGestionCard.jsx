import { FaShieldAlt, FaMapMarkerAlt, FaClock, FaEdit, FaCheckCircle, FaLock, FaCalendarAlt, FaUserTie } from "react-icons/fa";

export default function PartidoGestionCard({ partido, onEditInfo, onFinalize, onEditResult }) {
    const finalizado = partido.estado === "FINALIZADO";

    // Función 1: Formato corto (SÁBADO 16)
    const formatFechaCorta = (fechaStr) => {
        if (!fechaStr) return "A DEFINIR";
        const date = new Date(fechaStr + "T00:00:00");
        const dias = ["DOMINGO", "LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO"];
        return `${dias[date.getDay()]} ${date.getDate()}`;
    };

    // Función 2: Formato largo (SÁBADO 16 DE ENERO DE 2026)
    const formatFechaCompleta = (fechaStr) => {
        if (!fechaStr) return "FECHA NO DEFINIDA";
        const date = new Date(fechaStr + "T00:00:00");
        const dias = ["SÁBADO", "DOMINGO", "LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO"]; // Ajuste de índice si fuera necesario, pero Intl es mejor:

        return new Intl.DateTimeFormat('es-AR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(date).toUpperCase();
    };

    return (
        <div className="w-full flex flex-col gap-2 animate-fade-in">
            {/* CUERPO DE LA CARD */}
            <div className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
                finalizado ? "bg-[#1c213b] border-emerald-500/20" : "bg-[#0e1630] border-blue-900/40"
            }`}>
                <div className="p-4 md:p-8 flex items-center justify-between gap-2 md:gap-4">
                    {/* ... (Contenido de equipos y marcador se mantiene igual) ... */}
                    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 flex-1 justify-start">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-black rounded-2xl p-2 border border-blue-900/30 flex items-center justify-center shrink-0 shadow-inner">
                            {partido.equipoLocalEscudo ? (
                                <img src={partido.equipoLocalEscudo} crossOrigin="anonymous" className="w-full h-full object-contain" alt="L" />
                            ) : <FaShieldAlt className="text-blue-900/20 w-full h-full" />}
                        </div>
                        <span className="text-white font-black uppercase text-[10px] md:text-lg tracking-tighter leading-none self-center">
                            {partido.equipoLocalNombre}
                        </span>
                    </div>

                    <div className="flex flex-col items-center min-w-[80px] md:min-w-[140px] shrink-0 self-center">
                        <span className="text-2xl md:text-4xl font-black italic tracking-tighter text-white leading-none">
                            {finalizado ? `${partido.golesLocal} - ${partido.golesVisitante}` : "-"}
                        </span>
                        <div className={`w-8 md:w-12 h-1 md:h-1.5 mt-2 rounded-full ${
                            finalizado ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" : "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.4)]"
                        }`}></div>
                    </div>

                    <div className="flex flex-col-reverse md:flex-row items-center gap-2 md:gap-4 flex-1 justify-end">
                        <span className="text-white font-black uppercase text-[10px] md:text-lg tracking-tighter leading-none self-center">
                            {partido.equipoVisitanteNombre}
                        </span>
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-black rounded-2xl p-2 border border-blue-900/30 flex items-center justify-center shrink-0 shadow-inner">
                            {partido.equipoVisitanteEscudo ? (
                                <img src={partido.equipoVisitanteEscudo} crossOrigin="anonymous" className="w-full h-full object-contain" alt="V" />
                            ) : <FaShieldAlt className="text-blue-900/20 w-full h-full" />}
                        </div>
                    </div>
                </div>

                {/* INFO EXTRA INFERIOR */}
                <div className="bg-black/40 py-4 px-6 border-t border-blue-900/20">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">

                        {/* Cancha */}
                        <div className="flex items-center gap-2">
                            <FaMapMarkerAlt size={12} className="text-emerald-500 shrink-0" />
                            <div className="flex flex-col">
                                <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Cancha</span>
                                <span className="text-[11px] md:text-xs font-black text-slate-200 uppercase truncate">
                                    {partido.canchaNombre || "A definir"}
                                </span>
                            </div>
                        </div>

                        {/* FECHA CON TOOLTIP DE FORMATO LARGO */}
                        <div className="flex items-center gap-2 group/fecha relative cursor-help">
                            <FaCalendarAlt size={12} className="text-blue-500 shrink-0" />
                            <div className="flex flex-col">
                                <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Fecha</span>
                                <span className="text-[11px] md:text-xs font-black text-white uppercase bg-blue-600/20 px-2 rounded-md transition-all group-hover/fecha:bg-blue-600 group-hover/fecha:shadow-[0_0_10px_rgba(37,99,235,0.4)]">
                                    {formatFechaCorta(partido.fecha)}
                                </span>
                            </div>

                            {/* Tooltip con fecha larga: SÁBADO 16 DE ENERO DE 2026 */}
                            <div className="absolute bottom-full left-0 mb-2 opacity-0 group-hover/fecha:opacity-100 transition-all duration-300 pointer-events-none z-[100] translate-y-2 group-hover/fecha:translate-y-0">
                                <div className="bg-blue-600 text-white text-[10px] font-black px-4 py-2 rounded-xl shadow-2xl border border-blue-400/50 whitespace-nowrap flex items-center gap-2">
                                    <FaCalendarAlt className="text-blue-200" />
                                    {formatFechaCompleta(partido.fecha)}
                                </div>
                                {/* Triangulito del tooltip */}
                                <div className="w-2 h-2 bg-blue-600 rotate-45 ml-6 -mt-1 border-r border-b border-blue-400/50"></div>
                            </div>
                        </div>

                        {/* Horario */}
                        <div className="flex items-center gap-2">
                            <FaClock size={12} className="text-emerald-500 shrink-0" />
                            <div className="flex flex-col">
                                <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Horario</span>
                                <span className="text-[11px] md:text-xs font-black text-slate-200 uppercase">
                                    {partido.hora ? `${partido.hora} HS` : "A definir"}
                                </span>
                            </div>
                        </div>

                        {/* Árbitro */}
                        <div className="flex items-center gap-2">
                            <FaUserTie size={12} className="text-emerald-500 shrink-0" />
                            <div className="flex flex-col">
                                <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Árbitro</span>
                                <span className="text-[11px] md:text-xs font-black text-slate-200 uppercase truncate">
                                    {partido.arbitro || "A definir"}
                                </span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* BOTONES DE GESTIÓN (Se mantienen igual) */}
            <div className="flex items-center justify-center md:justify-end gap-3 px-2 mt-1 mb-8">
                <button
                    onClick={() => finalizado ? onEditResult(partido) : onEditInfo(partido)}
                    className={`flex-1 md:flex-none px-6 py-3 rounded-xl text-[11px] font-black uppercase flex items-center justify-center gap-2 border transition-all active:scale-95 shadow-lg ${
                        finalizado
                            ? "bg-amber-600/10 border-amber-500/40 text-amber-500 hover:bg-amber-600/20"
                            : "bg-slate-900 hover:bg-slate-800 text-blue-400 border-blue-900/40"
                    }`}
                >
                    <FaEdit size={14} />
                    {finalizado ? "Editar Resultado" : "Editar Programación"}
                </button>

                {!finalizado ? (
                    <button
                        onClick={() => onFinalize(partido)}
                        className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-xl text-[11px] font-black uppercase flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 transition-all active:scale-95 border border-emerald-400/20"
                    >
                        <FaCheckCircle size={14} /> Finalizar
                    </button>
                ) : (
                    <div className="flex-1 md:flex-none bg-[#050814] px-8 py-3 rounded-xl text-[11px] font-black uppercase text-slate-600 border border-slate-800/50 flex items-center justify-center gap-2">
                        <FaLock size={12} /> Resultado Cerrado
                    </div>
                )}
            </div>
        </div>
    );
}