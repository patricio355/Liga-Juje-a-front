export default function TablaPosiciones({ posiciones }) {
    return (
        <div className="w-full overflow-hidden rounded-xl border border-gray-800 bg-[#12172d] shadow-2xl">
            {/* Contenedor con scroll horizontal para móviles */}
            <div className="overflow-x-auto">
                <table className="w-full min-w-[380px] text-left border-collapse table-fixed">
                    <thead>
                    <tr className="bg-[#1c213b] text-emerald-400 border-b border-gray-800">
                        <th className="py-3 px-1 text-[10px] font-black uppercase tracking-tighter text-center w-[35px]">#</th>
                        <th className="py-3 px-2 text-[10px] font-black uppercase tracking-tighter text-left">Equipos</th>
                        <th className="py-3 px-1 text-[10px] font-black uppercase tracking-tighter text-center w-[40px] bg-[#232a4d]/30">PTS</th>
                        <th className="py-3 px-1 text-[10px] font-black uppercase tracking-tighter text-center w-[30px]">J</th>
                        <th className="py-3 px-1 text-[10px] font-black uppercase tracking-tighter text-center w-[30px]">G</th>
                        <th className="py-3 px-1 text-[10px] font-black uppercase tracking-tighter text-center w-[30px]">E</th>
                        <th className="py-3 px-1 text-[10px] font-black uppercase tracking-tighter text-center w-[30px]">P</th>
                        <th className="py-3 px-1 text-[10px] font-black uppercase tracking-tighter text-center w-[40px]">+/-</th>
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
                                {/* POSICIÓN */}
                                <td className="py-3 px-1 text-center">
                                        <span className={`text-[11px] font-black ${esPrimero ? 'text-emerald-400' : 'text-gray-500'}`}>
                                            {index + 1}
                                        </span>
                                </td>

                                {/* EQUIPO */}
                                <td className="py-3 px-2">
                                    <div className="flex items-center gap-2">
                                        {/* Círculo de color o logo del equipo */}
                                        <div className={`w-2 h-2 rounded-full ${esPrimero ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-gray-600'}`}></div>
                                        <span className="text-[11px] font-bold text-gray-200 uppercase tracking-tight truncate max-w-[110px] italic">
                                                {p.nombreEquipo}
                                            </span>
                                    </div>
                                </td>

                                {/* PUNTOS (Resaltado central) */}
                                <td className="py-3 px-1 text-center bg-[#1c213b]/40">
                                        <span className="text-sm font-black text-emerald-400">
                                            {p.puntos}
                                        </span>
                                </td>

                                {/* ESTADÍSTICAS */}
                                <td className="py-3 px-1 text-center text-[10px] font-bold text-gray-400">{p.partidosJugados}</td>
                                <td className="py-3 px-1 text-center text-[10px] font-bold text-gray-400">{p.ganados}</td>
                                <td className="py-3 px-1 text-center text-[10px] font-bold text-gray-400">{p.empatados}</td>
                                <td className="py-3 px-1 text-center text-[10px] font-bold text-gray-400">{p.perdidos}</td>

                                {/* DIFERENCIA DE GOLES */}
                                <td className="py-3 px-1 text-center">
                                        <span className={`text-[10px] font-black ${diferenciaGoles > 0 ? 'text-emerald-500' : diferenciaGoles < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                                            {diferenciaGoles > 0 ? `+${diferenciaGoles}` : diferenciaGoles}
                                        </span>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

            {/* Footer estilo Liga Bulón */}
            <div className="bg-[#0b1023] py-2 px-4 border-t border-gray-800">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600 text-center">
                    Panel Oficial de Posiciones • Temporada 2025
                </p>
            </div>
        </div>
    );
}