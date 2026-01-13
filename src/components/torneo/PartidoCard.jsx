import { useState } from "react";
import { FaShieldAlt, FaMapMarkerAlt, FaClock, FaCalendarAlt, FaUserTie } from "react-icons/fa";

export default function PartidoCard({ partido }) {
    const finalizado = partido.estado === "FINALIZADO";
    const [verFechaLarga, setVerFechaLarga] = useState(false);

    const formatearFechaPro = (fechaStr) => {
        if (!fechaStr || fechaStr === "null") {
            return {
                corto: finalizado ? "SIN INFORMACIÓN" : "---",
                largo: finalizado ? "SIN INFORMACIÓN" : "---"
            };
        }
        try {
            const [year, month, day] = fechaStr.split('-').map(Number);
            const fecha = new Date(year, month - 1, day);

            const diasCualquiera = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
            const meses = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];

            return {
                corto: `${diasCualquiera[fecha.getDay()]} ${day}`,
                largo: `${diasCualquiera[fecha.getDay()].toUpperCase()} ${day} DE ${meses[fecha.getMonth()]} ${year}`
            };
        } catch (e) {
            return { corto: "ERROR", largo: "ERROR" };
        }
    };

    const fechaInfo = formatearFechaPro(partido.fecha);

    const formatDato = (dato) => {
        if (dato && dato !== "null" && dato !== "") return dato;
        return finalizado ? "SIN INFORMACIÓN" : "---";
    };

    // Nueva lógica para la hora
    const formatHora = (hora) => {
        if (hora && hora !== "null" && hora !== "") return `${hora} HS`;
        return finalizado ? "SIN INFORMACIÓN" : "---";
    };

    const formatHoraLarga = (hora) => {
        if (hora && hora !== "null" && hora !== "") return `${hora} HS`;
        return finalizado ? "SIN INFORMACIÓN" : "---";
    };

    return (
        <div className="w-full transition-all duration-300">

            {/* --- VISTA CELULAR --- */}
            <div className={`md:hidden rounded-2xl overflow-hidden border ${finalizado ? "border-emerald-500/20 shadow-lg shadow-emerald-950/20" : "border-slate-800"}`}>

                {/* Bloque Equipos Móvil */}
                <div className={`px-4 py-5 ${finalizado ? "bg-[#1c213b]" : "bg-[#0e1630]"}`}>
                    <div className="grid grid-cols-3 items-center">
                        <div className="flex flex-col items-center">
                            <div className="w-10 h-10 mb-2">{partido.equipoLocalEscudo ? <img src={partido.equipoLocalEscudo} className="w-full h-full object-contain" alt="L" /> : <FaShieldAlt className="text-slate-700 w-full h-full" />}</div>
                            <span className="text-[10px] font-black text-white uppercase text-center leading-tight">{formatDato(partido.equipoLocalNombre)}</span>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <span className="text-xl font-black text-white">{finalizado ? `${partido.golesLocal} - ${partido.golesVisitante}` : "VS"}</span>
                            <div className={`w-8 h-1 mt-1 rounded-full ${finalizado ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" : "bg-slate-700"}`}></div>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-10 h-10 mb-2">{partido.equipoVisitanteEscudo ? <img src={partido.equipoVisitanteEscudo} className="w-full h-full object-contain" alt="V" /> : <FaShieldAlt className="text-slate-700 w-full h-full" />}</div>
                            <span className="text-[10px] font-black text-white uppercase text-center leading-tight">{formatDato(partido.equipoVisitanteNombre)}</span>
                        </div>
                    </div>
                </div>

                {/* Rectángulo de Info Móvil */}
                <div className="bg-[#050814] border-t border-slate-800 grid grid-cols-2 divide-x divide-y divide-slate-800/50">
                    <div className="p-2.5 flex items-center gap-2">
                        <FaCalendarAlt size={10} className="text-blue-500 shrink-0" />
                        <span className="text-[9px] text-white uppercase tracking-tighter truncate">{fechaInfo.corto}</span>
                    </div>
                    <div className="p-2.5 flex items-center gap-2">
                        <FaClock size={10} className="text-blue-500 shrink-0" />
                        <span className="text-[9px] text-white uppercase tracking-tighter">{formatHora(partido.hora)}</span>
                    </div>
                    <div className="p-2.5 flex items-center gap-2">
                        <FaMapMarkerAlt size={10} className="text-blue-500 shrink-0" />
                        <span className="text-[9px] text-white uppercase tracking-tighter truncate">{formatDato(partido.canchaNombre || partido.cancha)}</span>
                    </div>
                    <div className="p-2.5 flex items-center gap-2">
                        <FaUserTie size={10} className="text-blue-500 shrink-0" />
                        <span className="text-[9px] text-white uppercase tracking-tighter truncate">{formatDato(partido.arbitro)}</span>
                    </div>
                </div>
            </div>

            {/* --- VISTA PC --- */}
            <div className={`hidden md:flex flex-col w-full rounded-3xl overflow-hidden border transition-all duration-300 ${
                finalizado ? "border-emerald-500/30 bg-[#1c213b]/40 shadow-xl shadow-emerald-950/10" : "border-slate-800 bg-slate-900/20 hover:border-slate-700"
            }`}>

                {/* Bloque Principal */}
                <div className="flex items-center justify-between px-10 py-6">
                    <div className="flex items-center gap-5 flex-1 justify-start">
                        <div className="w-14 h-14 shrink-0 p-1 bg-[#050814]/50 rounded-xl">{partido.equipoLocalEscudo ? <img src={partido.equipoLocalEscudo} className="w-full h-full object-contain" alt="L" /> : <FaShieldAlt className="text-slate-800 w-full h-full" />}</div>
                        <span className="text-xl font-black text-white uppercase tracking-tighter">{formatDato(partido.equipoLocalNombre)}</span>
                    </div>

                    <div className="flex flex-col items-center px-10 w-[220px]">
                        <span className={`text-[9px] font-black uppercase tracking-[0.3em] mb-3 px-3 py-1 rounded-full border ${finalizado ? "text-emerald-500 border-emerald-500/20 bg-emerald-500/5" : "text-slate-500 border-slate-800 bg-slate-800/20"}`}>
                            {finalizado ? "Finalizado" : "Pendiente"}
                        </span>
                        <span className="text-4xl font-black text-white tracking-tighter">
                            {finalizado ? `${partido.golesLocal} - ${partido.golesVisitante}` : "VS"}
                        </span>
                    </div>

                    <div className="flex items-center gap-5 flex-1 justify-end">
                        <span className="text-xl font-black text-white uppercase tracking-tighter text-right">{formatDato(partido.equipoVisitanteNombre)}</span>
                        <div className="w-14 h-14 shrink-0 p-1 bg-[#050814]/50 rounded-xl">{partido.equipoVisitanteEscudo ? <img src={partido.equipoVisitanteEscudo} className="w-full h-full object-contain" alt="V" /> : <FaShieldAlt className="text-slate-800 w-full h-full" />}</div>
                    </div>
                </div>

                {/* Barra Inferior PC */}
                <div className="bg-[#050814]/80 border-t border-slate-800 flex items-center divide-x divide-slate-800">
                    <div
                        className="flex-1 flex items-center justify-center gap-3 py-3.5 hover:bg-blue-600/10 cursor-pointer transition-colors"
                        onMouseEnter={() => setVerFechaLarga(true)}
                        onMouseLeave={() => setVerFechaLarga(false)}
                    >
                        <FaCalendarAlt size={12} className="text-blue-500" />
                        <span className="text-[11px] text-white uppercase tracking-widest">
                            {verFechaLarga ? fechaInfo.largo : fechaInfo.corto}
                        </span>
                    </div>
                    <div className="flex-1 flex items-center justify-center gap-3 py-3.5">
                        <FaClock size={12} className="text-blue-500" />
                        <span className="text-[11px] text-white uppercase tracking-widest">
                            {formatHoraLarga(partido.hora)}
                        </span>
                    </div>
                    <div className="flex-1 flex items-center justify-center gap-3 py-3.5 px-2">
                        <FaMapMarkerAlt size={12} className="text-blue-500" />
                        <span className="text-[11px] text-white uppercase tracking-widest truncate">
                            {formatDato(partido.canchaNombre || partido.cancha)}
                        </span>
                    </div>
                    <div className="flex-1 flex items-center justify-center gap-3 py-3.5 px-2">
                        <FaUserTie size={12} className="text-blue-500" />
                        <span className="text-[11px] text-white uppercase tracking-widest truncate">
                            {formatDato(partido.arbitro)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}