import { useState } from "react";
import { FaShieldAlt, FaMapMarkerAlt, FaClock, FaCalendarAlt, FaUserTie } from "react-icons/fa";

export default function PartidoCard({ partido }) {
    const finalizado = partido.estado === "FINALIZADO";
    const [verFechaLarga, setVerFechaLarga] = useState(false);

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
            const diasLargo = ["DOMINGO", "LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO"];
            const meses = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];

            return {
                corto: `${dias[fecha.getDay()].toUpperCase()} ${day}`,
                largo: `${diasLargo[fecha.getDay()]} ${day} DE ${meses[fecha.getMonth()]} ${year}`
            };
        } catch (e) {
            return { corto: "ERROR", largo: "ERROR" };
        }
    };

    const fechaInfo = formatearFechaPro(partido.fecha);
    const formatDato = (dato) => (dato && dato !== "null" && dato !== "") ? dato : "---";
    const formatHora = (hora) => (hora && hora !== "null" && hora !== "") ? `${hora} HS` : "---";

    // --- BORDES MANUALES GRISES ---
    // Usamos un gris "Slate 700" (#334155) para que sea sutil pero visible
    const borderGray = "1px solid #334155";

    // Para las divisiones internas usamos un gris un poco más suave
    const dividerGray = "1px solid #334155";

    return (
        <div className="w-full transition-all duration-300 my-3">

            {/* --- VISTA CELULAR --- */}
            <div
                className="md:hidden rounded-2xl overflow-hidden shadow-lg"
                style={{
                    border: borderGray,
                    backgroundColor: "var(--p)"
                }}
            >
                {/* Bloque Equipos */}
                <div
                    className="px-4 py-5"
                    style={{ backgroundColor: "var(--secondary)" }}
                >
                    <div className="grid grid-cols-3 items-center">
                        <div className="flex flex-col items-center">
                            <div className="w-10 h-10 mb-2">
                                {partido.equipoLocalEscudo ?
                                    <img src={partido.equipoLocalEscudo} className="w-full h-full object-contain" alt="L" /> :
                                    <FaShieldAlt style={{ color: "var(--ts)" }} className="w-full h-full opacity-40" />
                                }
                            </div>
                            <span className="text-[10px] font-black uppercase text-center leading-tight line-clamp-2" style={{ color: "var(--tp)" }}>
                                {formatDato(partido.equipoLocalNombre)}
                            </span>
                        </div>

                        <div className="flex flex-col items-center justify-center">
                            <span className="text-xl font-black" style={{ color: "var(--tp)" }}>
                                {finalizado ? `${partido.golesLocal} - ${partido.golesVisitante}` : "VS"}
                            </span>
                            <div
                                className="w-8 h-1 mt-1 rounded-full"
                                style={{
                                    backgroundColor: finalizado ? "var(--ts)" : "var(--ts)33",
                                    boxShadow: finalizado ? "0 0 10px var(--ts)66" : "none"
                                }}
                            ></div>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="w-10 h-10 mb-2">
                                {partido.equipoVisitanteEscudo ?
                                    <img src={partido.equipoVisitanteEscudo} className="w-full h-full object-contain" alt="V" /> :
                                    <FaShieldAlt style={{ color: "var(--ts)" }} className="w-full h-full opacity-40" />
                                }
                            </div>
                            <span className="text-[10px] font-black uppercase text-center leading-tight line-clamp-2" style={{ color: "var(--tp)" }}>
                                {formatDato(partido.equipoVisitanteNombre)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Info Bar Móvil */}
                <div
                    className="grid grid-cols-2"
                    style={{
                        borderTop: dividerGray,
                        backgroundColor: "var(--p)"
                    }}
                >
                    <div className="p-2.5 flex items-center gap-2" style={{ borderRight: dividerGray, borderBottom: dividerGray }}>
                        <FaCalendarAlt size={10} style={{ color: "var(--ts)" }} />
                        <span className="text-[9px] uppercase tracking-tighter truncate" style={{ color: "var(--tp)", opacity: 0.8 }}>{fechaInfo.corto}</span>
                    </div>
                    <div className="p-2.5 flex items-center gap-2" style={{ borderBottom: dividerGray }}>
                        <FaClock size={10} style={{ color: "var(--ts)" }} />
                        <span className="text-[9px] uppercase tracking-tighter" style={{ color: "var(--tp)", opacity: 0.8 }}>{formatHora(partido.hora)}</span>
                    </div>
                    <div className="p-2.5 flex items-center gap-2" style={{ borderRight: dividerGray }}>
                        <FaMapMarkerAlt size={10} style={{ color: "var(--ts)" }} />
                        <span className="text-[9px] uppercase tracking-tighter truncate" style={{ color: "var(--tp)", opacity: 0.8 }}>{formatDato(partido.canchaNombre || partido.cancha)}</span>
                    </div>
                    <div className="p-2.5 flex items-center gap-2">
                        <FaUserTie size={10} style={{ color: "var(--ts)" }} />
                        <span className="text-[9px] uppercase tracking-tighter truncate" style={{ color: "var(--tp)", opacity: 0.8 }}>{formatDato(partido.arbitro)}</span>
                    </div>
                </div>
            </div>

            {/* --- VISTA PC --- */}
            <div
                className="hidden md:flex flex-col w-full rounded-3xl overflow-hidden transition-all duration-300"
                style={{
                    border: borderGray, // BORDE GRIS MANUAL
                    backgroundColor: "var(--secondary)",
                    boxShadow: finalizado ? "0 10px 40px -10px rgba(0,0,0,0.3)" : "none"
                }}
            >
                {/* Bloque Principal */}
                <div className="flex items-center justify-between px-10 py-6">
                    {/* Local */}
                    <div className="flex items-center gap-5 flex-1 justify-start">
                        <div
                            className="w-14 h-14 shrink-0 p-1 rounded-xl"
                            style={{ backgroundColor: "var(--p)" }}
                        >
                            {partido.equipoLocalEscudo ?
                                <img src={partido.equipoLocalEscudo} className="w-full h-full object-contain" alt="L" /> :
                                <FaShieldAlt style={{ color: "var(--ts)" }} className="w-full h-full opacity-40" />
                            }
                        </div>
                        <span className="text-xl font-black uppercase tracking-tighter" style={{ color: "var(--tp)" }}>
                            {formatDato(partido.equipoLocalNombre)}
                        </span>
                    </div>

                    {/* Centro */}
                    <div className="flex flex-col items-center px-10 w-[220px]">
                        <span
                            className="text-[9px] font-black uppercase tracking-[0.3em] mb-3 px-3 py-1 rounded-full border transition-all"
                            style={{
                                color: finalizado ? "var(--p)" : "var(--ts)",
                                backgroundColor: finalizado ? "var(--ts)" : "transparent",
                                borderColor: finalizado ? "var(--ts)" : "#334155" // Gris en pendiente
                            }}
                        >
                            {finalizado ? "FINALIZADO" : "PENDIENTE"}
                        </span>
                        <span className="text-4xl font-black tracking-tighter" style={{ color: "var(--tp)" }}>
                            {finalizado ? `${partido.golesLocal} - ${partido.golesVisitante}` : "VS"}
                        </span>
                    </div>

                    {/* Visitante */}
                    <div className="flex items-center gap-5 flex-1 justify-end">
                        <span className="text-xl font-black uppercase tracking-tighter text-right" style={{ color: "var(--tp)" }}>
                            {formatDato(partido.equipoVisitanteNombre)}
                        </span>
                        <div
                            className="w-14 h-14 shrink-0 p-1 rounded-xl"
                            style={{ backgroundColor: "var(--p)" }}
                        >
                            {partido.equipoVisitanteEscudo ?
                                <img src={partido.equipoVisitanteEscudo} className="w-full h-full object-contain" alt="V" /> :
                                <FaShieldAlt style={{ color: "var(--ts)" }} className="w-full h-full opacity-40" />
                            }
                        </div>
                    </div>
                </div>

                {/* Barra Inferior PC */}
                <div
                    className="flex items-center"
                    style={{
                        backgroundColor: "var(--p)",
                        borderTop: dividerGray
                    }}
                >
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
                        <span className="text-[11px] uppercase tracking-widest" style={{ color: "var(--tp)" }}>
                            {formatHora(partido.hora)}
                        </span>
                    </div>

                    <div className="flex-1 flex items-center justify-center gap-3 py-3.5 px-2" style={{ borderRight: dividerGray }}>
                        <FaMapMarkerAlt size={12} style={{ color: "var(--ts)" }} />
                        <span className="text-[11px] uppercase tracking-widest truncate" style={{ color: "var(--tp)" }}>
                            {formatDato(partido.canchaNombre || partido.cancha)}
                        </span>
                    </div>

                    <div className="flex-1 flex items-center justify-center gap-3 py-3.5 px-2">
                        <FaUserTie size={12} style={{ color: "var(--ts)" }} />
                        <span className="text-[11px] uppercase tracking-widest truncate" style={{ color: "var(--tp)" }}>
                            {formatDato(partido.arbitro)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}