import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import PartidoCard from "./PartidoCard";

export default function ProgramacionComoFixture({ zonaId }) {
    const [fechaActual, setFechaActual] = useState(null);
    const [partidos, setPartidos] = useState([]);
    const [fechasValidas, setFechasValidas] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL;

    // --- FUNCIÓN DE ORDENAMIENTO ---
    const ordenarPartidos = (lista) => {
        return [...lista].sort((a, b) => {
            const canchaA = (a.cancha || a.canchaNombre || "ZZZ").toLowerCase();
            const canchaB = (b.cancha || b.canchaNombre || "ZZZ").toLowerCase();

            if (canchaA < canchaB) return -1;
            if (canchaA > canchaB) return 1;

            const horaA = a.hora || a.Hora || "99:99";
            const horaB = b.hora || b.Hora || "99:99";

            return horaA.localeCompare(horaB);
        });
    };

    useEffect(() => {
        const cargarFechasReales = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${API_URL}/api/programacion/zona/${zonaId}/fechas-disponibles`);
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    const fechasOrdenadas = data.sort((a, b) => a - b);
                    setFechasValidas(fechasOrdenadas);
                    setFechaActual(fechasOrdenadas[0]);
                }
            } catch (error) { console.error(error); } finally { setLoading(false); }
        };
        if (zonaId) cargarFechasReales();
    }, [zonaId, API_URL]);

    useEffect(() => {
        if (fechaActual === null) return;
        const cargarPartidos = async () => {
            try {
                const res = await fetch(`${API_URL}/api/programacion/zona/${zonaId}/fecha/${fechaActual}`);
                const data = await res.json();
                setPartidos(Array.isArray(data) ? data : []);
            } catch (error) { console.error(error); }
        };
        cargarPartidos();
    }, [zonaId, fechaActual, API_URL]);

    const navegar = (dir) => {
        const idx = fechasValidas.indexOf(fechaActual);
        if (dir === "next" && idx < fechasValidas.length - 1) setFechaActual(fechasValidas[idx + 1]);
        else if (dir === "prev" && idx > 0) setFechaActual(fechasValidas[idx - 1]);
    };

    if (fechasValidas.length === 0 && !loading) return null;

    return (
        /* CONTENEDOR PRINCIPAL: Borde sutil y fondo secundario */
        <div
            className="w-full backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden transition-all duration-700"
            style={{
                backgroundColor: "var(--secondary)",
                border: "1px solid var(--ts)15" // Borde muy sutil del color elegido
            }}
        >

            {/* Cabecera */}
            <div
                className="p-4 md:p-6 flex flex-col items-center gap-4"
                style={{
                    backgroundColor: "var(--p)",
                    borderBottom: "1px solid var(--ts)25"
                }}
            >
                <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] italic" style={{ color: "var(--ts)" }}>
                    FECHA
                </span>

                <div className="flex items-center justify-center gap-4 w-full">
                    {/* Botón Anterior */}
                    <button
                        onClick={() => navegar("prev")}
                        className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full transition-all disabled:opacity-10 hover:scale-110"
                        style={{
                            border: "1px solid var(--ts)33",
                            color: "var(--ts)",
                            backgroundColor: "var(--secondary)"
                        }}
                    >
                        <FaChevronLeft size={10} className="md:size-3" />
                    </button>

                    {/* Lista de Fechas */}
                    <div className="flex flex-wrap gap-2 justify-center">
                        {fechasValidas.map(f => {
                            const esActual = fechaActual === f;
                            return (
                                <button
                                    key={f}
                                    onClick={() => setFechaActual(f)}
                                    className="w-8 h-8 md:w-10 md:h-10 rounded-xl text-[10px] md:text-xs font-black transition-all border flex items-center justify-center"
                                    style={esActual ? {
                                        backgroundColor: "var(--ts)", // Fondo del color de acento
                                        color: "var(--p)",            // Texto oscuro para contraste
                                        border: "1px solid var(--ts)",
                                        boxShadow: "0 0 15px var(--ts)44",
                                        transform: "scale(1.05)"
                                    } : {
                                        backgroundColor: "transparent",
                                        color: "var(--ts)",
                                        border: "1px solid var(--ts)22" // Borde inactivo sutil
                                    }}
                                >
                                    {f}
                                </button>
                            );
                        })}
                    </div>

                    {/* Botón Siguiente */}
                    <button
                        onClick={() => navegar("next")}
                        className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full transition-all disabled:opacity-10 hover:scale-110"
                        style={{
                            border: "1px solid var(--ts)33",
                            color: "var(--ts)",
                            backgroundColor: "var(--secondary)"
                        }}
                    >
                        <FaChevronRight size={10} className="md:size-3" />
                    </button>
                </div>
            </div>

            <div className="p-2 md:p-6 lg:p-10 space-y-4 md:space-y-6 bg-transparent w-full max-w-4xl mx-auto">
                {ordenarPartidos(partidos).map((p, index) => (
                    <PartidoCard
                        key={p.partidoId || p.id || `partido-${index}`}
                        partido={{
                            ...p,
                            equipoLocalNombre: p.local || p.equipoLocalNombre,
                            equipoVisitanteNombre: p.visitante || p.equipoVisitanteNombre,
                            equipoLocalEscudo: p.localEscudo || p.equipoLocalEscudo,
                            equipoVisitanteEscudo: p.visitanteEscudo || p.equipoVisitanteEscudo,
                            canchaNombre: p.cancha || p.canchaNombre,
                            ubicacionUrl: p.ubicacionUrl || p.canchaUbicacionUrl,
                            hora: p.hora || p.Hora,
                            arbitro: p.arbitro || p.arbitroNombre,
                            golesLocal: p.golesLocal ?? p.golesL,
                            golesVisitante: p.golesVisitante ?? p.golesV,
                            partidoId: p.partidoId || p.id
                        }}
                    />
                ))}
            </div>

            {/* Footer */}
            <div
                className="py-3 px-4 text-center"
                style={{
                    backgroundColor: "var(--p)",
                    borderTop: "1px solid var(--ts)25"
                }}
            >
                <p className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: "var(--ts)", opacity: 0.5 }}>
                    Programación Sujeta a Cambios
                </p>
            </div>
        </div>
    );
}