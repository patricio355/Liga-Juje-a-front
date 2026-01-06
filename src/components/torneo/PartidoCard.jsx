import { FaShieldAlt, FaMapMarkerAlt, FaClock, FaCalendarAlt } from "react-icons/fa";

export default function PartidoCard({ partido }) {
    const finalizado = partido.estado === "FINALIZADO";

    return (
        <div className="w-full transition-all duration-300">

            {/* --- VISTA CELULAR (md:hidden) --- */}
            <div className={`md:hidden rounded-2xl px-3 py-4 border ${finalizado ? "bg-[#1c213b] border-emerald-500/20" : "bg-[#0e1630] border-blue-900/40"}`}>

                {/* GRID SUPERIOR */}
                <div className="grid grid-cols-3 items-center gap-1">

                    {/* LOCAL */}
                    <div className="flex flex-col items-center">
                        <div className="w-10 h-10 mb-1 shrink-0">
                            {partido.equipoLocalEscudo ? (
                                <img src={partido.equipoLocalEscudo} alt="L" className="w-full h-full object-contain" />
                            ) : (
                                <FaShieldAlt className="text-blue-900/40 w-full h-full" />
                            )}
                        </div>
                        <span className="text-[10px] font-black text-white uppercase text-center leading-tight w-full italic break-words">
                            {partido.equipoLocalNombre}
                        </span>
                    </div>

                    {/* CENTRO: Marcador (Blanco) + Línea Dinámica (Amarilla/Verde) */}
                    <div className="flex flex-col items-center justify-start pt-1">
                        {!finalizado && (
                            <span className="text-[8px] font-bold text-blue-400 uppercase mb-0.5">VS</span>
                        )}
                        {/* CORRECCIÓN: El resultado siempre es blanco */}
                        <span className="text-xl font-black italic leading-none text-white">
                            {finalizado ? `${partido.golesLocal} - ${partido.golesVisitante}` : " "}
                        </span>

                        {/* LÍNEA DE ESTADO: Esta sí cambia de color */}
                        <div className={`w-8 h-1 mt-1 rounded-sm shadow-lg ${
                            finalizado
                                ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]"
                                : "bg-yellow-500 shadow-[0_0_6px_rgba(234,179,8,0.6)]"
                        }`}></div>
                    </div>

                    {/* VISITANTE */}
                    <div className="flex flex-col items-center">
                        <div className="w-10 h-10 mb-1 shrink-0">
                            {partido.equipoVisitanteEscudo ? (
                                <img src={partido.equipoVisitanteEscudo} alt="V" className="w-full h-full object-contain" />
                            ) : (
                                <FaShieldAlt className="text-blue-900/40 w-full h-full" />
                            )}
                        </div>
                        <span className="text-[10px] font-black text-white uppercase text-center leading-tight w-full italic break-words">
                            {partido.equipoVisitanteNombre}
                        </span>
                    </div>
                </div>

                {/* INFO ABAJO MÓVIL */}
                <div className="mt-3 flex flex-wrap justify-center items-center gap-2">
                    <div className="flex items-center gap-1.5 bg-[#050814]/80 border border-blue-900/30 px-2 py-1 rounded-md shadow-sm">
                        <FaMapMarkerAlt size={8} className="text-blue-500" />
                        <span className="text-[8px] font-black text-slate-300 uppercase italic truncate max-w-[80px]">
                            {partido.canchaNombre || "A DEFINIR"}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 bg-[#050814]/80 border border-blue-900/30 px-2 py-1 rounded-md shadow-sm">
                        <div className="flex items-center gap-1">
                            <FaCalendarAlt size={8} className="text-blue-500" />
                            <span className="text-[8px] font-black text-slate-300 italic">
                                {partido.fecha || "TBD"}
                            </span>
                        </div>
                        <div className="w-[1px] h-2 bg-blue-900/50"></div>
                        <div className="flex items-center gap-1">
                            <FaClock size={8} className="text-blue-500" />
                            <span className="text-[8px] font-black text-slate-300 italic">
                                {partido.hora ? `${partido.hora} HS` : "S/H"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- VISTA PC (hidden md:flex) --- */}
            <div className="hidden md:flex flex-col items-center w-full group">
                <div className={`w-full hover:bg-blue-600/20 transition-colors border-y py-4 px-6 lg:px-10 flex items-center justify-between relative shadow-xl ${
                    finalizado ? "bg-[#1c213b]/60 border-emerald-500/20" : "bg-blue-600/10 border-blue-500/10"
                }`}>

                    {/* LOCAL PC */}
                    <div className="flex items-center gap-4 flex-1 justify-start min-w-0">
                        <div className="w-12 h-12 lg:w-14 lg:h-14 shrink-0 drop-shadow-md">
                            {partido.equipoLocalEscudo ? (
                                <img src={partido.equipoLocalEscudo} className="w-full h-full object-contain" />
                            ) : (
                                <FaShieldAlt className="text-blue-900/40 w-full h-full" />
                            )}
                        </div>
                        <span className="text-lg lg:text-xl font-bold text-white uppercase tracking-tight truncate drop-shadow-sm">
                            {partido.equipoLocalNombre}
                        </span>
                    </div>

                    {/* CENTRO PC */}
                    <div className="flex flex-col items-center px-4 lg:px-8 shrink-0 w-[140px] lg:w-[160px]">
                        {!finalizado && <span className="text-xs font-bold text-blue-400 uppercase mb-1">VS</span>}

                        {/* CORRECCIÓN: El resultado siempre es blanco con su sombra blanca */}
                        <span className="text-3xl lg:text-4xl font-black italic tracking-tighter text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
                            {finalizado ? `${partido.golesLocal} - ${partido.golesVisitante}` : " "}
                        </span>

                        {/* LÍNEA DE ESTADO (PC): Esta sí cambia de color */}
                        <div className={`w-12 h-1.5 mt-2 rounded-sm shadow-lg ${
                            finalizado
                                ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                                : "bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.6)]"
                        }`}></div>
                    </div>

                    {/* VISITANTE PC */}
                    <div className="flex items-center gap-4 flex-1 justify-end min-w-0">
                        <span className="text-lg lg:text-xl font-bold text-white uppercase tracking-tight truncate text-right drop-shadow-sm">
                            {partido.equipoVisitanteNombre}
                        </span>
                        <div className="w-12 h-12 lg:w-14 lg:h-14 shrink-0 drop-shadow-md">
                            {partido.equipoVisitanteEscudo ? (
                                <img src={partido.equipoVisitanteEscudo} className="w-full h-full object-contain" />
                            ) : (
                                <FaShieldAlt className="text-blue-900/40 w-full h-full" />
                            )}
                        </div>
                    </div>
                </div>

                {/* INFO ABAJO PC */}
                <div className="flex items-center gap-3 mt-2 opacity-80 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-2 bg-[#050814]/90 border border-blue-900/40 px-3 py-1 rounded-md shadow-lg">
                        <FaMapMarkerAlt size={10} className="text-blue-500" />
                        <span className="text-[9px] lg:text-[10px] font-black text-slate-300 uppercase italic tracking-wide">
                            {partido.canchaNombre || "A DEFINIR"}
                        </span>
                    </div>
                    <div className="flex items-center gap-3 bg-[#050814]/90 border border-blue-900/40 px-3 py-1 rounded-md text-[9px] lg:text-[10px] font-black text-slate-300 italic shadow-lg">
                        <div className="flex items-center gap-1.5">
                            <FaCalendarAlt size={10} className="text-blue-500" />
                            <span>{partido.fecha || "TBD"}</span>
                        </div>
                        <div className="w-[1px] h-3 bg-blue-900/50"></div>
                        <div className="flex items-center gap-1.5">
                            <FaClock size={10} className="text-blue-500" />
                            <span>{partido.hora ? `${partido.hora} HS` : "S/H"}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}