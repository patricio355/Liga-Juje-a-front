export default function PartidoCard({ partido }) {
    const finalizado = partido.estado === "FINALIZADO";

    return (
        <div
            className={`
                mx-auto max-w-4xl
                rounded-xl px-6 py-4
                shadow
                ${finalizado ? "bg-green-200" : "bg-white"}
            `}
        >
            {/* FILA PRINCIPAL */}
            <div className="grid grid-cols-3 items-center text-black">

                {/* LOCAL */}
                <div className="text-left">
                    <span className="text-base font-bold">
                        {partido.equipoLocalNombre}
                    </span>
                </div>

                {/* RESULTADO / ESTADO */}
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
                            ? `${partido.golesLocal} - ${partido.golesVisitante}`
                            : "vs"
                        }
                    </div>
                </div>

                {/* VISITANTE */}
                <div className="text-right">
                    <span className="text-base font-bold">
                        {partido.equipoVisitanteNombre}
                    </span>
                </div>
            </div>

            {/* INFO */}
            <div className="mt-2 text-xs text-center text-gray-700">
                Fecha y horario: {partido.fecha ?? "A definir"} &nbsp;|&nbsp;
                Cancha: {partido.canchaNombre ?? "A definir"}
            </div>
        </div>
    );
}
