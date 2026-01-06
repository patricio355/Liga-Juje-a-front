import { FaShieldAlt, FaMapMarkerAlt, FaClock, FaCalendarAlt, FaUserTie } from "react-icons/fa";

export default function PartidoCard({ partido }) {
    const finalizado = partido.estado === "FINALIZADO";

    // Función auxiliar para manejar datos vacíos
    const formatDato = (dato) => (dato && dato !== "null" && dato !== "") ? dato : "POR CONFIRMAR";

    return (
        <div className="w-full transition-all duration-300">

            {/* --- VISTA CELULAR (md:hidden) --- */}
            <div className={`md:hidden rounded-2xl px-3 py-4 border ${finalizado ? "bg-[#1c213b] border-emerald-500/20" : "bg-[#0e1630] border-slate-700/40"}`}>

                {/* INDICADOR DE ESTADO (Cápsula Plateada para Pendientes) */}
                <div className="flex justify-center mb-3">
                    <span className={`text-[7px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${
                        finalizado
                            ? "text-emerald-500 border-emerald-500/30 bg-emerald-500/10"
                            : "text-slate-400 border-slate-500/30 bg-slate-500/10"
                    }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                            finalizado ? "bg-emerald-500" : "bg-slate-400 animate-pulse shadow-[0_0_5px_rgba(148,163,184,0.8)]"
                        }`}></div>
                        {finalizado ? "Finalizado" : "Pendiente"}
                    </span>
                </div>

                <div className="grid grid-cols-3 items-center gap-1">
                    {/* LOCAL */}
                    <div className="flex flex-col items-center">
                        <div className="w-10 h-10 mb-1 shrink-0">
                            {partido.equipoLocalEscudo ? (
                                <img src={partido.equipoLocalEscudo} alt="L" className="w-full h-full object-contain" />
                            ) : <FaShieldAlt className="text-slate-700 w-full h-full" />}
                        </div>
                        <span className="text-[10px] font-black text-white uppercase text-center leading-tight w-full break-words">
                            {formatDato(partido.equipoLocalNombre)}
                        </span>
                    </div>

                    {/* CENTRO */}
                    <div className="flex flex-col items-center justify-center">
                        <span className="text-xl font-black leading-none text-white">
                            {finalizado ? `${partido.golesLocal} - ${partido.golesVisitante}` : "VS"}
                        </span>
                        {/* LÍNEA DINÁMICA PLATEADA */}
                        <div className={`w-8 h-1 mt-1 rounded-sm ${
                            finalizado
                                ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]"
                                : "bg-slate-500 shadow-[0_0_6px_rgba(148,163,184,0.5)]"
                        }`}></div>
                    </div>

                    {/* VISITANTE */}
                    <div className="flex flex-col items-center">
                        <div className="w-10 h-10 mb-1 shrink-0">
                            {partido.equipoVisitanteEscudo ? (
                                <img src={partido.equipoVisitanteEscudo} alt="V" className="w-full h-full object-contain" />
                            ) : <FaShieldAlt className="text-slate-700 w-full h-full" />}
                        </div>
                        <span className="text-[10px] font-black text-white uppercase text-center leading-tight w-full break-words">
                            {formatDato(partido.equipoVisitanteNombre)}
                        </span>
                    </div>
                </div>

                {/* INFO ABAJO MÓVIL */}
                <div className="mt-4 flex flex-col gap-2">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-1.5 bg-[#050814]/80 border border-blue-900/20 px-2 py-1.5 rounded-lg justify-center">
                            <FaCalendarAlt size={8} className="text-blue-500" />
                            <span className="text-[8px] font-black text-slate-300 uppercase">{formatDato(partido.fecha)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-[#050814]/80 border border-blue-900/20 px-2 py-1.5 rounded-lg justify-center">
                            <FaClock size={8} className="text-blue-500" />
                            <span className="text-[8px] font-black text-slate-300 uppercase">
                                {partido.hora ? `${partido.hora} HS` : "POR CONFIRMAR"}
                            </span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-1.5 bg-[#050814]/80 border border-blue-900/20 px-2 py-1.5 rounded-lg justify-center">
                            <FaMapMarkerAlt size={8} className="text-blue-500" />
                            <span className="text-[8px] font-black text-slate-300 uppercase truncate">{formatDato(partido.canchaNombre || partido.cancha)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-[#050814]/80 border border-blue-900/20 px-2 py-1.5 rounded-lg justify-center">
                            <FaUserTie size={8} className="text-blue-500" />
                            <span className="text-[8px] font-black text-slate-300 uppercase truncate">{formatDato(partido.arbitro)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- VISTA PC (hidden md:flex) --- */}
            <div className="hidden md:flex flex-col items-center w-full group">
                <div className={`w-full border-y py-4 px-6 lg:px-10 flex items-center justify-between relative shadow-xl ${
                    finalizado ? "bg-[#1c213b]/60 border-emerald-500/20" : "bg-slate-800/10 border-slate-700/20"
                }`}>

                    {/* LOCAL PC */}
                    <div className="flex items-center gap-4 flex-1 justify-start min-w-0">
                        <div className="w-12 h-12 lg:w-14 lg:h-14 shrink-0">
                            {partido.equipoLocalEscudo ? (
                                <img src={partido.equipoLocalEscudo} className="w-full h-full object-contain" />
                            ) : <FaShieldAlt className="text-slate-700 w-full h-full" />}
                        </div>
                        <span className="text-lg lg:text-xl font-black text-white uppercase tracking-tight truncate">
                            {formatDato(partido.equipoLocalNombre)}
                        </span>
                    </div>

                    {/* CENTRO PC */}
                    <div className="flex flex-col items-center px-4 lg:px-8 shrink-0 w-[180px]">
                        <div className="flex justify-center mb-2">
                            <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border flex items-center gap-1.5 ${
                                finalizado
                                    ? "text-emerald-500 border-emerald-500/30 bg-emerald-500/10"
                                    : "text-slate-400 border-slate-500/30 bg-slate-500/10"
                            }`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${
                                    finalizado ? "bg-emerald-500" : "bg-slate-400 animate-pulse shadow-[0_0_5px_rgba(148,163,184,0.8)]"
                                }`}></div>
                                {finalizado ? "Finalizado" : "Pendiente"}
                            </span>
                        </div>

                        <span className="text-3xl lg:text-4xl font-black tracking-tighter text-white">
                            {finalizado ? `${partido.golesLocal} - ${partido.golesVisitante}` : "VS"}
                        </span>

                        <div className={`w-12 h-1.5 mt-2 rounded-full ${
                            finalizado
                                ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                                : "bg-slate-500 shadow-[0_0_10px_rgba(148,163,184,0.5)]"
                        }`}></div>
                    </div>

                    {/* VISITANTE PC */}
                    <div className="flex items-center gap-4 flex-1 justify-end min-w-0">
                        <span className="text-lg lg:text-xl font-black text-white uppercase tracking-tight truncate text-right">
                            {formatDato(partido.equipoVisitanteNombre)}
                        </span>
                        <div className="w-12 h-12 lg:w-14 lg:h-14 shrink-0">
                            {partido.equipoVisitanteEscudo ? (
                                <img src={partido.equipoVisitanteEscudo} className="w-full h-full object-contain" />
                            ) : <FaShieldAlt className="text-slate-700 w-full h-full" />}
                        </div>
                    </div>
                </div>

                {/* INFO ABAJO PC */}
                <div className="flex items-center gap-4 mt-3">
                    {[
                        { icon: <FaMapMarkerAlt />, label: partido.canchaNombre || partido.cancha },
                        { icon: <FaCalendarAlt />, label: partido.fecha },
                        { icon: <FaClock />, label: partido.hora ? `${partido.hora} HS` : null },
                        { icon: <FaUserTie />, label: partido.arbitro }
                    ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-[#050814]/90 border border-slate-800 px-4 py-1.5 rounded-full shadow-lg">
                            <span className="text-blue-500 text-[11px]">{item.icon}</span>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-wide">
                                {formatDato(item.label)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}