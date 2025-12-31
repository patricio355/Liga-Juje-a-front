export default function PartidoCardAdmin({
                                             partido,
                                             equiposDuplicados, // Recibe el Set de nombres duplicados del padre
                                             onCerrar,
                                             onEditar
                                         }) {
    const finalizado = partido.estado === "FINALIZADO";

    const local = partido.local || partido.equipoLocalNombre || "Local";
    const visitante = partido.visitante || partido.equipoVisitanteNombre || "Visitante";

    // Verificamos si los equipos de este partido específico deben resaltar en rojo
    const esLocalDuplicado = equiposDuplicados?.has(local);
    const esVisitaDuplicado = equiposDuplicados?.has(visitante);

    return (
        <div
            className={`
                mx-auto w-full
                rounded-xl px-6 py-4
                shadow-lg border border-gray-100
                flex justify-between items-center transition-all
                ${finalizado ? "bg-green-50" : "bg-white"}
            `}
        >
            {/* INFO PARTIDO */}
            <div className="flex-1 grid grid-cols-3 items-center text-black">

                {/* LOCAL - Resalta en rojo si juega +1 vez */}
                <div className={`text-left font-bold transition-colors ${esLocalDuplicado ? "text-red-500/80" : "text-slate-800"}`}>
                    {local}
                </div>

                {/* ESTADO */}
                <div className="text-center">
                    <div
                        className={`text-[10px] uppercase tracking-widest font-bold mb-1
                            ${finalizado ? "text-green-600" : "text-amber-500"}
                        `}
                    >
                        {finalizado ? "Finalizado" : "Pendiente"}
                    </div>

                    <div className="text-xl font-black text-slate-400">
                        {finalizado
                            ? `${partido.golesLocal ?? "-"} - ${partido.golesVisitante ?? "-"}`
                            : "VS"}
                    </div>
                </div>

                {/* VISITANTE - Resalta en rojo si juega +1 vez */}
                <div className={`text-right font-bold transition-colors ${esVisitaDuplicado ? "text-red-500/80" : "text-slate-800"}`}>
                    {visitante}
                </div>
            </div>

            {/* ACCIONES ADMIN */}
            <div className="ml-8 flex items-center border-l border-gray-100 pl-6">
                {finalizado ? (
                    <button
                        onClick={() => onEditar(partido)}
                        className="text-blue-600 text-sm font-bold hover:text-blue-800 uppercase tracking-tighter transition"
                    >
                        Editar resultado
                    </button>
                ) : (
                    <button
                        onClick={() => onCerrar(partido)}
                        className="text-orange-500 text-sm font-bold hover:text-orange-700 uppercase tracking-tighter transition"
                    >
                        Cerrar partido
                    </button>
                )}
            </div>
        </div>
    );
}