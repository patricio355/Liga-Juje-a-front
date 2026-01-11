import { useState } from "react";
import { FaShieldAlt, FaMapMarkerAlt, FaClock, FaCalendarAlt, FaUserTie, FaInfoCircle } from "react-icons/fa";

export default function PartidoCard({ partido }) {
    const finalizado = partido.estado === "FINALIZADO";
    const [verFechaLarga, setVerFechaLarga] = useState(false);

    // Función para formatear fechas de "YYYY-MM-DD" a los dos estilos requeridos
    const formatearFechaPro = (fechaStr) => {
        if (!fechaStr || fechaStr === "null") {
            return {
                corto: finalizado ? "SIN INFORMACIÓN" : "POR CONFIRMAR",
                largo: finalizado ? "SIN INFORMACIÓN DE FECHA" : "FECHA A CONFIRMAR"
            };
        }

        try {
            const [year, month, day] = fechaStr.split('-').map(Number);
            const fecha = new Date(year, month - 1, day);

            const diasCorto = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
            const diasLargo = ["DOMINGO", "LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO"];
            const meses = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];

            return {
                corto: `${diasCorto[fecha.getDay()]}-${day}`,
                largo: `${diasLargo[fecha.getDay()]} ${day} DE ${meses[fecha.getMonth()]} DE ${year}`
            };
        } catch (e) {
            return { corto: "ERROR", largo: "ERROR EN FORMATO" };
        }
    };

    const fechaInfo = formatearFechaPro(partido.fecha);

    // NUEVA LÓGICA: Cambia el texto según si el partido terminó o no
    const formatDato = (dato) => {
        if (dato && dato !== "null" && dato !== "") return dato;
        return finalizado ? "SIN INFORMACIÓN" : "POR CONFIRMAR";
    };

    return (
        <div className="w-full transition-all duration-300">
            {/* --- VISTA CELULAR (md:hidden) --- */}
            <div className={`md:hidden rounded-2xl px-3 py-4 border ${finalizado ? "bg-[#1c213b] border-emerald-500/20" : "bg-[#0e1630] border-slate-700/40"}`}>
                <div className="flex justify-center mb-3">
                    <span className={`text-[7px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${
                        finalizado ? "text-emerald-500 border-emerald-500/30 bg-emerald-500/10" : "text-slate-400 border-slate-500/30 bg-slate-500/10"
                    }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${finalizado ? "bg-emerald-500" : "bg-slate-400 animate-pulse"}`}></div>
                        {finalizado ? "Finalizado" : "Pendiente"}
                    </span>
                </div>

                <div className="grid grid-cols-3 items-center gap-1">
                    <div className="flex flex-col items-center">
                        <div className="w-10 h-10 mb-1 shrink-0">
                            {partido.equipoLocalEscudo ? <img src={partido.equipoLocalEscudo} alt="L" className="w-full h-full object-contain" /> : <FaShieldAlt className="text-slate-700 w-full h-full" />}
                        </div>
                        <span className="text-[10px] font-black text-white uppercase text-center leading-tight w-full break-words">
                            {formatDato(partido.equipoLocalNombre)}
                        </span>
                    </div>

                    <div className="flex flex-col items-center justify-center">
                        <span className="text-xl font-black leading-none text-white">{finalizado ? `${partido.golesLocal} - ${partido.golesVisitante}` : "VS"}</span>
                        <div className={`w-8 h-1 mt-1 rounded-sm ${finalizado ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]" : "bg-slate-500 shadow-[0_0_6px_rgba(148,163,184,0.5)]"}`}></div>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="w-10 h-10 mb-1 shrink-0">
                            {partido.equipoVisitanteEscudo ? <img src={partido.equipoVisitanteEscudo} alt="V" className="w-full h-full object-contain" /> : <FaShieldAlt className="text-slate-700 w-full h-full" />}
                        </div>
                        <span className="text-[10px] font-black text-white uppercase text-center leading-tight w-full break-words">
                            {formatDato(partido.equipoVisitanteNombre)}
                        </span>
                    </div>
                </div>

                <div className="mt-4 flex flex-col gap-2">
                    <div className="grid grid-cols-2 gap-2">
                        <div
                            onClick={() => setVerFechaLarga(!verFechaLarga)}
                            className="flex items-center gap-1.5 bg-[#050814]/80 border border-blue-900/40 px-2 py-1.5 rounded-lg justify-center cursor-pointer active:scale-95 transition-all relative overflow-hidden group"
                        >
                            <FaCalendarAlt size={8} className="text-blue-500" />
                            <span className="text-[8px] font-black text-white uppercase tracking-tighter">
                                {verFechaLarga ? fechaInfo.largo : fechaInfo.corto}
                            </span>
                            {!verFechaLarga && <div className="absolute right-1 animate-pulse"><FaInfoCircle size={6} className="text-blue-900" /></div>}
                        </div>

                        <div className="flex items-center gap-1.5 bg-[#050814]/80 border border-blue-900/20 px-2 py-1.5 rounded-lg justify-center">
                            <FaClock size={8} className="text-blue-500" />
                            <span className="text-[8px] font-black text-slate-300 uppercase">
                                {partido.hora ? `${partido.hora} HS` : (finalizado ? "SIN INFORMACIÓN" : "POR CONFIRMAR")}
                            </span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-1.5 bg-[#050814]/80 border border-blue-900/20 px-2 py-1.5 rounded-lg justify-center">
                            <FaMapMarkerAlt size={8} className="text-blue-500" />
                            <span className="text-[8px] font-black text-slate-300 uppercase truncate">{formatDato(partido.canchaNombre || partido.cancha)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-[#050814]/80 border border-blue-900/20 px-2 py-1.5 rounded-lg justify-center">
                            <FaUserTie size={8} className="text-blue-500" />
                            <span className="text-[8px] font-black text-slate-300 uppercase truncate">{formatDato(partido.arbitro)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- VISTA PC (hidden md:flex) --- */}
            <div className="hidden md:flex flex-col items-center w-full group">
                <div className={`w-full border-y py-4 px-6 lg:px-10 flex items-center justify-between relative shadow-xl ${
                    finalizado ? "bg-[#1c213b]/60 border-emerald-500/20" : "bg-slate-800/10 border-slate-700/20"
                }`}>
                    <div className="flex items-center gap-4 flex-1 justify-start min-w-0">
                        <div className="w-12 h-12 lg:w-14 lg:h-14 shrink-0">{partido.equipoLocalEscudo ? <img src={partido.equipoLocalEscudo} className="w-full h-full object-contain" /> : <FaShieldAlt className="text-slate-700 w-full h-full" />}</div>
                        <span className="text-lg lg:text-xl font-black text-white uppercase tracking-tight truncate">{formatDato(partido.equipoLocalNombre)}</span>
                    </div>

                    <div className="flex flex-col items-center px-4 lg:px-8 shrink-0 w-[180px]">
                        <div className="flex justify-center mb-2">
                            <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border flex items-center gap-1.5 ${
                                finalizado ? "text-emerald-500 border-emerald-500/30 bg-emerald-500/10" : "text-slate-400 border-slate-500/30 bg-slate-500/10"
                            }`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${finalizado ? "bg-emerald-500" : "bg-slate-400 animate-pulse"}`}></div>
                                {finalizado ? "Finalizado" : "Pendiente"}
                            </span>
                        </div>
                        <span className="text-3xl lg:text-4xl font-black tracking-tighter text-white">{finalizado ? `${partido.golesLocal} - ${partido.golesVisitante}` : "VS"}</span>
                        <div className={`w-12 h-1.5 mt-2 rounded-full ${finalizado ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" : "bg-slate-500 shadow-[0_0_10px_rgba(148,163,184,0.5)]"}`}></div>
                    </div>

                    <div className="flex items-center gap-4 flex-1 justify-end min-w-0">
                        <span className="text-lg lg:text-xl font-black text-white uppercase tracking-tight truncate text-right">{formatDato(partido.equipoVisitanteNombre)}</span>
                        <div className="w-12 h-12 lg:w-14 lg:h-14 shrink-0">{partido.equipoVisitanteEscudo ? <img src={partido.equipoVisitanteEscudo} className="w-full h-full object-contain" /> : <FaShieldAlt className="text-slate-700 w-full h-full" />}</div>
                    </div>
                </div>

                <div className="flex items-center gap-4 mt-3">
                    <div
                        onClick={() => setVerFechaLarga(!verFechaLarga)}
                        onMouseEnter={() => setVerFechaLarga(true)}
                        onMouseLeave={() => setVerFechaLarga(false)}
                        className={`flex items-center gap-2 border px-4 py-1.5 rounded-full shadow-lg cursor-pointer transition-all duration-300 ${
                            verFechaLarga ? "bg-blue-600 border-blue-400 ring-2 ring-blue-500/20" : "bg-[#050814]/90 border-slate-800 hover:border-blue-500/50"
                        }`}
                    >
                        <span className={`text-[11px] ${verFechaLarga ? "text-white" : "text-blue-500"}`}><FaCalendarAlt /></span>
                        <span className={`text-[10px] font-black uppercase tracking-wide ${verFechaLarga ? "text-white" : "text-slate-300"}`}>
                            {verFechaLarga ? fechaInfo.largo : fechaInfo.corto}
                        </span>
                    </div>

                    {[
                        { icon: <FaMapMarkerAlt />, label: partido.canchaNombre || partido.cancha },
                        { icon: <FaClock />, label: partido.hora ? `${partido.hora} HS` : null },
                        { icon: <FaUserTie />, label: partido.arbitro }
                    ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-[#050814]/90 border border-slate-800 px-4 py-1.5 rounded-full shadow-lg">
                            <span className="text-blue-500 text-[11px]">{item.icon}</span>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-wide">
                                {formatDato(item.label)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}