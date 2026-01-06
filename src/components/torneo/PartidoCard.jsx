import { FaShieldAlt, FaMapMarkerAlt, FaClock, FaCalendarAlt } from "react-icons/fa";

export default function PartidoCard({ partido }) {
    const finalizado = partido.estado === "FINALIZADO";

    return (
        <div
            className={`
                mx-auto max-w-lg
                rounded-2xl px-5 py-3
                border transition-all duration-300
                ${finalizado
                ? "bg-[#1c213b] border-emerald-500/20 shadow-lg"
                : "bg-[#1e293b] border-slate-700/50 shadow-md"}
            `}
        >
            {/* ENFRENTAMIENTO (Escudo arriba para alinear) */}
            <div className="grid grid-cols-3 items-center gap-2">

                {/* LOCAL */}
                <div className="flex flex-col items-center">
                    <div className="w-10 h-10 mb-1">
                        {partido.equipoLocalEscudo || partido.localEscudo ? (
                            <img
                                src={partido.equipoLocalEscudo || partido.localEscudo}
                                alt="L"
                                className="w-full h-full object-contain drop-shadow-md"
                            />
                        ) : (
                            <FaShieldAlt className="text-slate-700 w-full h-full" />
                        )}
                    </div>
                    <span className="text-[10px] font-black text-white uppercase text-center leading-tight truncate w-full">
                        {partido.equipoLocalNombre || partido.local}
                    </span>
                </div>

                {/* MARCADOR / VS - Compacto */}
                <div className="flex flex-col items-center">
                    <span className={`
                        text-xl md:text-2xl font-black italic tracking-tighter
                        ${finalizado ? "text-emerald-400" : "text-slate-600"}
                    `}>
                        {finalizado
                            ? `${partido.golesLocal} - ${partido.golesVisitante}`
                            : "VS"
                        }
                    </span>
                    <span className={`text-[7px] font-black uppercase tracking-widest mt-0.5 ${finalizado ? "text-emerald-500/50" : "text-slate-500"}`}>
                        {finalizado ? "FINALIZADO" : "PENDIENTE"}
                    </span>
                </div>

                {/* VISITANTE */}
                <div className="flex flex-col items-center">
                    <div className="w-10 h-10 mb-1">
                        {partido.equipoVisitanteEscudo || partido.visitanteEscudo ? (
                            <img
                                src={partido.equipoVisitanteEscudo || partido.visitanteEscudo}
                                alt="V"
                                className="w-full h-full object-contain drop-shadow-md"
                            />
                        ) : (
                            <FaShieldAlt className="text-slate-700 w-full h-full" />
                        )}
                    </div>
                    <span className="text-[10px] font-black text-white uppercase text-center leading-tight truncate w-full">
                        {partido.equipoVisitanteNombre || partido.visitante}
                    </span>
                </div>

            </div>

            {/* INFO LOGÍSTICA - Ajustada a los nombres del Admin */}
            <div className="mt-3 pt-2 border-t border-slate-700/30 flex justify-between items-center">
                <div className="flex items-center gap-1.5 overflow-hidden">
                    <FaMapMarkerAlt size={8} className="text-blue-500/60 shrink-0" />
                    <span className="text-[8px] font-bold text-slate-400 uppercase truncate">
                        {partido.cancha || partido.canchaNombre || "A DEFINIR"}
                    </span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-1">
                        <FaCalendarAlt size={8} className="text-slate-500" />
                        <span className="text-[8px] font-black text-slate-400">
                            {partido.fecha || "PENDIENTE"}
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <FaClock size={8} className="text-slate-500" />
                        <span className="text-[8px] font-black text-slate-400">
                            {partido.hora ? `${partido.hora} HS` : "S/H"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}