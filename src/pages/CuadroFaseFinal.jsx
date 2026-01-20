import { useState, useEffect } from "react";
import { apiFetch } from "../api/api";
import {
    FaSync, FaCalendarAlt,
    FaMapMarkerAlt, FaUserTie, FaChevronDown, FaClock, FaTrophy
} from "react-icons/fa";

export default function CuadroFaseFinal({ torneoId, fallback }) {
    const [etapasOriginales, setEtapasOriginales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [detalleAbierto, setDetalleAbierto] = useState(null);

    // Borde muy sutil, casi invisible para que parezca una lista limpia
    const borderCard = "1px solid var(--ts)33";
    const borderDivider = "1px solid var(--ts)10";

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

    const toggleDetalle = (e, id) => {
        e.stopPropagation();
        setDetalleAbierto(detalleAbierto === id ? null : id);
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-10 gap-2">
            <FaSync className="animate-spin text-xl" style={{ color: "var(--ts)" }} />
            <span className="text-[10px] font-medium uppercase tracking-widest" style={{ color: "var(--ts)" }}>Cargando...</span>
        </div>
    );

    if (etapasVisuales.length === 0) {
        return fallback || null;
    }

    return (
        /* CONTENEDOR PRINCIPAL:
           - overflow-auto: Permite scroll vertical y horizontal nativo.
           - max-h-[80vh]: Limita la altura para que scrollee dentro de la pantalla si es muy alto.
        */
        <div
            className="mt-2 mb-6 p-2 rounded-xl backdrop-blur-sm shadow-xl overflow-auto custom-scrollbar touch-pan-x touch-pan-y"
            style={{
                border: borderCard,
                backgroundColor: "var(--secondary)",
                maxHeight: "80vh" // Altura máxima para permitir scroll vertical
            }}
        >
            <div className="min-w-max pb-10"> {/* min-w-max asegura que no se apriete horizontalmente */}
                <div className="flex flex-row justify-center gap-2 px-1 pt-2">
                    {etapasVisuales.map((etapa, idx) => {
                        if (!etapa) return null;
                        const esFinal = etapa.orden === 1;
                        const partidos = esFinal ? etapa.partidos : etapa.partidosVisuales;

                        return (
                            // Ancho reducido para que entren más columnas en pantalla (160px)
                            <div key={`${etapa.id}-${idx}`} className="flex flex-col w-[160px] md:w-[190px] relative">

                                {/* TÍTULO ETAPA COMPACTO */}
                                <div className="text-center mb-2 sticky top-0 z-30">
                                    <span
                                        className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide shadow-sm backdrop-blur-md"
                                        style={esFinal ? {
                                            backgroundColor: "#ca8a0422",
                                            border: "1px solid #eab308",
                                            color: "#eab308"
                                        } : {
                                            backgroundColor: "var(--secondary)", // Fondo sólido para que tape al scrollear
                                            border: borderCard,
                                            color: "var(--ts)"
                                        }}
                                    >
                                        {etapa.nombre}
                                    </span>
                                </div>

                                <div className="flex flex-col justify-around flex-grow relative gap-1">
                                    {partidos.map((partido) => {
                                        const hayGanador = partido.ganadorId !== null && partido.ganadorId !== undefined;
                                        const localGano = hayGanador && Number(partido.ganadorId) === Number(partido.equipoLocalId);
                                        const visitanteGano = hayGanador && Number(partido.ganadorId) === Number(partido.equipoVisitanteId);

                                        return (
                                            <div key={partido.id} className="relative py-1 px-0.5 flex items-center justify-center">

                                                <div
                                                    onClick={(e) => !partido.placeholder && toggleDetalle(e, partido.id)}
                                                    className={`w-full rounded-[4px] overflow-hidden transition-all relative z-10 ${!partido.placeholder ? 'cursor-pointer active:opacity-80' : ''}`}
                                                    style={{
                                                        backgroundColor: "var(--p)",
                                                        // Borde muy fino o nulo si prefieres estilo "lista"
                                                        border: partido.placeholder ? "1px dashed var(--ts)22" : borderCard,
                                                        opacity: partido.placeholder ? 0.2 : 1,
                                                        borderColor: esFinal && !partido.placeholder ? "#eab308" : undefined,
                                                    }}
                                                >
                                                    {/* LOCAL: Padding ultra reducido (py-1 px-1.5) */}
                                                    <div
                                                        className="flex justify-between items-center py-1 px-1.5"
                                                        style={{
                                                            borderBottom: borderDivider,
                                                            // Fondo sutil si ganó, verde si quieres estilo promiedos, o del tema
                                                            backgroundColor: localGano ? "var(--ts)15" : "transparent"
                                                        }}
                                                    >
                                                        <div className="flex items-center gap-1.5 overflow-hidden">
                                                            {partido.equipoLocalEscudo &&
                                                                <img src={partido.equipoLocalEscudo} className="w-3.5 h-3.5 object-contain" alt="" />
                                                            }
                                                            {/* NOMBRE: Sin negrita (font-medium) y texto chico */}
                                                            <span
                                                                className="text-[9px] font-medium uppercase truncate max-w-[90px]"
                                                                style={{ color: localGano ? "var(--ts)" : "var(--tp)", opacity: localGano ? 1 : 0.8 }}
                                                            >
                                                                {partido.equipoLocal || "A DEFINIR"}
                                                            </span>
                                                        </div>
                                                        <span className="text-[9px] font-bold ml-1" style={{ color: "var(--tp)" }}>
                                                            {!partido.placeholder && partido.golesLocal !== null ? partido.golesLocal : ""}
                                                        </span>
                                                    </div>

                                                    {/* VISITANTE */}
                                                    <div
                                                        className="flex justify-between items-center py-1 px-1.5"
                                                        style={{
                                                            backgroundColor: visitanteGano ? "var(--ts)15" : "transparent"
                                                        }}
                                                    >
                                                        <div className="flex items-center gap-1.5 overflow-hidden">
                                                            {partido.equipoVisitanteEscudo &&
                                                                <img src={partido.equipoVisitanteEscudo} className="w-3.5 h-3.5 object-contain" alt="" />
                                                            }
                                                            <span
                                                                className="text-[9px] font-medium uppercase truncate max-w-[90px]"
                                                                style={{ color: visitanteGano ? "var(--ts)" : "var(--tp)", opacity: visitanteGano ? 1 : 0.8 }}
                                                            >
                                                                {partido.equipoVisitante || "A DEFINIR"}
                                                            </span>
                                                        </div>
                                                        <span className="text-[9px] font-bold ml-1" style={{ color: "var(--tp)" }}>
                                                            {!partido.placeholder && partido.golesVisitante !== null ? partido.golesVisitante : ""}
                                                        </span>
                                                    </div>

                                                    {/* Flechita muy sutil */}
                                                    {!partido.placeholder && (
                                                        <div className="absolute right-0.5 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
                                                            <FaChevronDown size={6} style={{ color: "var(--ts)" }} className={`transition-transform ${detalleAbierto === partido.id ? 'rotate-180' : ''}`} />
                                                        </div>
                                                    )}

                                                    {/* DETALLES EXPANDIBLES COMPACTOS */}
                                                    {detalleAbierto === partido.id && !partido.placeholder && (
                                                        <div
                                                            className="px-2 py-1.5 space-y-1 animate-in slide-in-from-top-1 duration-150"
                                                            style={{
                                                                backgroundColor: "var(--secondary)",
                                                                borderTop: borderDivider
                                                            }}
                                                        >
                                                            <div className="flex items-center gap-1.5 text-[8px] opacity-70" style={{ color: "var(--tp)" }}>
                                                                <FaCalendarAlt size={8} /> <span>{partido.fecha || "A CONFIRMAR"}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 text-[8px] opacity-70" style={{ color: "var(--tp)" }}>
                                                                <FaClock size={8} /> <span>{partido.hora ? `${partido.hora} HS` : "A CONFIRMAR"}</span>
                                                            </div>
                                                            {(partido.cancha) &&
                                                                <div className="flex items-center gap-1.5 text-[8px] opacity-70 truncate" style={{ color: "var(--tp)" }}>
                                                                    <FaMapMarkerAlt size={8} /> <span className="truncate">{partido.cancha}</span>
                                                                </div>
                                                            }
                                                        </div>
                                                    )}
                                                </div>

                                                {esFinal && (
                                                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 pointer-events-none z-0">
                                                        <FaTrophy className="text-yellow-500 text-xl drop-shadow-md opacity-80" />
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