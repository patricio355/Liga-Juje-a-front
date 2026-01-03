export default function TablaPosiciones({ posiciones }) {
    return (
        /* Eliminamos el padding lateral del contenedor para que la tabla toque los bordes del móvil */
        <div className="w-full overflow-hidden rounded-xl border border-gray-800 bg-[#12172d] shadow-2xl">
            <div className="overflow-x-auto scrollbar-hide">
                {/* min-w-[340px] asegura que quepa en cualquier pantalla sin scroll si es posible */}
                <table className="w-full min-w-[340px] text-left border-collapse table-fixed">
                    <thead>
                    <tr className="bg-[#1c213b] text-emerald-400 border-b border-gray-800">
                        {/* # reducido al mínimo */}
                        <th className="py-3 px-0.5 text-[10px] font-black uppercase text-center w-[22px]">#</th>
                        <th className="py-3 px-1 text-[10px] font-black uppercase text-left">Equipos</th>
                        {/* PTS con ancho fijo pequeño */}
                        <th className="py-3 px-0.5 text-[10px] font-black uppercase text-center w-[30px] bg-[#232a4d]/30">PTS</th>
                        {/* Estadísticas con ancho ultra-reducido de 22px */}
                        <th className="py-3 px-0.5 text-[10px] font-black uppercase text-center w-[22px]">J</th>
                        <th className="py-3 px-0.5 text-[10px] font-black uppercase text-center w-[22px]">G</th>
                        <th className="py-3 px-0.5 text-[10px] font-black uppercase text-center w-[22px]">E</th>
                        <th className="py-3 px-0.5 text-[10px] font-black uppercase text-center w-[22px]">P</th>
                        {/* Diferencia de gol con un poco más de aire */}
                        <th className="py-3 px-0.5 text-[10px] font-black uppercase text-center w-[32px]">+/-</th>
                    </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-800/50">
                    {posiciones.map((p, index) => {
                        const esPrimero = index === 0;
                        const diferenciaGoles = (p.golesAFavor || 0) - (p.golesEnContra || 0);

                        return (
                            <tr
                                key={p.id || index}
                                className="hover:bg-emerald-500/5 transition-colors border-b border-gray-800/30"
                            >
                                {/* POSICIÓN: Sin paddings innecesarios */}
                                <td className="py-3 px-0 text-center">
                                        <span className={`text-[10px] font-black ${esPrimero ? 'text-emerald-400' : 'text-gray-500'}`}>
                                            {index + 1}
                                        </span>
                                </td>

                                {/* EQUIPO: Usamos flex-1 para que ocupe el resto del ancho disponible */}
                                <td className="py-3 px-1">
                                    <div className="flex items-center gap-1">
                                        <div className={`shrink-0 w-1 h-1 rounded-full ${esPrimero ? 'bg-emerald-500' : 'bg-gray-600'}`}></div>
                                        <span className="text-[10px] font-bold text-gray-200 uppercase tracking-tighter truncate italic leading-tight">
                                                {p.nombreEquipo}
                                            </span>
                                    </div>
                                </td>

                                {/* PUNTOS resaltados */}
                                <td className="py-3 px-0 text-center bg-[#1c213b]/40">
                                        <span className="text-[11px] font-black text-emerald-400">
                                            {p.puntos}
                                        </span>
                                </td>

                                {/* ESTADÍSTICAS: Fuente pequeña y sin padding lateral */}
                                <td className="py-3 px-0 text-center text-[9px] font-bold text-gray-400">{p.partidosJugados}</td>
                                <td className="py-3 px-0 text-center text-[9px] font-bold text-gray-400">{p.ganados}</td>
                                <td className="py-3 px-0 text-center text-[9px] font-bold text-gray-400">{p.empatados}</td>
                                <td className="py-3 px-0 text-center text-[9px] font-bold text-gray-400">{p.perdidos}</td>

                                {/* DIFERENCIA DE GOLES */}
                                <td className="py-3 px-0 text-center">
                                        <span className={`text-[9px] font-black ${diferenciaGoles > 0 ? 'text-emerald-500' : diferenciaGoles < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                                            {diferenciaGoles}
                                        </span>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

            {/* Footer compacto */}
            <div className="bg-[#0b1023] py-2 px-4 border-t border-gray-800">
                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-600 text-center">
                    POSICIONES OFICIALES • 2025
                </p>
            </div>
        </div>
    );
}