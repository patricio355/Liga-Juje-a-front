import { FaShieldAlt } from "react-icons/fa";

export default function TablaPosiciones({ posiciones }) {
    return (
        <div className="w-full overflow-hidden rounded-xl border border-gray-800 bg-[#12172d] shadow-2xl">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse table-auto">
                    <thead>
                    <tr className="bg-[#1c213b] text-emerald-400 border-b border-gray-800">
                        <th className="py-3 px-2 text-[10px] font-black text-center w-[30px] shrink-0">#</th>
                        <th className="py-3 px-3 text-[10px] font-black text-left min-w-[140px]">EQUIPOS</th>
                        <th className="py-3 px-2 text-[10px] font-black text-center w-[40px] bg-[#232a4d]/30 shrink-0">PTS</th>
                        <th className="py-3 px-1 text-[10px] font-black text-center w-[30px] shrink-0">J</th>
                        <th className="py-3 px-1 text-[10px] font-black text-center w-[30px] shrink-0">G</th>
                        <th className="py-3 px-1 text-[10px] font-black text-center w-[30px] shrink-0">E</th>
                        <th className="py-3 px-1 text-[10px] font-black text-center w-[30px] shrink-0">P</th>
                        <th className="py-3 px-2 text-[10px] font-black text-center w-[45px] shrink-0">+/-</th>
                    </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-800/50">
                    {posiciones.map((p, index) => {
                        const diferenciaGoles = (p.golesAFavor || 0) - (p.golesEnContra || 0);

                        return (
                            <tr key={p.id || index} className="hover:bg-emerald-500/5 border-b border-gray-800/30">
                                <td className="py-3 px-2 text-center font-black text-[10px] text-gray-500">
                                    {index + 1}
                                </td>

                                <td className="py-3 px-3">
                                    <div className="flex items-center gap-3">
                                        {/* CONTENEDOR DE ESCUDO UNIFICADO */}
                                        <div className="shrink-0 w-7 h-7 flex items-center justify-center">
                                            {p.escudo || p.urlEscudo ? (
                                                <img
                                                    src={p.escudo || p.urlEscudo}
                                                    alt={`Escudo de ${p.nombreEquipo}`}
                                                    className="w-full h-full object-contain filter drop-shadow-md"
                                                />
                                            ) : (
                                                /* ESCUDO GENÉRICO - Tamaño aumentado para igualar a las imágenes */
                                                <FaShieldAlt className="text-gray-700 text-lg sm:text-xl opacity-40" />
                                            )}
                                        </div>

                                        <span className="text-[11px] font-bold text-gray-200 uppercase tracking-tighter italic whitespace-nowrap">
                                            {p.nombreEquipo}
                                        </span>
                                    </div>
                                </td>

                                <td className="py-3 px-2 text-center bg-[#1c213b]/40 font-black text-emerald-400 text-xs">
                                    {p.puntos}
                                </td>

                                <td className="py-3 px-1 text-center text-[10px] font-bold text-gray-400">{p.partidosJugados}</td>
                                <td className="py-3 px-1 text-center text-[10px] font-bold text-gray-400">{p.ganados}</td>
                                <td className="py-3 px-1 text-center text-[10px] font-bold text-gray-400">{p.empatados}</td>
                                <td className="py-3 px-1 text-center text-[10px] font-bold text-gray-400">{p.perdidos}</td>

                                <td className="py-3 px-2 text-center">
                                    <span className={`text-[10px] font-black ${diferenciaGoles > 0 ? 'text-emerald-500' : diferenciaGoles < 0 ? 'text-red-500' : 'text-gray-600'}`}>
                                        {diferenciaGoles > 0 ? `+${diferenciaGoles}` : diferenciaGoles}
                                    </span>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

            <div className="bg-[#0b1023] py-2 px-4 border-t border-gray-800 text-center">
                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-600">
                    POSICIONES OFICIALES • 2026
                </p>
            </div>
        </div>
    );
}