export default function TablaPosiciones({ posiciones }) {
    return (
        /* Eliminamos márgenes laterales externos para ganar espacio en el celular */
        <div className="w-full overflow-hidden rounded-xl border border-gray-800 bg-[#12172d] shadow-2xl">
            <div className="overflow-x-auto">
                {/* min-w-[320px] es el estándar para celulares pequeños (iPhone SE) */}
                <table className="w-full min-w-[320px] text-left border-collapse table-fixed">
                    <thead>
                    <tr className="bg-[#1c213b] text-emerald-400 border-b border-gray-800">
                        {/* Columna # reducida al mínimo extremo */}
                        <th className="py-2 px-0.5 text-[10px] font-black uppercase text-center w-[25px]">#</th>
                        <th className="py-2 px-1 text-[10px] font-black uppercase text-left">Equipos</th>
                        <th className="py-2 px-0.5 text-[10px] font-black uppercase text-center w-[32px] bg-[#232a4d]/30">PTS</th>
                        <th className="py-2 px-0.5 text-[10px] font-black uppercase text-center w-[25px]">J</th>
                        <th className="py-2 px-0.5 text-[10px] font-black uppercase text-center w-[25px]">G</th>
                        <th className="py-2 px-0.5 text-[10px] font-black uppercase text-center w-[25px]">E</th>
                        <th className="py-2 px-0.5 text-[10px] font-black uppercase text-center w-[25px]">P</th>
                        <th className="py-2 px-0.5 text-[10px] font-black uppercase text-center w-[35px]">+/-</th>
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
                                {/* POSICIÓN compacta sin margen lateral */}
                                <td className="py-2 px-0.5 text-center">
                                        <span className={`text-[10px] font-black ${esPrimero ? 'text-emerald-400' : 'text-gray-500'}`}>
                                            {index + 1}
                                        </span>
                                </td>

                                {/* EQUIPO con espacio optimizado */}
                                <td className="py-2 px-1">
                                    <div className="flex items-center gap-1.5">
                                        <div className={`shrink-0 w-1.5 h-1.5 rounded-full ${esPrimero ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]' : 'bg-gray-600'}`}></div>
                                        <span className="text-[10px] font-bold text-gray-200 uppercase tracking-tighter truncate italic leading-tight">
                                                {p.nombreEquipo}
                                            </span>
                                    </div>
                                </td>

                                {/* PUNTOS resaltados */}
                                <td className="py-2 px-0.5 text-center bg-[#1c213b]/40">
                                        <span className="text-xs font-black text-emerald-400">
                                            {p.puntos}
                                        </span>
                                </td>

                                {/* ESTADÍSTICAS ultra compactas */}
                                <td className="py-2 px-0.5 text-center text-[9px] font-bold text-gray-400">{p.partidosJugados}</td>
                                <td className="py-2 px-0.5 text-center text-[9px] font-bold text-gray-400">{p.ganados}</td>
                                <td className="py-2 px-0.5 text-center text-[9px] font-bold text-gray-400">{p.empatados}</td>
                                <td className="py-2 px-0.5 text-center text-[9px] font-bold text-gray-400">{p.perdidos}</td>

                                {/* DIFERENCIA DE GOLES */}
                                <td className="py-2 px-0.5 text-center">
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

            <div className="bg-[#0b1023] py-2 px-4 border-t border-gray-800">
                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-600 text-center">
                    Panel Oficial de Posiciones • 2025
                </p>
            </div>
        </div>
    );
}