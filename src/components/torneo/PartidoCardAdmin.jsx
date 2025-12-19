export default function PartidoCardAdmin({
                                             partido,
                                             onCerrar,
                                             onEditar
                                         }) {
    const finalizado = partido.estado === "FINALIZADO";

    const local =
        partido.local ||
        partido.equipoLocalNombre ||
        "Local";

    const visitante =
        partido.visitante ||
        partido.equipoVisitanteNombre ||
        "Visitante";

    return (
        <div
            className={`
                mx-auto w-full
                rounded-xl px-6 py-4
                shadow
                flex justify-between items-center
                ${finalizado ? "bg-green-200" : "bg-white"}
            `}
        >
            {/* INFO PARTIDO */}
            <div className="flex-1 grid grid-cols-3 items-center text-black">

                {/* LOCAL */}
                <div className="text-left font-bold">
                    {local}
                </div>

                {/* ESTADO */}
                <div className="text-center">
                    <div
                        className={`text-xs font-semibold mb-1
                            ${finalizado ? "text-red-600" : "text-green-600"}
                        `}
                    >
                        {finalizado ? "Finalizado" : "Pendiente"}
                    </div>

                    <div className="text-xl font-extrabold">
                        {finalizado
                            ? `${partido.golesLocal ?? "-"} - ${partido.golesVisitante ?? "-"}`
                            : "vs"}
                    </div>
                </div>

                {/* VISITANTE */}
                <div className="text-right font-bold">
                    {visitante}
                </div>
            </div>

            {/* ACCIONES ADMIN */}
            <div className="ml-6 flex items-center gap-3">
                {finalizado ? (
                    <button
                        onClick={() => onEditar(partido)}
                        className="text-blue-600 font-semibold hover:underline"
                    >
                        Editar resultado
                    </button>
                ) : (
                    <button
                        onClick={() => onCerrar(partido)}
                        className="text-orange-600 font-semibold hover:underline"
                    >
                        Cerrar partido
                    </button>
                )}
            </div>
        </div>
    );
}
