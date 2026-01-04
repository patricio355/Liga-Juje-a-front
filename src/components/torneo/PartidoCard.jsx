import { FaShieldAlt, FaMapMarkerAlt, FaClock } from "react-icons/fa";

export default function PartidoCard({ partido }) {
    const finalizado = partido.estado === "FINALIZADO";

    return (
        <div
            className={`
                mx-auto max-w-lg
                rounded-[2rem] p-5
                border-2 transition-all duration-300
                ${finalizado
                ? "bg-[#1c213b] border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                : "bg-[#0f172a] border-slate-800 hover:border-emerald-500/30"}
            `}
        >
            {/* ESTADO SUPERIOR */}
            <div className="flex justify-center mb-5">
                <span className={`
                    text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border
                    ${finalizado
                    ? "bg-emerald-500 text-[#0f172a] border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                    : "bg-amber-500/10 text-amber-500 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.1)]"}
                `}>
                    {finalizado ? "✓ Finalizado" : "● Pendiente"}
                </span>
            </div>

            {/* ENFRENTAMIENTO CON ESCUDOS LATERALES */}
            <div className="flex items-center justify-between gap-3">

                {/* LOCAL: Escudo a la izquierda, Nombre a la derecha */}
                <div className="flex-1 flex items-center gap-3 min-w-0">
                    <div className="shrink-0 w-12 h-12 bg-[#0b1023] rounded-xl border border-slate-700 p-1.5 flex items-center justify-center shadow-inner">
                        {partido.equipoLocalEscudo ? (
                            <img
                                src={partido.equipoLocalEscudo}
                                alt="L"
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <FaShieldAlt className="text-slate-800 text-lg" />
                        )}
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-black text-white uppercase italic tracking-tighter leading-tight truncate">
                        {partido.equipoLocalNombre}
                    </span>
                </div>

                {/* MARCADOR CENTRAL */}
                <div className="shrink-0">
                    <div className={`
                        flex items-center justify-center rounded-xl px-3 py-2 border-2 min-w-[65px]
                        ${finalizado
                        ? "bg-[#0b1023] text-emerald-400 border-emerald-500/40"
                        : "bg-[#0b1023] text-slate-500 border-slate-800"}
                    `}>
                        <span className="text-lg font-black italic tracking-tighter">
                            {finalizado
                                ? `${partido.golesLocal}-${partido.golesVisitante}`
                                : "VS"
                            }
                        </span>
                    </div>
                </div>

                {/* VISITANTE: Nombre a la izquierda, Escudo a la derecha */}
                <div className="flex-1 flex items-center justify-end gap-3 min-w-0">
                    <span className="text-[10px] sm:text-[11px] font-black text-white uppercase italic tracking-tighter leading-tight truncate text-right">
                        {partido.equipoVisitanteNombre}
                    </span>
                    <div className="shrink-0 w-12 h-12 bg-[#0b1023] rounded-xl border border-slate-700 p-1.5 flex items-center justify-center shadow-inner">
                        {partido.equipoVisitanteEscudo ? (
                            <img
                                src={partido.equipoVisitanteEscudo}
                                alt="V"
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <FaShieldAlt className="text-slate-800 text-lg" />
                        )}
                    </div>
                </div>

            </div>

            {/* PIE TÉCNICO */}
            <div className="mt-5 pt-3 border-t border-slate-800/50 flex justify-between items-center text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-emerald-500/50" />
                    <span className="truncate max-w-[120px]">{partido.canchaNombre ?? "A definir"}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span>{partido.fecha ?? "A definir"}</span>
                    <FaClock className="text-emerald-500/50" />
                </div>
            </div>
        </div>
    );
}