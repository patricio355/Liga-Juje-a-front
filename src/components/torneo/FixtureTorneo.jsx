import { useEffect, useState } from "react";
import PartidoCard from "./PartidoCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function FixtureTorneo({ zonaId }) {
    const [fixture, setFixture] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fechaSeleccionada, setFechaSeleccionada] = useState(null);

    useEffect(() => {
        const cargarFixture = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/partidos/zona/${zonaId}/fixture`);
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
    }, [zonaId]);

    if (loading) return <p className="text-center py-10 text-emerald-600 font-bold animate-pulse">Cargando...</p>;
    if (fixture.length === 0) return <p className="text-center py-10 text-gray-400 italic">No hay partidos cargados</p>;

    return (
        <div className="bg-white rounded-2xl border-2 border-gray-300 shadow-md overflow-hidden max-w-lg mx-auto">
            {/* SELECTOR CON "FECHA" ARRIBA Y BOTONES EXTENDIDOS */}
            <div className="bg-gray-100 border-b-2 border-gray-300 p-4 flex flex-col items-center gap-3">

                {/* Texto arriba */}
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] italic">
                    Fecha
                </span>

                {/* Contenedor de navegación extendido */}
                <div className="flex items-center justify-center gap-3 w-full">
                    <button
                        onClick={() => setFechaSeleccionada(f => Math.max(fixture[0].numeroFecha, f - 1))}
                        disabled={fechaSeleccionada === fixture[0].numeroFecha}
                        className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-300 text-gray-500 hover:border-emerald-500 hover:text-emerald-600 transition-all disabled:opacity-10"
                    >
                        <FaChevronLeft size={12} />
                    </button>

                    {/* Contenedor de números sin scroll y con flex-wrap para que se adapte */}
                    <div className="flex flex-wrap gap-1 justify-center">
                        {fixture.map(f => (
                            <button
                                key={f.numeroFecha}
                                onClick={() => setFechaSeleccionada(f.numeroFecha)}
                                className={`min-w-[32px] h-8 rounded-lg text-[10px] font-black transition-all border-2
                                    ${fechaSeleccionada === f.numeroFecha
                                    ? "bg-emerald-600 text-white border-emerald-700 shadow-sm scale-105"
                                    : "bg-white text-gray-400 border-gray-200 hover:border-gray-400"}`}
                            >
                                {f.numeroFecha}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setFechaSeleccionada(f => Math.min(fixture[fixture.length - 1].numeroFecha, f + 1))}
                        disabled={fechaSeleccionada === fixture[fixture.length - 1].numeroFecha}
                        className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-300 text-gray-400 hover:border-emerald-500 hover:text-emerald-600 transition-all disabled:opacity-10"
                    >
                        <FaChevronRight size={12} />
                    </button>
                </div>
            </div>

            {/* LISTADO DE PARTIDOS */}
            <div className="p-4 space-y-3">
                {fixture.filter(f => f.numeroFecha === fechaSeleccionada).map(fecha => (
                    fecha.partidos.map(partido => <PartidoCard key={partido.id} partido={partido} />)
                ))}
            </div>
        </div>
    );
}