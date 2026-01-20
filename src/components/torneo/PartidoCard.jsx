import { useState } from "react";
import { FaShieldAlt, FaMapMarkerAlt, FaClock, FaCalendarAlt, FaUserTie } from "react-icons/fa";

export default function PartidoCard({ partido }) {
    const finalizado = partido.estado === "FINALIZADO";

    // Estado para expandir la tarjeta en celular
    const [expandido, setExpandido] = useState(false);

    // --- FORMATEO ---
    const formatearFechaPro = (fechaStr) => {
        if (!fechaStr || fechaStr === "null") {
            return {
                corto: finalizado ? "SIN INFO" : "---",
                largo: finalizado ? "SIN INFORMACIÓN" : "---"
            };
        }
        try {
            const [year, month, day] = fechaStr.split('-').map(Number);
            const fecha = new Date(year, month - 1, day);
            const dias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
            return {
                corto: `${dias[fecha.getDay()].toUpperCase()} ${day}`
            };
        } catch (e) { return { corto: "ERROR" }; }
    };

    const fechaInfo = formatearFechaPro(partido.fecha);

    const tieneDato = (d) => d && d !== "null" && d !== "";
    const formatDato = (dato) => tieneDato(dato) ? dato : "---";
    const formatHora = (hora) => tieneDato(hora) ? `${hora} HS` : "---";

    // ¿Tiene la info básica completa?
    const tieneInfoBasica = tieneDato(partido.fecha) && tieneDato(partido.hora) && (tieneDato(partido.cancha) || tieneDato(partido.canchaNombre));

    /* LÓGICA DE VISIBILIDAD:
       1. Si está EXPANDIDO (click del usuario) -> Mostrar SIEMPRE.
       2. Si NO está expandido:
          - Si está FINALIZADO -> NO mostrar (oculto por defecto).
          - Si es PENDIENTE y tiene info -> Mostrar.
          - Si es PENDIENTE y falta info -> NO mostrar.
    */
    const mostrarBarraInfo = expandido || (!finalizado && tieneInfoBasica);

    const borderGray = "1px solid #33415588";
    const dividerGray = "1px solid #33415544";

    return (
        <div className="w-full transition-all duration-300 my-3">

            {/* ==============================================
                VISTA CELULAR (Lógica Personalizada)
               ============================================== */}
            <div
                onClick={() => setExpandido(!expandido)}
                className="md:hidden rounded-2xl overflow-hidden shadow-lg transition-all active:scale-[0.98] cursor-pointer"
                style={{
                    border: borderGray,
                    backgroundColor: "var(--p)"
                }}
            >
                {/* Bloque Equipos (Siempre visible) */}
                <div
                    className="px-4 py-5"
                    style={{ backgroundColor: "var(--secondary)" }}
                >
                    <div className="grid grid-cols-3 items-center">
                        {/* Local */}
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 mb-2">
                                {partido.equipoLocalEscudo ?
                                    <img src={partido.equipoLocalEscudo} className="w-full h-full object-contain drop-shadow-md" alt="L" /> :
                                    <FaShieldAlt style={{ color: "var(--ts)" }} className="w-full h-full opacity-40" />
                                }
                            </div>
                            <span className="text-[10px] font-black uppercase text-center leading-tight line-clamp-2" style={{ color: "var(--tp)" }}>
                                {formatDato(partido.equipoLocalNombre)}
                            </span>
                        </div>

                        {/* VS / Resultado */}
                        <div className="flex flex-col items-center justify-center">
                            <span className="text-2xl font-black italic tracking-tighter" style={{ color: "var(--tp)" }}>
                                {finalizado ? `${partido.golesLocal} - ${partido.golesVisitante}` : "VS"}
                            </span>
                            {/* Indicador visual pequeño si hay info oculta (Finalizado o Pendiente sin datos) */}

                            {finalizado && (
                                <span className="text-[8px] font-bold mt-1 px-2 py-0.5 rounded border border-white/20 text-white/50">FINAL</span>
                            )}
                        </div>

                        {/* Visitante */}
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 mb-2">
                                {partido.equipoVisitanteEscudo ?
                                    <img src={partido.equipoVisitanteEscudo} className="w-full h-full object-contain drop-shadow-md" alt="V" /> :
                                    <FaShieldAlt style={{ color: "var(--ts)" }} className="w-full h-full opacity-40" />
                                }
                            </div>
                            <span className="text-[10px] font-black uppercase text-center leading-tight line-clamp-2" style={{ color: "var(--tp)" }}>
                                {formatDato(partido.equipoVisitanteNombre)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* INFO BAR MÓVIL (Condicional) */}
                {mostrarBarraInfo && (
                    <div
                        className="flex flex-col animate-in slide-in-from-top-2 duration-300"
                        style={{
                            borderTop: dividerGray,
                            backgroundColor: "var(--p)"
                        }}
                    >
                        {/* FILA 1: Fecha - Hora - Cancha (3 Columnas) */}
                        <div className="grid grid-cols-3">
                            <div className="py-2.5 flex items-center justify-center gap-1.5" style={{ borderRight: dividerGray }}>
                                <FaCalendarAlt size={10} style={{ color: "var(--ts)" }} />
                                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-300 truncate">
                                    {fechaInfo.corto}
                                </span>
                            </div>

                            <div className="py-2.5 flex items-center justify-center gap-1.5" style={{ borderRight: dividerGray }}>
                                <FaClock size={10} style={{ color: "var(--ts)" }} />
                                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-300 truncate">
                                    {formatHora(partido.hora)}
                                </span>
                            </div>

                            <div className="py-2.5 flex items-center justify-center gap-1.5 px-1">
                                <FaMapMarkerAlt size={10} style={{ color: "var(--ts)" }} />
                                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-300 truncate max-w-[80px]">
                                    {formatDato(partido.canchaNombre || partido.cancha)}
                                </span>
                            </div>
                        </div>

                        {/* FILA 2: Árbitro (Solo si está expandido, abajo de todo, ancho completo) */}
                        {expandido && (
                            <div
                                className="py-2 flex items-center justify-center gap-2 animate-in fade-in zoom-in-95 duration-200"
                                style={{
                                    borderTop: dividerGray,
                                    backgroundColor: "var(--ts)05" // Un fondo muy sutil para diferenciarlo
                                }}
                            >
                                <FaUserTie size={10} style={{ color: "var(--ts)" }} />
                                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-300">
                                    Árbitro: {formatDato(partido.arbitro)}
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* --- VISTA PC (Sin cambios, completa) --- */}
            <div
                className="hidden md:flex flex-col w-full rounded-3xl overflow-hidden transition-all duration-300"
                style={{
                    border: borderGray,
                    backgroundColor: "var(--secondary)",
                    boxShadow: finalizado ? "0 10px 40px -10px rgba(0,0,0,0.3)" : "none"
                }}
            >
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

                <div className="flex items-center" style={{ backgroundColor: "var(--p)", borderTop: dividerGray }}>
                    <div className="flex-1 flex items-center justify-center gap-3 py-3.5" style={{ borderRight: dividerGray }}>
                        <FaCalendarAlt size={12} style={{ color: "var(--ts)" }} />
                        <span className="text-[11px] uppercase tracking-widest" style={{ color: "var(--tp)" }}>{fechaInfo.corto}</span>
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