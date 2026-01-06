import { FaShieldAlt } from "react-icons/fa";

export default function TablaPosiciones({ posiciones }) {
    return (
        /* Eliminamos márgenes internos del contenedor padre para aprovechar todo el cuadro */
        <div className="w-full overflow-hidden rounded-2xl border border-blue-900/40 bg-[#0e1630]/50 backdrop-blur-md shadow-2xl">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse table-auto">
                    <thead>
                    <tr className="bg-[#050814]/90 text-blue-400 border-b border-blue-900/50">
                        {/* Letras crecen en md: (PC) */}
                        <th className="py-4 px-2 text-[10px] md:text-sm font-black text-center w-[30px] md:w-[50px] shrink-0">#</th>
                        <th className="py-4 px-3 text-[10px] md:text-sm font-black text-left min-w-[140px] md:min-w-[300px]">EQUIPOS</th>
                        <th className="py-4 px-2 text-[10px] md:text-sm font-black text-center w-[40px] md:w-[80px] bg-blue-900/20 shrink-0">PTS</th>
                        <th className="py-4 px-1 text-[10px] md:text-sm font-black text-center w-[30px] md:w-[60px] shrink-0">J</th>
                        <th className="py-4 px-1 text-[10px] md:text-sm font-black text-center w-[30px] md:w-[60px] shrink-0">G</th>
                        <th className="py-4 px-1 text-[10px] md:text-sm font-black text-center w-[30px] md:w-[60px] shrink-0">E</th>
                        <th className="py-4 px-1 text-[10px] md:text-sm font-black text-center w-[30px] md:w-[60px] shrink-0">P</th>
                        <th className="py-4 px-2 text-[10px] md:text-sm font-black text-center w-[45px] md:w-[80px] shrink-0">+/-</th>
                    </tr>
                    </thead>

                    <tbody className="divide-y divide-blue-900/30">
                    {posiciones.map((p, index) => {
                        const diferenciaGoles = (p.golesAFavor || 0) - (p.golesEnContra || 0);

                        return (
                            <tr key={p.id || index} className="hover:bg-blue-500/5 transition-colors border-b border-blue-900/20">
                                <td className="py-4 px-2 text-center font-black text-[10px] md:text-base text-slate-500">
                                    {index + 1}
                                </td>

                                <td className="py-4 px-3">
                                    <div className="flex items-center gap-3 md:gap-5">
                                        <div className="shrink-0 w-7 h-7 md:w-10 md:h-10 flex items-center justify-center">
                                            {p.escudo || p.urlEscudo ? (
                                                <img
                                                    src={p.escudo || p.urlEscudo}
                                                    alt={`Escudo de ${p.nombreEquipo}`}
                                                    className="w-full h-full object-contain filter drop-shadow-2xl"
                                                />
                                            ) : (
                                                <FaShieldAlt className="text-blue-900 text-lg md:text-3xl opacity-40" />
                                            )}
                                        </div>

                                        {/* AJUSTADO: Se quitó 'font-black' e 'italic' por 'font-bold' normal */}
                                        <span className="text-[11px] md:text-lg font-bold text-slate-100 uppercase tracking-tighter whitespace-nowrap">
                                            {p.nombreEquipo}
                                        </span>
                                    </div>
                                </td>

                                {/* AJUSTADO: Puntos en blanco (text-white) */}
                                <td className="py-4 px-2 text-center bg-blue-900/10 font-black text-white text-xs md:text-xl">
                                    {p.puntos}
                                </td>

                                <td className="py-4 px-1 text-center text-[10px] md:text-base font-bold text-slate-400">{p.partidosJugados}</td>
                                <td className="py-4 px-1 text-center text-[10px] md:text-base font-bold text-slate-400">{p.ganados}</td>
                                <td className="py-4 px-1 text-center text-[10px] md:text-base font-bold text-slate-400">{p.empatados}</td>
                                <td className="py-4 px-1 text-center text-[10px] md:text-base font-bold text-slate-400">{p.perdidos}</td>

                                <td className="py-4 px-2 text-center">
                                    <span className={`text-[10px] md:text-base font-black ${diferenciaGoles > 0 ? 'text-blue-400' : diferenciaGoles < 0 ? 'text-red-500' : 'text-slate-600'}`}>
                                        {diferenciaGoles > 0 ? `+${diferenciaGoles}` : diferenciaGoles}
                                    </span>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

            <div className="bg-[#050814] py-3 px-4 border-t border-blue-900/40 text-center">
                <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-blue-900/60">
                    POSICIONES OFICIALES • TEMPORADA 2026
                </p>
            </div>
        </div>
    );
}