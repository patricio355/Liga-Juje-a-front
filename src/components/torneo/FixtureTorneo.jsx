import { useEffect, useState } from "react";
import PartidoCard from "./PartidoCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function FixtureTorneo({ zonaId }) {
    const [fixture, setFixture] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fechaSeleccionada, setFechaSeleccionada] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL;

    // --- FUNCIÓN DE ORDENAMIENTO (Mismo criterio que en gestión) ---
    const ordenarPartidos = (partidos) => {
        return [...partidos].sort((a, b) => {
            // 1. Prioridad: Cancha (Normalizada)
            const canchaA = (a.canchaNombre || a.cancha || "ZZZ").toLowerCase();
            const canchaB = (b.canchaNombre || b.cancha || "ZZZ").toLowerCase();

            if (canchaA < canchaB) return -1;
            if (canchaA > canchaB) return 1;

            // 2. Si es la misma cancha, ordenar por Hora
            const horaA = a.hora || a.Hora || "99:99";
            const horaB = b.hora || b.Hora || "99:99";

            return horaA.localeCompare(horaB);
        });
    };

    useEffect(() => {
        const cargarFixture = async () => {
            try {
                const res = await fetch(`${API_URL}/api/partidos/zona/${zonaId}/fixture`);
                const data = await res.json();
                setFixture(Array.isArray(data) ? data : []);
                if (data.length > 0) setFechaSeleccionada(data[0].numeroFecha);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        cargarFixture();
    }, [zonaId, API_URL]);

    if (loading) return <p className="text-center py-10 text-blue-500 font-black animate-pulse uppercase tracking-widest text-[10px]">Cargando Fixture...</p>;
    if (fixture.length === 0) return <p className="text-center py-10 text-slate-500 italic text-sm">No hay partidos programados</p>;

    return (
        <div className="w-full bg-[#0e1630]/60 backdrop-blur-md rounded-3xl border border-blue-900/40 shadow-2xl overflow-hidden">

            <div className="bg-[#050814]/90 border-b border-blue-900/40 p-4 md:p-6 flex flex-col items-center gap-4">
                <span className="text-[10px] md:text-xs font-black text-blue-500 uppercase tracking-[0.4em] italic">FECHA</span>
                <div className="flex items-center justify-center gap-4 w-full">
                    <button
                        onClick={() => setFechaSeleccionada(f => Math.max(fixture[0].numeroFecha, f - 1))}
                        disabled={fechaSeleccionada === fixture[0].numeroFecha}
                        className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full border border-blue-900/60 text-blue-400 hover:border-blue-400 hover:text-white transition-all disabled:opacity-5 bg-[#02040a]"
                    >
                        <FaChevronLeft size={10} className="md:size-3" />
                    </button>

                    <div className="flex flex-wrap gap-2 justify-center">
                        {fixture.map(f => (
                            <button
                                key={`fixture-fecha-${f.numeroFecha}`}
                                onClick={() => setFechaSeleccionada(f.numeroFecha)}
                                className={`w-8 h-8 md:w-10 md:h-10 rounded-xl text-[10px] md:text-xs font-black transition-all border flex items-center justify-center
                                    ${fechaSeleccionada === f.numeroFecha
                                    ? "bg-blue-600 text-white border-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.4)] scale-105"
                                    : "bg-[#02040a] text-blue-900 border-blue-900/40 hover:border-blue-700 hover:text-blue-300"}`}
                            >
                                {f.numeroFecha}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setFechaSeleccionada(f => Math.min(fixture[fixture.length - 1].numeroFecha, f + 1))}
                        disabled={fechaSeleccionada === fixture[fixture.length - 1].numeroFecha}
                        className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full border border-blue-900/60 text-blue-400 hover:border-blue-400 hover:text-white transition-all disabled:opacity-5 bg-[#02040a]"
                    >
                        <FaChevronRight size={10} className="md:size-3" />
                    </button>
                </div>
            </div>

            <div className="p-2 md:p-10 space-y-4 md:space-y-8 bg-transparent">
                {fixture.filter(f => f.numeroFecha === fechaSeleccionada).map(fecha => (
                    // LLAMAMOS A LA FUNCIÓN DE ORDENAR ANTES DEL MAP
                    ordenarPartidos(fecha.partidos).map(partido => (
                        <PartidoCard
                            key={`partido-${partido.partidoId || partido.id}`}
                            partido={{
                                ...partido,
                                equipoLocalNombre: partido.equipoLocalNombre || partido.local,
                                equipoVisitanteNombre: partido.equipoVisitanteNombre || partido.visitante,
                                equipoLocalEscudo: partido.equipoLocalEscudo || partido.localEscudo,
                                equipoVisitanteEscudo: partido.equipoVisitanteEscudo || partido.visitanteEscudo,
                                canchaNombre: partido.canchaNombre || partido.cancha,
                                hora: partido.hora || partido.Hora,
                                arbitro: partido.arbitro || partido.arbitroNombre,
                                golesLocal: partido.golesLocal ?? partido.golesL,
                                golesVisitante: partido.golesVisitante ?? partido.golesV,
                                partidoId: partido.partidoId || partido.id
                            }}
                        />
                    ))
                ))}
            </div>

            <div className="bg-[#050814] py-3 px-4 border-t border-blue-900/30">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-900/60 text-center">Programación Sujeta a Cambios</p>
            </div>
        </div>
    );
}