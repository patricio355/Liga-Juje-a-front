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
            <FaSync className="text-blue-500 animate-spin text-xl" />
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Sincronizando Cuadro</span>
        </div>
    );

    return (
        <div className="mt-2 mb-6 p-2 md:p-4 bg-[#050814]/60 border border-blue-900/30 rounded-xl backdrop-blur-sm shadow-xl overflow-hidden">
            <div
                ref={scrollRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                className={`w-full overflow-x-auto custom-scrollbar select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            >
                {/* Eliminado pt-12 y py-6 para pegar los nombres al borde superior */}
                <div className="flex flex-row justify-start md:justify-center gap-0 min-w-max px-1 pb-16">
                    {etapasVisuales.map((etapa, idx) => {
                        if (!etapa) return null;
                        const esFinal = etapa.orden === 1;
                        const partidos = esFinal ? etapa.partidos : etapa.partidosVisuales;

                        return (
                            <div key={`${etapa.id}-${idx}`} className="flex flex-col w-[210px] relative">
                                {/* Eliminado mb-6 para reducir espacio bajo el nombre de etapa */}
                                <div className="text-center pt-2 mb-2">
                                    <span className={`border px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-md ${esFinal ? 'bg-yellow-600/20 border-yellow-500 text-yellow-500' : 'bg-[#0e1630] border-blue-500/30 text-blue-400'}`}>
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
                                                    className={`w-full bg-[#0a0f1e] border rounded-lg overflow-hidden shadow-lg transition-all relative z-10
                                                        ${partido.placeholder ? 'border-blue-900/20 opacity-30' : 'border-blue-500/30 cursor-pointer'}
                                                        ${esFinal ? 'border-yellow-500/50 shadow-yellow-500/10' : ''}`}
                                                >
                                                    {/* Equipo Local */}
                                                    <div className="flex justify-between items-center p-2 border-b border-blue-900/20">
                                                        <div className="flex items-center gap-2 overflow-hidden">
                                                            {partido.equipoLocalEscudo && <img src={partido.equipoLocalEscudo} className="w-4 h-4 object-contain" alt="" />}
                                                            <span className={`text-[10px] font-black uppercase truncate max-w-[110px] ${localGano ? 'text-emerald-400/80' : 'text-slate-400'}`}>
                                                                {partido.equipoLocal || "POR DEFINIR"}
                                                            </span>
                                                        </div>
                                                        <span className={`text-xs font-black ${localGano ? 'text-emerald-400/80' : 'text-white'}`}>
                                                            {!partido.placeholder && partido.golesLocal !== null ? partido.golesLocal : "-"}
                                                        </span>
                                                    </div>

                                                    {/* Equipo Visitante */}
                                                    <div className="flex justify-between items-center p-2">
                                                        <div className="flex items-center gap-2 overflow-hidden">
                                                            {partido.equipoVisitanteEscudo && <img src={partido.equipoVisitanteEscudo} className="w-4 h-4 object-contain" alt="" />}
                                                            <span className={`text-[10px] font-black uppercase truncate max-w-[110px] ${visitanteGano ? 'text-emerald-400/80' : 'text-slate-400'}`}>
                                                                {partido.equipoVisitante || "POR DEFINIR"}
                                                            </span>
                                                        </div>
                                                        <span className={`text-xs font-black ${visitanteGano ? 'text-emerald-400/80' : 'text-white'}`}>
                                                            {!partido.placeholder && partido.golesVisitante !== null ? partido.golesVisitante : "-"}
                                                        </span>
                                                    </div>

                                                    {!partido.placeholder && (
                                                        <div className="absolute right-0.5 top-1/2 -translate-y-1/2 flex items-center h-full pointer-events-none opacity-30">
                                                            <FaChevronDown size={7} className={`text-blue-500 transition-transform ${detalleAbierto === partido.id ? 'rotate-180' : ''}`} />
                                                        </div>
                                                    )}

                                                    {detalleAbierto === partido.id && !partido.placeholder && (
                                                        <div className="bg-[#050814] border-t border-blue-900/40 p-2 space-y-1.5 animate-in slide-in-from-top-1 duration-200">
                                                            <div className="flex items-center gap-2 text-white">
                                                                <FaCalendarAlt size={10} className="text-blue-500 shrink-0" />
                                                                <span className="text-[9px] font-black uppercase tracking-wider">{partido.fecha || "PENDIENTE"}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-white">
                                                                <FaClock size={10} className="text-blue-500 shrink-0" />
                                                                <span className="text-[9px] font-black uppercase tracking-wider">{partido.hora || "TBD"}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-white">
                                                                <FaMapMarkerAlt size={10} className="text-blue-500 shrink-0" />
                                                                <span className="text-[9px] font-black uppercase tracking-wider">{partido.cancha || "SIN ASIGNAR"}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-white">
                                                                <FaUserTie size={10} className="text-blue-500 shrink-0" />
                                                                <span className="text-[9px] font-black uppercase tracking-wider">{partido.arbitro || "SIN DESIGNAR"}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Copa posicionada FIJA debajo del partido final */}
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