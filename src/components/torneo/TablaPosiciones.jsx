import { FaShieldAlt } from "react-icons/fa";

export default function TablaPosiciones({ posiciones }) {
    const borderFrame = "1px solid var(--ts)22";
    const borderRow = "1px solid #33415588";

    return (
        <div
            className="w-full overflow-hidden rounded-[1.5rem] md:rounded-[2rem] backdrop-blur-md shadow-2xl transition-all duration-700"
            style={{
                border: borderFrame,
                backgroundColor: "var(--s)"
            }}
        >
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse table-auto">
                    <thead>
                    <tr
                        style={{
                            backgroundColor: "var(--p)",
                            borderBottom: borderRow,
                            color: "var(--ts)"
                        }}
                    >
                        <th className="py-3 pl-2 pr-0 text-[9px] md:text-sm font-black text-right w-[15px] md:w-[30px] shrink-0">#</th>
                        <th className="py-3 px-2 text-[9px] md:text-sm font-black text-left min-w-[110px] md:min-w-[300px]">EQUIPOS</th>

                        <th
                            className="py-3 px-1 text-[9px] md:text-sm font-black text-center w-[35px] md:w-[80px] shrink-0"
                            style={{ backgroundColor: "var(--ts)11" }}
                        >
                            PTS
                        </th>
                        <th className="py-3 px-0.5 text-[9px] md:text-sm font-black text-center w-[25px] md:w-[60px] shrink-0">J</th>
                        <th className="py-3 px-0.5 text-[9px] md:text-sm font-black text-center w-[25px] md:w-[60px] shrink-0">G</th>
                        <th className="py-3 px-0.5 text-[9px] md:text-sm font-black text-center w-[25px] md:w-[60px] shrink-0">E</th>
                        <th className="py-3 px-0.5 text-[9px] md:text-sm font-black text-center w-[25px] md:w-[60px] shrink-0">P</th>
                        <th className="py-3 px-1 text-[9px] md:text-sm font-black text-center w-[35px] md:w-[80px] shrink-0">+/-</th>
                    </tr>
                    </thead>

                    <tbody>
                    {posiciones.map((p, index) => {
                        const diferenciaGoles = (p.golesAFavor || 0) - (p.golesEnContra || 0);

                        return (
                            <tr
                                key={p.id || index}
                                className="transition-colors group"
                                style={{
                                    borderBottom: borderRow,
                                    backgroundColor: "transparent"
                                }}
                            >
                                {/* py-2 en móvil para compactar verticalmente */}
                                <td className="py-2 md:py-4 pl-2 pr-0 text-right font-black text-[10px] md:text-base opacity-30">
                                    {index + 1}
                                </td>

                                <td className="py-2 md:py-4 px-2">
                                    <div className="flex items-center gap-1.5 md:gap-3">
                                        <div className="shrink-0 w-5 h-5 md:w-11 md:h-11 flex items-center justify-center">
                                            {p.escudo || p.urlEscudo ? (
                                                <img
                                                    src={p.escudo || p.urlEscudo}
                                                    alt={`Escudo de ${p.nombreEquipo}`}
                                                    className="w-full h-full object-contain filter drop-shadow-2xl"
                                                />
                                            ) : (
                                                <FaShieldAlt style={{ color: "var(--ts)" }} className="text-[10px] md:text-3xl opacity-20" />
                                            )}
                                        </div>

                                        <span
                                            className="text-[10px] md:text-lg font-bold uppercase tracking-tighter truncate max-w-[85px] md:max-w-none"
                                            style={{ color: "var(--tp)" }}
                                            title={p.nombreEquipo}
                                        >
                                                {p.nombreEquipo}
                                            </span>
                                    </div>
                                </td>

                                <td
                                    className="py-2 md:py-4 px-1 text-center font-black text-xs md:text-xl"
                                    style={{ backgroundColor: "var(--ts)08", color: "var(--tp)" }}
                                >
                                    {p.puntos}
                                </td>

                                <td className="py-2 md:py-4 px-0.5 text-center text-[9px] md:text-base font-bold opacity-50">{p.partidosJugados}</td>
                                <td className="py-2 md:py-4 px-0.5 text-center text-[9px] md:text-base font-bold opacity-50">{p.ganados}</td>
                                <td className="py-2 md:py-4 px-0.5 text-center text-[9px] md:text-base font-bold opacity-50">{p.empatados}</td>
                                <td className="py-2 md:py-4 px-0.5 text-center text-[9px] md:text-base font-bold opacity-50">{p.perdidos}</td>

                                <td className="py-2 md:py-4 px-1 text-center">
                                        <span
                                            className="text-[9px] md:text-base font-black"
                                            style={{
                                                color: diferenciaGoles > 0 ? "#10b981" : diferenciaGoles < 0 ? "#ef4444" : "var(--ts)44"
                                            }}
                                        >
                                            {diferenciaGoles > 0 ? `+${diferenciaGoles}` : diferenciaGoles}
                                        </span>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

            <div
                className="py-2 px-4 text-center"
                style={{
                    backgroundColor: "var(--p)",
                    borderTop: borderRow
                }}
            >
                <p className="text-[7px] md:text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: "var(--ts)", opacity: 0.4 }}>
                    POSICIONES OFICIALES
                </p>
            </div>
        </div>
    );
}