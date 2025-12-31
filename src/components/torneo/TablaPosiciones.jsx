export default function TablaPosiciones({ posiciones }) {
    return (
        <div className="w-full overflow-hidden rounded-2xl border-2 border-gray-300 bg-white shadow-md">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[500px] text-left border-collapse">
                    <thead>
                    <tr className="bg-gray-100 border-b-2 border-gray-300">
                        {/* Celda de cabecera de posición más angosta */}
                        <th className="py-4 px-1 text-[11px] font-black uppercase tracking-widest text-gray-600 text-center w-10">Pos</th>
                        <th className="py-4 px-3 text-[11px] font-black uppercase tracking-widest text-gray-700">Equipo</th>
                        <th className="py-4 px-1 text-[11px] font-black uppercase tracking-widest text-emerald-700 text-center">Pts</th>
                        <th className="py-4 px-1 text-[11px] font-black uppercase tracking-widest text-gray-600 text-center">PJ</th>
                        <th className="py-4 px-1 text-[11px] font-black uppercase tracking-widest text-gray-600 text-center">PG</th>
                        <th className="py-4 px-1 text-[11px] font-black uppercase tracking-widest text-gray-600 text-center">PE</th>
                        <th className="py-4 px-1 text-[11px] font-black uppercase tracking-widest text-gray-600 text-center">PP</th>
                        <th className="py-4 px-1 text-[11px] font-black uppercase tracking-widest text-gray-600 text-center">DG</th>
                    </tr>
                    </thead>

                    <tbody className="divide-y-2 divide-gray-200">
                    {posiciones.map((p, index) => {
                        const esPrimero = index === 0;
                        const diferenciaGoles = (p.golesAFavor || 0) - (p.golesEnContra || 0);

                        return (
                            <tr
                                key={p.id || index}
                                className="group hover:bg-emerald-50 transition-colors duration-150"
                            >
                                {/* POSICIÓN: Reducido el tamaño del cuadro y el padding de la celda */}
                                <td className="py-4 px-1 text-center">
                                    <span className={`
                                        inline-flex items-center justify-center w-6 h-6 rounded font-black text-[11px]
                                        ${esPrimero
                                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                                        : "bg-gray-200 text-gray-700 group-hover:bg-emerald-200 group-hover:text-emerald-800"}
                                        transition-all
                                    `}>
                                        {index + 1}
                                    </span>
                                </td>

                                <td className="py-4 px-3">
                                    <span className="text-sm font-extrabold text-gray-900 group-hover:text-emerald-800 transition-colors uppercase italic tracking-tight whitespace-nowrap">
                                        {p.nombreEquipo}
                                    </span>
                                </td>

                                <td className="py-4 px-1 text-center">
                                    <span className="text-base font-black text-emerald-700 italic">
                                        {p.puntos}
                                    </span>
                                </td>

                                <td className="py-4 px-1 text-center text-xs font-bold text-gray-700">{p.partidosJugados}</td>
                                <td className="py-4 px-1 text-center text-xs font-bold text-gray-700">{p.ganados}</td>
                                <td className="py-4 px-1 text-center text-xs font-bold text-gray-700">{p.empatados}</td>
                                <td className="py-4 px-1 text-center text-xs font-bold text-gray-700">{p.perdidos}</td>

                                <td className="py-4 px-1 text-center">
                                    <span className={`text-xs font-black italic ${diferenciaGoles > 0 ? 'text-emerald-600' : diferenciaGoles < 0 ? 'text-red-600' : 'text-gray-400'}`}>
                                        {diferenciaGoles > 0 ? `+${diferenciaGoles}` : diferenciaGoles}
                                    </span>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

            <div className="bg-gray-100 py-3 px-8 border-t-2 border-gray-300">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 text-right">
                    Datos Oficiales • Ligas Jujeñas
                </p>
            </div>
        </div>
    );
}