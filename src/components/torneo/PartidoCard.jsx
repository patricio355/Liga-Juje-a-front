export default function PartidoCard({ partido }) {
    const finalizado = partido.estado === "FINALIZADO";

    return (
        <div
            className={`
                mx-auto max-w-lg
                rounded-xl px-4 py-3
                border-2 transition-all duration-300
                ${finalizado
                ? "bg-emerald-50 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                : "bg-white border-gray-300 hover:border-emerald-500"}
            `}
        >
            {/* ESTADO COMPACTO */}
            <div className="flex justify-center mb-2">
                <span className={`
                    text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-md border
                    ${finalizado
                    ? "bg-emerald-600 text-white border-emerald-700"
                    : "bg-gray-100 text-gray-500 border-gray-200"}
                `}>
                    {finalizado ? "✓ Finalizado" : "● Pendiente"}
                </span>
            </div>

            {/* MARCADOR AJUSTADO PARA MÓVIL */}
            <div className="flex items-center justify-between gap-1">

                {/* LOCAL */}
                <div className="flex-1 text-right">
                    <span className="text-[11px] sm:text-sm font-black text-gray-900 uppercase italic tracking-tighter leading-tight block truncate">
                        {partido.equipoLocalNombre}
                    </span>
                </div>

                {/* RESULTADO COMPACTO */}
                <div className="px-2">
                    <div className={`
                        flex items-center justify-center rounded-lg px-2 py-1 border-2 min-w-[50px]
                        ${finalizado
                        ? "bg-gray-900 text-emerald-400 border-gray-800"
                        : "bg-gray-100 text-gray-400 border-gray-200"}
                    `}>
                        <span className="text-sm font-black italic">
                            {finalizado
                                ? `${partido.golesLocal}-${partido.golesVisitante}`
                                : "VS"
                            }
                        </span>
                    </div>
                </div>

                {/* VISITANTE */}
                <div className="flex-1 text-left">
                    <span className="text-[11px] sm:text-sm font-black text-gray-900 uppercase italic tracking-tighter leading-tight block truncate">
                        {partido.equipoVisitanteNombre}
                    </span>
                </div>
            </div>

            {/* INFO SIMPLIFICADA */}
            <div className="mt-3 pt-2 border-t border-gray-200/60 flex justify-between items-center px-1">
                <div className="flex flex-col">
                    <span className="text-[7px] font-black text-emerald-700 uppercase italic">Estadio</span>
                    <span className="text-[9px] font-bold text-gray-600 truncate max-w-[100px] uppercase">
                        {partido.canchaNombre ?? "A DEFINIR"}
                    </span>
                </div>
                <div className="flex flex-col text-right">
                    <span className="text-[7px] font-black text-emerald-700 uppercase italic">Fecha</span>
                    <span className="text-[9px] font-bold text-gray-700">
                        {partido.fecha ?? "A DEFINIR"}
                    </span>
                </div>
            </div>
        </div>
    );
}