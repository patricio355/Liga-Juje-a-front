import { useState, useEffect, useRef } from "react";
import { apiFetch } from "../api/api";
import {
    FaSync, FaCalendarAlt,
    FaMapMarkerAlt, FaUserTie, FaChevronDown, FaClock, FaTrophy
} from "react-icons/fa";

export default function CuadroFaseFinal({ torneoId, fallback }) {
    const [etapasOriginales, setEtapasOriginales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [detalleAbierto, setDetalleAbierto] = useState(null);

    // Referencias para el arrastre (Drag to Scroll)
    const scrollRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    // --- VARIABLES DE ESTILO ---
    const borderCard = "1px solid var(--ts)44";
    const borderDivider = "1px solid var(--ts)15";

    useEffect(() => {
        const cargarCuadro = async () => {
            try {
                setLoading(true);
                const data = await apiFetch(`/api/torneos/${torneoId}/cuadro-completo`);
                if (!data || data.length === 0) {
                    setEtapasOriginales([]);
                } else {
                    setEtapasOriginales(data.sort((a, b) => b.orden - a.orden));
                }
            } catch (error) {
                console.error("Error al cargar cuadro final:", error);
                setEtapasOriginales([]);
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

        if (!otrasEtapas.length && final) return [final];

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

        return final ? [...etapasIzquierda, final, ...etapasDerecha] : [];
    };

    const etapasVisuales = organizarEtapasEspejo();

    // --- LÓGICA DE ARRASTRE (DRAG) ---
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };
    const handleMouseLeave = () => setIsDragging(false);
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = (e) => {
        if (!isDragging) return;
        // IMPORTANTE: No usamos e.preventDefault() aquí para no bloquear el touch nativo
        // en algunos navegadores híbridos, pero para mouse puro funciona perfecto.
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 1.5; // Velocidad de arrastre
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    const toggleDetalle = (e, id) => {
        // Evitamos que se abra el detalle si se estaba arrastrando
        if (isDragging) return;
        e.stopPropagation();
        setDetalleAbierto(detalleAbierto === id ? null : id);
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-10 gap-2">
            <FaSync className="animate-spin text-xl" style={{ color: "var(--ts)" }} />
            <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: "var(--ts)" }}>Sincronizando Cuadro</span>
        </div>
    );

    if (etapasVisuales.length === 0) {
        return fallback || null;
    }

    return (
        /* CONTENEDOR PRINCIPAL */
        <div
            className="mt-2 mb-6 p-2 md:p-4 rounded-xl backdrop-blur-sm shadow-xl overflow-hidden"
            style={{
                border: borderCard,
                backgroundColor: "var(--secondary)"
            }}
        >
            <div
                ref={scrollRef}
                /* Eventos de Mouse para PC */
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}

                /* Clases clave para scroll:
                   - overflow-x-auto: Scroll nativo (Celular)
                   - cursor-grab: Icono de manito (PC)
                   - touch-pan-x: Mejora la respuesta táctil horizontal
                   - select-none: Evita que se seleccione texto al arrastrar
                */
                className={`w-full overflow-x-auto custom-scrollbar select-none touch-pan-x ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            >
                <div className="flex flex-row justify-start md:justify-center gap-0 min-w-max px-1 pb-16 pt-4">
                    {etapasVisuales.map((etapa, idx) => {
                        if (!etapa) return null;
                        const esFinal = etapa.orden === 1;
                        const partidos = esFinal ? etapa.partidos : etapa.partidosVisuales;

                        return (
                            <div key={`${etapa.id}-${idx}`} className="flex flex-col w-[210px] relative">
                                {/* NOMBRE DE LA ETAPA */}
                                <div className="text-center mb-4 relative z-20">
                                    <span
                                        className="border px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg"
                                        style={esFinal ? {
                                            backgroundColor: "#ca8a0422",
                                            borderColor: "#eab308",
                                            color: "#eab308",
                                            boxShadow: "0 0 15px rgba(234,179,8,0.2)"
                                        } : {
                                            backgroundColor: "var(--p)",
                                            border: borderCard,
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
                                            <div key={partido.id} className="relative py-3 px-2 flex items-center justify-center">

                                                <div
                                                    // Usamos onMouseUp para el click en PC para evitar conflictos con el arrastre
                                                    onClick={(e) => {
                                                        // Pequeña validación para diferenciar clic de arrastre
                                                        if (!isDragging && !partido.placeholder) toggleDetalle(e, partido.id);
                                                    }}
                                                    className={`w-full rounded-xl overflow-hidden shadow-lg transition-all relative z-10 ${!partido.placeholder ? 'hover:scale-[1.02] active:scale-95' : ''}`}
                                                    style={{
                                                        backgroundColor: "var(--p)",
                                                        border: partido.placeholder ? "1px dashed var(--ts)22" : borderCard,
                                                        opacity: partido.placeholder ? 0.3 : 1,
                                                        borderColor: esFinal && !partido.placeholder ? "#eab308" : undefined,
                                                        boxShadow: !partido.placeholder ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)" : "none",
                                                        cursor: !partido.placeholder ? "pointer" : "default"
                                                    }}
                                                >
                                                    {/* Equipo Local */}
                                                    <div
                                                        className="flex justify-between items-center p-2.5 transition-colors"
                                                        style={{
                                                            borderBottom: borderDivider,
                                                            backgroundColor: localGano ? "var(--ts)10" : "transparent"
                                                        }}
                                                    >
                                                        <div className="flex items-center gap-2 overflow-hidden">
                                                            {partido.equipoLocalEscudo ?
                                                                <img src={partido.equipoLocalEscudo} className="w-5 h-5 object-contain drop-shadow-sm" alt="" /> :
                                                                !partido.placeholder && <div className="w-5 h-5 rounded-full bg-white/5"></div>
                                                            }
                                                            <span
                                                                className="text-[10px] font-black uppercase truncate max-w-[110px]"
                                                                style={{ color: localGano ? "var(--ts)" : "var(--tp)", opacity: localGano ? 1 : 0.7 }}
                                                            >
                                                                {partido.equipoLocal || "A DEFINIR"}
                                                            </span>
                                                        </div>
                                                        <span
                                                            className="text-xs font-black ml-2"
                                                            style={{ color: localGano ? "var(--ts)" : "var(--tp)" }}
                                                        >
                                                            {!partido.placeholder && partido.golesLocal !== null ? partido.golesLocal : ""}
                                                        </span>
                                                    </div>

                                                    {/* Equipo Visitante */}
                                                    <div
                                                        className="flex justify-between items-center p-2.5 transition-colors"
                                                        style={{
                                                            backgroundColor: visitanteGano ? "var(--ts)10" : "transparent"
                                                        }}
                                                    >
                                                        <div className="flex items-center gap-2 overflow-hidden">
                                                            {partido.equipoVisitanteEscudo ?
                                                                <img src={partido.equipoVisitanteEscudo} className="w-5 h-5 object-contain drop-shadow-sm" alt="" /> :
                                                                !partido.placeholder && <div className="w-5 h-5 rounded-full bg-white/5"></div>
                                                            }
                                                            <span
                                                                className="text-[10px] font-black uppercase truncate max-w-[110px]"
                                                                style={{ color: visitanteGano ? "var(--ts)" : "var(--tp)", opacity: visitanteGano ? 1 : 0.7 }}
                                                            >
                                                                {partido.equipoVisitante || "A DEFINIR"}
                                                            </span>
                                                        </div>
                                                        <span
                                                            className="text-xs font-black ml-2"
                                                            style={{ color: visitanteGano ? "var(--ts)" : "var(--tp)" }}
                                                        >
                                                            {!partido.placeholder && partido.golesVisitante !== null ? partido.golesVisitante : ""}
                                                        </span>
                                                    </div>

                                                    {!partido.placeholder && (
                                                        <div className="absolute right-0.5 top-1/2 -translate-y-1/2 flex items-center h-full pointer-events-none opacity-40">
                                                            <FaChevronDown size={8} style={{ color: "var(--ts)" }} className={`transition-transform duration-300 ${detalleAbierto === partido.id ? 'rotate-180' : ''}`} />
                                                        </div>
                                                    )}

                                                    {/* DETALLES EXPANDIBLES */}
                                                    {detalleAbierto === partido.id && !partido.placeholder && (
                                                        <div
                                                            className="p-3 space-y-2 animate-in slide-in-from-top-2 duration-200"
                                                            style={{
                                                                backgroundColor: "var(--secondary)",
                                                                borderTop: borderDivider
                                                            }}
                                                        >
                                                            <div className="flex items-center gap-2" style={{ color: "var(--tp)" }}>
                                                                <FaCalendarAlt size={10} style={{ color: "var(--ts)" }} className="shrink-0" />
                                                                <span className="text-[9px] font-black uppercase tracking-wider opacity-80">{partido.fecha || "FECHA PENDIENTE"}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2" style={{ color: "var(--tp)" }}>
                                                                <FaClock size={10} style={{ color: "var(--ts)" }} className="shrink-0" />
                                                                <span className="text-[9px] font-black uppercase tracking-wider opacity-80">{partido.hora ? `${partido.hora} HS` : "HORA PENDIENTE"}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2" style={{ color: "var(--tp)" }}>
                                                                <FaMapMarkerAlt size={10} style={{ color: "var(--ts)" }} className="shrink-0" />
                                                                <span className="text-[9px] font-black uppercase tracking-wider opacity-80 truncate">{partido.cancha || "CANCHA PENDIENTE"}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2" style={{ color: "var(--tp)" }}>
                                                                <FaUserTie size={10} style={{ color: "var(--ts)" }} className="shrink-0" />
                                                                <span className="text-[9px] font-black uppercase tracking-wider opacity-80 truncate">{partido.arbitro || "ÁRBITRO PENDIENTE"}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {esFinal && (
                                                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-0">
                                                        <div className="w-12 h-12 rounded-full bg-yellow-500/10 blur-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                                                        <FaTrophy className="text-yellow-500 text-3xl drop-shadow-[0_0_15px_rgba(234,179,8,0.6)] animate-pulse" />
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