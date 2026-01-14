import { useState, useEffect, useRef } from "react";
import { apiFetch } from "../api/api";
import {
    FaSync, FaCalendarAlt,
    FaMapMarkerAlt, FaUserTie, FaChevronDown, FaClock, FaTrophy
} from "react-icons/fa";

export default function CuadroFaseFinal({ torneoId }) {
    const [etapasOriginales, setEtapasOriginales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [detalleAbierto, setDetalleAbierto] = useState(null);

    const scrollRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    // --- VARIABLES DE BORDE SUTIL ---
    const borderSutil = "1px solid var(--ts)33";
    const borderMuySutil = "1px solid var(--ts)15";

    useEffect(() => {
        const cargarCuadro = async () => {
            try {
                setLoading(true);
                const data = await apiFetch(`/api/torneos/${torneoId}/cuadro-completo`);
                setEtapasOriginales(data.sort((a, b) => b.orden - a.orden));
            } catch (error) {
                console.error("Error al cargar cuadro final:", error);
            } finally {
                setLoading(false);
            }
        };
        cargarCuadro();
    }, [torneoId]);

    const organizarEtapasEspejo = () => {
        if (etapasOriginales.length === 0) return [];
        const final = etapasOriginales.find(e => e.orden === 1);
        const otrasEtapas = etapasOriginales.filter(e => e.orden !== 1);

        const etapasIzquierda = otrasEtapas.map(etapa => {
            const mitad = Math.pow(2, etapa.orden - 1) / 2;
            const partidos = [...Array(mitad)].map((_, i) => {
                const numOrdenEsperado = i + 1;
                const pReal = etapa.partidos.find(p => p.orden === numOrdenEsperado);
                return pReal || { id: `left-${etapa.id}-${numOrdenEsperado}`, placeholder: true, orden: numOrdenEsperado };
            });
            return { ...etapa, partidosVisuales: partidos };
        });

        const etapasDerecha = [...otrasEtapas].reverse().map(etapa => {
            const totalPartidosFase = Math.pow(2, etapa.orden - 1);
            const mitad = totalPartidosFase / 2;
            const partidos = [...Array(mitad)].map((_, i) => {
                const numOrdenEsperado = i + 1 + mitad;
                const pReal = etapa.partidos.find(p => p.orden === numOrdenEsperado);
                return pReal || { id: `right-${etapa.id}-${numOrdenEsperado}`, placeholder: true, orden: numOrdenEsperado };
            });
            return { ...etapa, partidosVisuales: partidos };
        });

        return [...etapasIzquierda, final, ...etapasDerecha];
    };

    const etapasVisuales = organizarEtapasEspejo();

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };
    const handleMouseLeave = () => setIsDragging(false);
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    const toggleDetalle = (e, id) => {
        e.stopPropagation();
        setDetalleAbierto(detalleAbierto === id ? null : id);
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-10 gap-2">
            <FaSync className="animate-spin text-xl" style={{ color: "var(--ts)" }} />
            <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: "var(--ts)" }}>Sincronizando Cuadro</span>
        </div>
    );

    return (
        /* CONTENEDOR PRINCIPAL: Fondo transparente, borde sutil */
        <div
            className="mt-2 mb-6 p-2 md:p-4 rounded-xl backdrop-blur-sm shadow-xl overflow-hidden"
            style={{
                border: borderSutil,
                backgroundColor: "var(--secondary)" // Fondo base oscuro
            }}
        >
            <div
                ref={scrollRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                className={`w-full overflow-x-auto custom-scrollbar select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            >
                <div className="flex flex-row justify-start md:justify-center gap-0 min-w-max px-1 pb-16">
                    {etapasVisuales.map((etapa, idx) => {
                        if (!etapa) return null;
                        const esFinal = etapa.orden === 1;
                        const partidos = esFinal ? etapa.partidos : etapa.partidosVisuales;

                        return (
                            <div key={`${etapa.id}-${idx}`} className="flex flex-col w-[210px] relative">
                                {/* NOMBRE DE LA ETAPA */}
                                <div className="text-center pt-2 mb-2">
                                    <span
                                        className="border px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-md"
                                        style={esFinal ? {
                                            backgroundColor: "#ca8a0422", // Amarillo sutil
                                            borderColor: "#eab308",       // Amarillo fuerte
                                            color: "#eab308"
                                        } : {
                                            backgroundColor: "var(--p)",
                                            borderColor: "var(--ts)44",
                                            color: "var(--ts)"
                                        }}
                                    >
                                        {etapa.nombre}
                                    </span>
                                </div>

                                <div className="flex flex-col justify-around flex-grow relative">
                                    {partidos.map((partido) => {
                                        const hayGanador = partido.ganadorId !== null && partido.ganadorId !== undefined;
                                        const localGano = hayGanador && Number(partido.ganadorId) === Number(partido.equipoLocalId);
                                        const visitanteGano = hayGanador && Number(partido.ganadorId) === Number(partido.equipoVisitanteId);

                                        return (
                                            <div key={partido.id} className="relative py-3 px-1.5 flex items-center">

                                                <div
                                                    onClick={(e) => !partido.placeholder && toggleDetalle(e, partido.id)}
                                                    className={`w-full rounded-lg overflow-hidden shadow-lg transition-all relative z-10 ${!partido.placeholder ? 'cursor-pointer' : ''}`}
                                                    style={{
                                                        backgroundColor: "var(--p)",
                                                        border: partido.placeholder ? "1px dashed var(--ts)22" : borderSutil,
                                                        opacity: partido.placeholder ? 0.4 : 1,
                                                        borderColor: esFinal && !partido.placeholder ? "#eab308" : undefined // Borde dorado si es final
                                                    }}
                                                >
                                                    {/* Equipo Local */}
                                                    <div
                                                        className="flex justify-between items-center p-2"
                                                        style={{ borderBottom: borderMuySutil }}
                                                    >
                                                        <div className="flex items-center gap-2 overflow-hidden">
                                                            {partido.equipoLocalEscudo && <img src={partido.equipoLocalEscudo} className="w-4 h-4 object-contain" alt="" />}
                                                            <span
                                                                className="text-[10px] font-black uppercase truncate max-w-[110px]"
                                                                style={{ color: localGano ? "var(--ts)" : "var(--tp)", opacity: localGano ? 1 : 0.6 }}
                                                            >
                                                                {partido.equipoLocal || "POR DEFINIR"}
                                                            </span>
                                                        </div>
                                                        <span
                                                            className="text-xs font-black"
                                                            style={{ color: localGano ? "var(--ts)" : "var(--tp)" }}
                                                        >
                                                            {!partido.placeholder && partido.golesLocal !== null ? partido.golesLocal : "-"}
                                                        </span>
                                                    </div>

                                                    {/* Equipo Visitante */}
                                                    <div className="flex justify-between items-center p-2">
                                                        <div className="flex items-center gap-2 overflow-hidden">
                                                            {partido.equipoVisitanteEscudo && <img src={partido.equipoVisitanteEscudo} className="w-4 h-4 object-contain" alt="" />}
                                                            <span
                                                                className="text-[10px] font-black uppercase truncate max-w-[110px]"
                                                                style={{ color: visitanteGano ? "var(--ts)" : "var(--tp)", opacity: visitanteGano ? 1 : 0.6 }}
                                                            >
                                                                {partido.equipoVisitante || "POR DEFINIR"}
                                                            </span>
                                                        </div>
                                                        <span
                                                            className="text-xs font-black"
                                                            style={{ color: visitanteGano ? "var(--ts)" : "var(--tp)" }}
                                                        >
                                                            {!partido.placeholder && partido.golesVisitante !== null ? partido.golesVisitante : "-"}
                                                        </span>
                                                    </div>

                                                    {!partido.placeholder && (
                                                        <div className="absolute right-0.5 top-1/2 -translate-y-1/2 flex items-center h-full pointer-events-none opacity-30">
                                                            <FaChevronDown size={7} style={{ color: "var(--ts)" }} className={`transition-transform ${detalleAbierto === partido.id ? 'rotate-180' : ''}`} />
                                                        </div>
                                                    )}

                                                    {/* DETALLES EXPANDIBLES */}
                                                    {detalleAbierto === partido.id && !partido.placeholder && (
                                                        <div
                                                            className="p-2 space-y-1.5 animate-in slide-in-from-top-1 duration-200"
                                                            style={{
                                                                backgroundColor: "var(--secondary)",
                                                                borderTop: borderSutil
                                                            }}
                                                        >
                                                            <div className="flex items-center gap-2" style={{ color: "var(--tp)" }}>
                                                                <FaCalendarAlt size={10} style={{ color: "var(--ts)" }} className="shrink-0" />
                                                                <span className="text-[9px] font-black uppercase tracking-wider">{partido.fecha || "PENDIENTE"}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2" style={{ color: "var(--tp)" }}>
                                                                <FaClock size={10} style={{ color: "var(--ts)" }} className="shrink-0" />
                                                                <span className="text-[9px] font-black uppercase tracking-wider">{partido.hora || "TBD"}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2" style={{ color: "var(--tp)" }}>
                                                                <FaMapMarkerAlt size={10} style={{ color: "var(--ts)" }} className="shrink-0" />
                                                                <span className="text-[9px] font-black uppercase tracking-wider">{partido.cancha || "SIN ASIGNAR"}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2" style={{ color: "var(--tp)" }}>
                                                                <FaUserTie size={10} style={{ color: "var(--ts)" }} className="shrink-0" />
                                                                <span className="text-[9px] font-black uppercase tracking-wider">{partido.arbitro || "SIN DESIGNAR"}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Copa en la final */}
                                                {esFinal && (
                                                    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
                                                        <div className="w-8 h-1 bg-yellow-500/20 blur-sm rounded-full mb-1"></div>
                                                        <FaTrophy className="text-yellow-500 text-3xl drop-shadow-[0_0_10px_rgba(234,179,8,0.5)] animate-pulse" />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}