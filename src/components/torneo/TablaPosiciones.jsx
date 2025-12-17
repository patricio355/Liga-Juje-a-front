export default function TablaPosiciones({ posiciones }) {
    return (
        <div className="max-w-6xl mx-auto mt-8 px-4">
            <table className="w-full bg-gray-200 text-black rounded-xl overflow-hidden">
                <thead>
                <tr className="bg-[#ECEDEF]">
                    <th className="text-left px-4 py-2">Equipo</th>
                    <th>PTS</th>
                    <th>PJ</th>
                    <th>PG</th>
                    <th>PE</th>
                    <th>PP</th>
                    <th>DG</th>
                </tr>
                </thead>

                <tbody>
                {posiciones.map(p => (
                    <tr key={p.id} className="border-t">
                        <td className="px-4 py-2 font-semibold">
                            {p.nombreEquipo}
                        </td>

                        <td className="text-center font-bold">
                            {p.puntos}
                        </td>
                        <td className="text-center">{p.partidosJugados}</td>
                        <td className="text-center">{p.ganados}</td>
                        <td className="text-center">{p.empatados}</td>
                        <td className="text-center">{p.perdidos}</td>
                        <td className="text-center">
                            {p.golesAFavor - p.golesEnContra}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
