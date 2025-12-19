import { useEffect, useState } from "react";
import PartidoCard from "./PartidoCard";

export default function ProgramacionComoFixture({ zonaId }) {
    const [fecha, setFecha] = useState(1);
    const [partidos, setPartidos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargar = async () => {
            setLoading(true);
            const res = await fetch(
                `http://localhost:8080/api/programacion/zona/${zonaId}/fecha/${fecha}`
            );
            const data = await res.json();
            setPartidos(Array.isArray(data) ? data : []);
            setLoading(false);
        };

        cargar();
    }, [zonaId, fecha]);

    if (loading) {
        return <p className="text-center text-gray-400">Cargando…</p>;
    }

    return (
        <div className="mt-6 px-4">

            {/* Selector de fecha */}
            <div className="flex justify-center gap-2 mb-6 text-white">
                {Array.from({ length: 9 }, (_, i) => i + 1).map(f => (
                    <button
                        key={f}
                        onClick={() => setFecha(f)}
                        className={`px-3 py-1 rounded
                            ${fecha === f
                            ? "bg-white text-black"
                            : "bg-white/10"}
                        `}
                    >
                        Fecha {f}
                    </button>
                ))}
            </div>

            {/* Partidos */}
            <div className="space-y-3">
                {partidos.map(p => {
                    const partidoAdaptado = {
                        estado: p.estado,
                        equipoLocalNombre: p.local,
                        equipoVisitanteNombre: p.visitante,
                        golesLocal: p.golesLocal,
                        golesVisitante: p.golesVisitante,
                        fecha: p.fecha,
                        canchaNombre: p.cancha
                    };

                    return (
                        <PartidoCard
                            key={p.partidoId}
                            partido={partidoAdaptado}
                        />
                    );
                })}
            </div>
        </div>
    );
}
