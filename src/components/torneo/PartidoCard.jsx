import { useState } from "react";
import { FaShieldAlt, FaMapMarkerAlt, FaClock, FaCalendarAlt, FaUserTie } from "react-icons/fa";

export default function PartidoCard({ partido }) {
    const finalizado = partido.estado === "FINALIZADO";
    const [expandido, setExpandido] = useState(false);
    const [verFechaLarga, setVerFechaLarga] = useState(false); // Para PC

    // --- FORMATEO ---
    const formatearFechaPro = (fechaStr) => {
        if (!fechaStr || fechaStr === "null") {
            return {
                corto: finalizado ? "" : "---",
                largo: finalizado ? "SIN INFORMACIÓN" : "---"
            };
        }
        try {
            const [year, month, day] = fechaStr.split('-').map(Number);
            const fecha = new Date(year, month - 1, day);
            const dias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
            const diasLargo = ["DOMINGO", "LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO"];
            const meses = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];

            return {
                corto: `${dias[fecha.getDay()].toUpperCase()} ${day}`,
                largo: `${diasLargo[fecha.getDay()]} ${day} DE ${meses[fecha.getMonth()]} ${year}`
            };
        } catch (e) { return { corto: "ERROR", largo: "ERROR" }; }
    };

    const fechaInfo = formatearFechaPro(partido.fecha);
    const tieneDato = (d) => d && d !== "null" && d !== "";
    const formatDato = (dato) => tieneDato(dato) ? dato : "---";
    const formatHora = (hora) => tieneDato(hora) ? `${hora} HS` : "";

    const borderGray = "1px solid #33415588";
    const dividerGray = "1px solid #33415544";

    return (
        <div className="w-full transition-all duration-300 my-2">

            {/* ==============================================
                VISTA CELULAR
               ============================================== */}
            <div
                onClick={() => setExpandido(!expandido)}
                className="md:hidden rounded-xl overflow-hidden shadow-md transition-all active:scale-[0.98] cursor-pointer"
                style={{
                    border: borderGray,
                    backgroundColor: "var(--p)"
                }}
            >
                <div
                    className="px-2 py-2"
                    style={{ backgroundColor: "var(--secondary)" }}
                >
                    {/* Grid: 3 Columnas */}
                    <div className="grid grid-cols-[1fr_90px_1fr] items-center gap-1">

                        {/* --- LOCAL --- */}
                        <div className="flex flex-col items-center justify-start h-full gap-1">
                            <div className="w-9 h-9 flex items-center justify-center">
                                {partido.equipoLocalEscudo ?
                                    <img src={partido.equipoLocalEscudo} className="max-w-full max-h-full object-contain drop-shadow-sm" alt="L" /> :
                                    <FaShieldAlt style={{ color: "var(--ts)" }} className="text-xl opacity-40" />
                                }
                            </div>
                            <span className="text-[9px] font-black uppercase text-center leading-tight line-clamp-2 h-[22px] flex items-center justify-center w-full" style={{ color: "var(--tp)" }}>
                                {formatDato(partido.equipoLocalNombre)}
                            </span>
                        </div>

                        {/* --- CENTRO --- */}
                        <div className="flex flex-col items-center justify-center w-full relative gap-1">

                            {/* 1. FECHA Y HORA (Solo si NO está finalizado) */}
                            {!finalizado && (
                                <div className={`flex items-center justify-center gap-1 transition-all duration-300 ${expandido ? "flex-col" : "flex-row"}`}>
                                    {tieneDato(partido.fecha) && (
                                        <div className="px-1.5 py-px rounded border border-[var(--ts)]/30 bg-[var(--ts)]/10 flex items-center justify-center gap-1">
                                            <FaCalendarAlt size={8} className="text-[var(--ts)]" />
                                            <span className={`${expandido ? "text-[8px]" : "text-[7px]"} font-bold text-slate-300 uppercase whitespace-nowrap`}>
                                                {expandido ? fechaInfo.largo : fechaInfo.corto}
                                            </span>
                                        </div>
                                    )}
                                    {tieneDato(partido.hora) && (
                                        <div className="px-1.5 py-px rounded border border-[var(--ts)]/30 bg-[var(--ts)]/10 flex items-center justify-center gap-1">
                                            <FaClock size={8} className="text-[var(--ts)]" />
                                            <span className={`${expandido ? "text-[8px]" : "text-[7px]"} font-bold text-slate-300 uppercase whitespace-nowrap`}>
                                                {formatHora(partido.hora)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* 2. RESULTADO / VS */}
                            <span className="text-xl font-black tracking-tighter leading-none" style={{ color: "var(--tp)" }}>
                                {finalizado ? `${partido.golesLocal} - ${partido.golesVisitante}` : "-"}
                            </span>

                            {/* 3. ESTADO o CANCHA */}
                            {finalizado ? (
                                // Si finalizó: Solo muestra "FINALIZADO"
                                <span className="text-[6px] font-black mt-0.5 text-slate-400 uppercase tracking-widest border-t border-slate-700/50 pt-0.5">
                                    FINALIZADO
                                </span>
                            ) : (
                                // Si es pendiente: Muestra Cancha
                                tieneDato(partido.cancha || partido.canchaNombre) && (
                                    <div className="px-1.5 py-px rounded border border-[var(--ts)]/30 bg-[var(--ts)]/10 flex items-center justify-center max-w-full gap-1">
                                        <FaMapMarkerAlt size={8} className="text-[var(--ts)] shrink-0" />
                                        <span className="text-[7px] font-bold text-slate-300 uppercase truncate max-w-[80px]">
                                            {partido.canchaNombre || partido.cancha}
                                        </span>
                                    </div>
                                )
                            )}

                        </div>

                        {/* --- VISITANTE --- */}
                        <div className="flex flex-col items-center justify-start h-full gap-1">
                            <div className="w-9 h-9 flex items-center justify-center">
                                {partido.equipoVisitanteEscudo ?
                                    <img src={partido.equipoVisitanteEscudo} className="max-w-full max-h-full object-contain drop-shadow-sm" alt="V" /> :
                                    <FaShieldAlt style={{ color: "var(--ts)" }} className="text-xl opacity-40" />
                                }
                            </div>
                            <span className="text-[9px] font-black uppercase text-center leading-tight line-clamp-2 h-[22px] flex items-center justify-center w-full" style={{ color: "var(--tp)" }}>
                                {formatDato(partido.equipoVisitanteNombre)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* --- BARRA DESPLEGABLE (Datos Extra) --- */}
                {expandido && (
                    <div
                        className="flex flex-col animate-in slide-in-from-top-1 duration-200 py-2 gap-2"
                        style={{
                            borderTop: dividerGray,
                            backgroundColor: "var(--ts)05"
                        }}
                    >
                        {/* A. Si finalizó: Mostrar Fecha, Hora y Cancha aquí */}
                        {finalizado && (
                            <div className="flex flex-col gap-1.5 pb-1 border-b border-white/5">
                                {/* Fecha y Hora */}
                                {(tieneDato(partido.fecha) || tieneDato(partido.hora)) && (
                                    <div className="flex items-center justify-center gap-3">
                                        {tieneDato(partido.fecha) && (
                                            <div className="flex items-center gap-1 opacity-70">
                                                <FaCalendarAlt size={9} className="text-[var(--ts)]" />
                                                <span className="text-[8px] font-bold text-slate-300 uppercase">{fechaInfo.largo}</span>
                                            </div>
                                        )}
                                        {tieneDato(partido.hora) && (
                                            <div className="flex items-center gap-1 opacity-70">
                                                <FaClock size={9} className="text-[var(--ts)]" />
                                                <span className="text-[8px] font-bold text-slate-300 uppercase">{formatHora(partido.hora)}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {/* Cancha (que se ocultó arriba) */}
                                {tieneDato(partido.cancha || partido.canchaNombre) && (
                                    <div className="flex items-center justify-center gap-1 opacity-70">
                                        <FaMapMarkerAlt size={9} className="text-[var(--ts)]" />
                                        <span className="text-[8px] font-bold text-slate-300 uppercase truncate max-w-[200px]">
                                            {partido.canchaNombre || partido.cancha}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* B. Árbitro (Siempre visible al expandir) */}
                        <div className="flex items-center justify-center gap-1.5">
                            <FaUserTie size={9} style={{ color: "var(--ts)" }} />
                            <span className="text-[8px] font-bold uppercase tracking-wide text-slate-300">
                                Árbitro: {formatDato(partido.arbitro)}
                            </span>
                        </div>
                    </div>
                )}
            </div>


            {/* ==============================================
                VISTA PC (COMPLETA - SIN CAMBIOS)
               ============================================== */}
            <div
                className="hidden md:flex flex-col w-full rounded-3xl overflow-hidden transition-all duration-300"
                style={{
                    border: borderGray,
                    backgroundColor: "var(--secondary)",
                    boxShadow: finalizado ? "0 10px 40px -10px rgba(0,0,0,0.3)" : "none"
                }}
            >
                {/* Bloque Principal PC */}
                <div className="flex items-center justify-between px-10 py-6">
                    <div className="flex items-center gap-5 flex-1 justify-start">
                        <div className="w-14 h-14 shrink-0 p-1 rounded-xl" style={{ backgroundColor: "var(--p)" }}>
                            {partido.equipoLocalEscudo ?
                                <img src={partido.equipoLocalEscudo} className="w-full h-full object-contain" alt="L" /> :
                                <FaShieldAlt style={{ color: "var(--ts)" }} className="w-full h-full opacity-40" />
                            }
                        </div>
                        <span className="text-xl font-black uppercase tracking-tighter" style={{ color: "var(--tp)" }}>
                            {formatDato(partido.equipoLocalNombre)}
                        </span>
                    </div>

                    <div className="flex flex-col items-center px-10 w-[220px]">
                        <span
                            className="text-[9px] font-black uppercase tracking-[0.3em] mb-3 px-3 py-1 rounded-full border transition-all"
                            style={{
                                color: finalizado ? "var(--p)" : "var(--ts)",
                                backgroundColor: finalizado ? "var(--ts)" : "transparent",
                                borderColor: finalizado ? "var(--ts)" : "#334155"
                            }}
                        >
                            {finalizado ? "FINALIZADO" : "PENDIENTE"}
                        </span>
                        <span className="text-4xl font-black tracking-tighter" style={{ color: "var(--tp)" }}>
                            {finalizado ? `${partido.golesLocal} - ${partido.golesVisitante}` : "VS"}
                        </span>
                    </div>

                    <div className="flex items-center gap-5 flex-1 justify-end">
                        <span className="text-xl font-black uppercase tracking-tighter text-right" style={{ color: "var(--tp)" }}>
                            {formatDato(partido.equipoVisitanteNombre)}
                        </span>
                        <div className="w-14 h-14 shrink-0 p-1 rounded-xl" style={{ backgroundColor: "var(--p)" }}>
                            {partido.equipoVisitanteEscudo ?
                                <img src={partido.equipoVisitanteEscudo} className="w-full h-full object-contain" alt="V" /> :
                                <FaShieldAlt style={{ color: "var(--ts)" }} className="w-full h-full opacity-40" />
                            }
                        </div>
                    </div>
                </div>

                {/* Barra Inferior PC */}
                <div className="flex items-center" style={{ backgroundColor: "var(--p)", borderTop: dividerGray }}>
                    <div
                        className="flex-1 flex items-center justify-center gap-3 py-3.5 cursor-pointer transition-colors"
                        onMouseEnter={() => setVerFechaLarga(true)}
                        onMouseLeave={() => setVerFechaLarga(false)}
                        style={{ borderRight: dividerGray, ":hover": { backgroundColor: "var(--ts)05" } }}
                    >
                        <FaCalendarAlt size={12} style={{ color: "var(--ts)" }} />
                        <span className="text-[11px] uppercase tracking-widest" style={{ color: "var(--tp)" }}>
                            {verFechaLarga ? fechaInfo.largo : fechaInfo.corto}
                        </span>
                    </div>
                    <div className="flex-1 flex items-center justify-center gap-3 py-3.5" style={{ borderRight: dividerGray }}>
                        <FaClock size={12} style={{ color: "var(--ts)" }} />
                        <span className="text-[11px] uppercase tracking-widest" style={{ color: "var(--tp)" }}>{formatHora(partido.hora)}</span>
                    </div>
                    <div className="flex-1 flex items-center justify-center gap-3 py-3.5 px-2" style={{ borderRight: dividerGray }}>
                        <FaMapMarkerAlt size={12} style={{ color: "var(--ts)" }} />
                        <span className="text-[11px] uppercase tracking-widest truncate" style={{ color: "var(--tp)" }}>{formatDato(partido.canchaNombre || partido.cancha)}</span>
                    </div>
                    <div className="flex-1 flex items-center justify-center gap-3 py-3.5 px-2">
                        <FaUserTie size={12} style={{ color: "var(--ts)" }} />
                        <span className="text-[11px] uppercase tracking-widest truncate" style={{ color: "var(--tp)" }}>{formatDato(partido.arbitro)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}