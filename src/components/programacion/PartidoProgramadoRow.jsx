// src/components/programacion/PartidoProgramadoRow.jsx
import CerrarPartidoForm from "./CerrarPartidoForm.jsx";

export default function PartidoProgramadoRow({ partido }) {
    const local =
        partido.local ||
        partido.equipoLocal ||
        partido.equipoLocalNombre ||
        "Local";

    const visitante =
        partido.visitante ||
        partido.equipoVisitante ||
        partido.equipoVisitanteNombre ||
        "Visitante";

    return (
        <div
            className="
                bg-[#ECECFF]
                border border-gray-300
                rounded-xl
                px-4 py-3
                flex items-center justify-between
            "
        >
            <div className="text-sm text-black">
                <span className="font-semibold">{local}</span>{" "}
                <span className="text-gray-600">vs</span>{" "}
                <span className="font-semibold">{visitante}</span>
            </div>

            <div className="text-xs text-gray-600">
                #{partido.partidoId}
                <CerrarPartidoForm partidoId={partido.partidoId} />
            </div>
        </div>
    );
}
