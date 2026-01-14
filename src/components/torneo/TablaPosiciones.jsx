import { FaShieldAlt } from "react-icons/fa";

export default function TablaPosiciones({ posiciones }) {
    // Definimos los bordes manuales grises para mantener consistencia y limpieza
    const borderFrame = "1px solid #334155"; // Gris visible para el marco
    const borderRow = "1px solid #1e293b";   // Gris muy oscuro/sutil para filas

    return (
        <div
            className="w-full overflow-hidden rounded-2xl backdrop-blur-md shadow-2xl transition-all duration-700"
            style={{
                border: borderFrame, // Borde gris manual
                backgroundColor: "var(--secondary)"
            }}
        >
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse table-auto">
                    <thead>
                    <tr
                        style={{
                            backgroundColor: "var(--p)",
                            borderBottom: borderFrame, // Separación del header más definida
                            color: "var(--ts)"
                        }}
                    >
                        <th className="py-4 px-2 text-[10px] md:text-sm font-black text-center w-[30px] md:w-[50px] shrink-0">#</th>
                        <th className="py-4 px-3 text-[10px] md:text-sm font-black text-left min-w-[140px] md:min-w-[300px]">EQUIPOS</th>

                        {/* PTS sigue con fondo tintado muy suave para destacar */}
                        <th
                            className="py-4 px-2 text-[10px] md:text-sm font-black text-center w-[40px] md:w-[80px] shrink-0"
                            style={{ backgroundColor: "var(--ts)11" }}
                        >
                            PTS
                        </th>
                        <th className="py-4 px-1 text-[10px] md:text-sm font-black text-center w-[30px] md:w-[60px] shrink-0">J</th>
                        <th className="py-4 px-1 text-[10px] md:text-sm font-black text-center w-[30px] md:w-[60px] shrink-0">G</th>
                        <th className="py-4 px-1 text-[10px] md:text-sm font-black text-center w-[30px] md:w-[60px] shrink-0">E</th>
                        <th className="py-4 px-1 text-[10px] md:text-sm font-black text-center w-[30px] md:w-[60px] shrink-0">P</th>
                        <th className="py-4 px-2 text-[10px] md:text-sm font-black text-center w-[45px] md:w-[80px] shrink-0">+/-</th>
                    </tr>
                    </thead>

                    <tbody>
                    {posiciones.map((p, index) => {
                        const diferenciaGoles = (p.golesAFavor || 0) - (p.golesEnContra || 0);

                        return (
                            <tr
                                key={p.id || index}
                                className="transition-colors"
                                style={{
                                    borderBottom: borderRow, // Borde casi imperceptible entre filas
                                    backgroundColor: "transparent"
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "var(--ts)05"}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                            >
                                <td className="py-4 px-2 text-center font-black text-[10px] md:text-base opacity-40">
                                    {index + 1}
                                </td>

                                <td className="py-4 px-3">
                                    <div className="flex items-center gap-3 md:gap-5">
                                        <div className="shrink-0 w-7 h-7 md:w-10 md:h-10 flex items-center justify-center">
                                            {p.escudo || p.urlEscudo ? (
                                                <img
                                                    src={p.escudo || p.urlEscudo}
                                                    alt={`Escudo de ${p.nombreEquipo}`}
                                                    className="w-full h-full object-contain filter drop-shadow-lg"
                                                />
                                            ) : (
                                                <FaShieldAlt style={{ color: "var(--ts)" }} className="text-lg md:text-3xl opacity-20" />
                                            )}
                                        </div>

                                        <span
                                            className="text-[11px] md:text-lg font-bold uppercase tracking-tighter whitespace-nowrap"
                                            style={{ color: "var(--tp)" }}
                                        >
                                                {p.nombreEquipo}
                                            </span>
                                    </div>
                                </td>

                                {/* Celda de Puntos */}
                                <td
                                    className="py-4 px-2 text-center font-black text-xs md:text-xl"
                                    style={{ backgroundColor: "var(--ts)10", color: "var(--tp)" }}
                                >
                                    {p.puntos}
                                </td>

                                <td className="py-4 px-1 text-center text-[10px] md:text-base font-bold opacity-50">{p.partidosJugados}</td>
                                <td className="py-4 px-1 text-center text-[10px] md:text-base font-bold opacity-50">{p.ganados}</td>
                                <td className="py-4 px-1 text-center text-[10px] md:text-base font-bold opacity-50">{p.empatados}</td>
                                <td className="py-4 px-1 text-center text-[10px] md:text-base font-bold opacity-50">{p.perdidos}</td>

                                <td className="py-4 px-2 text-center">
                                        <span
                                            className="text-[10px] md:text-base font-black"
                                            style={{
                                                color: diferenciaGoles > 0 ? "var(--ts)" : diferenciaGoles < 0 ? "#ef4444" : "var(--ts)44"
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
                className="py-3 px-4 text-center"
                style={{
                    backgroundColor: "var(--p)",
                    borderTop: borderFrame // Borde gris superior del footer
                }}
            >
                <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: "var(--ts)", opacity: 0.4 }}>
                    POSICIONES OFICIALES • TEMPORADA 2026
                </p>
            </div>
        </div>
    );
}