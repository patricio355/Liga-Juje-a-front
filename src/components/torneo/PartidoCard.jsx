import { FaShieldAlt, FaMapMarkerAlt, FaClock } from "react-icons/fa";

export default function PartidoCard({ partido }) {
    const finalizado = partido.estado === "FINALIZADO";

    return (
        <div
            className={`
                mx-auto max-w-lg
                rounded-3xl p-5
                border transition-all duration-300
                ${finalizado
                ? "bg-[#1c213b] border-emerald-500/30 shadow-lg"
                : "bg-[#0f172a] border-slate-800"}
            `}
        >
            {/* ESTADO SUPERIOR */}
            <div className="flex justify-center mb-4">
                <span className={`
                    text-[9px] font-black uppercase tracking-widest px-3 py-0.5 rounded-full
                    ${finalizado
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-slate-800 text-slate-500 border border-slate-700"}
                `}>
                    {finalizado ? "Finalizado" : "Pendiente"}
                </span>
            </div>

            {/* ENFRENTAMIENTO EN UNA SOLA LÍNEA */}
            <div className="flex items-center justify-between">

                {/* LOCAL */}
                <div className="flex-1 flex flex-col items-center gap-1.5">
                    <div className="w-12 h-12 flex items-center justify-center">
                        {partido.equipoLocalEscudo ? (
                            <img
                                src={partido.equipoLocalEscudo}
                                alt="L"
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <FaShieldAlt className="text-slate-700 text-xl" />
                        )}
                    </div>
                    <span className="text-[10px] font-bold text-white uppercase text-center leading-tight truncate w-full">
                        {partido.equipoLocalNombre}
                    </span>
                </div>

                {/* MARCADOR SIMPLE (Sin círculo, sin fondo pesado) */}
                <div className="px-4">
                    <span className={`
                        text-2xl font-black italic tracking-tighter
                        ${finalizado ? "text-emerald-400" : "text-slate-600"}
                    `}>
                        {finalizado
                            ? `${partido.golesLocal} - ${partido.golesVisitante}`
                            : "VS"
                        }
                    </span>
                </div>

                {/* VISITANTE */}
                <div className="flex-1 flex flex-col items-center gap-1.5">
                    <div className="w-12 h-12 flex items-center justify-center">
                        {partido.equipoVisitanteEscudo ? (
                            <img
                                src={partido.equipoVisitanteEscudo}
                                alt="V"
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <FaShieldAlt className="text-slate-700 text-xl" />
                        )}
                    </div>
                    <span className="text-[10px] font-bold text-white uppercase text-center leading-tight truncate w-full">
                        {partido.equipoVisitanteNombre}
                    </span>
                </div>

            </div>

            {/* PIE TÉCNICO MÁS PEQUEÑO */}
            <div className="mt-5 pt-3 border-t border-slate-800/50 flex justify-between items-center text-[8px] font-bold text-slate-500 uppercase">
                <div className="flex items-center gap-1.5">
                    <FaMapMarkerAlt className="text-emerald-500/40" />
                    <span>{partido.canchaNombre ?? "A DEFINIR"}</span>
                </div>
                <div className="flex items-center gap-3">
                    <span>{partido.fecha ?? "TBD"}</span>
                    <span>{partido.hora ?? "S/H"}</span>
                </div>
            </div>
        </div>
    );
}