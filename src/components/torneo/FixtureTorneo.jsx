import { useEffect, useState } from "react";
import PartidoCard from "./PartidoCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function FixtureTorneo({ zonaId }) {
    const [fixture, setFixture] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fechaSeleccionada, setFechaSeleccionada] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL;

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

    if (loading) return <p className="text-center py-10 text-emerald-500 font-black animate-pulse uppercase tracking-widest text-xs">Cargando Fixture...</p>;
    if (fixture.length === 0) return <p className="text-center py-10 text-gray-500 italic text-sm">No hay partidos programados</p>;

    return (
        <div className="bg-[#12172d] rounded-xl border border-gray-800 shadow-2xl overflow-hidden max-w-lg mx-auto">
            {/* SELECTOR DE FECHAS ESTILO PROMIEDOS */}
            <div className="bg-[#1c213b] border-b border-gray-800 p-4 flex flex-col items-center gap-3">

                {/* Texto arriba con acento esmeralda */}
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] italic">
                    FECHA
                </span>

                <div className="flex items-center justify-center gap-3 w-full">
                    <button
                        onClick={() => setFechaSeleccionada(f => Math.max(fixture[0].numeroFecha, f - 1))}
                        disabled={fechaSeleccionada === fixture[0].numeroFecha}
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-700 text-gray-400 hover:border-emerald-500 hover:text-emerald-500 transition-all disabled:opacity-10 bg-[#0b1023]"
                    >
                        <FaChevronLeft size={10} />
                    </button>

                    {/* Selector numérico compacto */}
                    <div className="flex flex-wrap gap-1 justify-center">
                        {fixture.map(f => (
                            <button
                                key={`fixture-fecha-${f.numeroFecha}`}
                                onClick={() => setFechaSeleccionada(f.numeroFecha)}
                                className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all border
                                    ${fechaSeleccionada === f.numeroFecha
                                    ? "bg-emerald-600 text-white border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)] scale-110"
                                    : "bg-[#0b1023] text-gray-500 border-gray-800 hover:border-gray-600 hover:text-gray-300"}`}
                            >
                                {f.numeroFecha}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setFechaSeleccionada(f => Math.min(fixture[fixture.length - 1].numeroFecha, f + 1))}
                        disabled={fechaSeleccionada === fixture[fixture.length - 1].numeroFecha}
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-700 text-gray-400 hover:border-emerald-500 hover:text-emerald-500 transition-all disabled:opacity-10 bg-[#0b1023]"
                    >
                        <FaChevronRight size={10} />
                    </button>
                </div>
            </div>

            {/* LISTADO DE PARTIDOS CON FONDO OSCURO */}
            <div className="p-4 space-y-3 bg-[#12172d]">
                {fixture.filter(f => f.numeroFecha === fechaSeleccionada).map(fecha => (
                    fecha.partidos.map(partido => (
                        <PartidoCard
                            key={`partido-${partido.id || partido.partidId}`}
                            partido={partido}
                        />
                    ))
                ))}
            </div>

            {/* Pie del fixture */}
            <div className="bg-[#0b1023] py-2 px-4 border-t border-gray-800">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600 text-center">
                    Programación Sujeta a Cambios
                </p>
            </div>
        </div>
    );
}