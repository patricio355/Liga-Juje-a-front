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
            // 1. Prioridad: Cancha (Normalizada)
            const canchaA = (a.cancha || a.canchaNombre || "ZZZ").toLowerCase();
            const canchaB = (b.cancha || b.canchaNombre || "ZZZ").toLowerCase();

            if (canchaA < canchaB) return -1;
            if (canchaA > canchaB) return 1;

            // 2. Misma cancha, ordenar por Hora
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
        <div className="w-full bg-[#0e1630]/60 backdrop-blur-md rounded-3xl border border-blue-900/40 shadow-2xl overflow-hidden">

            {/* Cabecera */}
            <div className="bg-[#050814]/90 border-b border-blue-900/40 p-4 md:p-6 flex flex-col items-center gap-4">
                <span className="text-[10px] md:text-xs font-black text-blue-500 uppercase tracking-[0.4em] italic">FECHA</span>
                <div className="flex items-center justify-center gap-4 w-full">
                    <button onClick={() => navegar("prev")} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full border border-blue-900/60 text-blue-400 bg-[#02040a] disabled:opacity-10 hover:bg-blue-900/20 transition-all"><FaChevronLeft size={10} className="md:size-3" /></button>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {fechasValidas.map(f => (
                            <button key={f} onClick={() => setFechaActual(f)} className={`w-8 h-8 md:w-10 md:h-10 rounded-xl text-[10px] md:text-xs font-black transition-all border flex items-center justify-center ${fechaActual === f ? "bg-blue-600 text-white border-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.4)] scale-105" : "bg-[#02040a] text-blue-900 border-blue-900/40 hover:text-blue-400"}`}>{f}</button>
                        ))}
                    </div>
                    <button onClick={() => navegar("next")} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full border border-blue-900/60 text-blue-400 bg-[#02040a] disabled:opacity-10 hover:bg-blue-900/20 transition-all"><FaChevronRight size={10} className="md:size-3" /></button>
                </div>
            </div>

            <div className="p-2 md:p-10 space-y-4 md:space-y-8 bg-transparent">
                {/* APLICAMOS ORDENAMIENTO ANTES DEL MAP */}
                {ordenarPartidos(partidos).map((p, index) => (
                    <PartidoCard
                        key={p.partidoId || p.id || `partido-${index}`}
                        partido={{
                            ...p,
                            // Mapeo exhaustivo para que coincida con PartidoCard
                            equipoLocalNombre: p.local || p.equipoLocalNombre,
                            equipoVisitanteNombre: p.visitante || p.equipoVisitanteNombre,
                            equipoLocalEscudo: p.localEscudo || p.equipoLocalEscudo,
                            equipoVisitanteEscudo: p.visitanteEscudo || p.equipoVisitanteEscudo,
                            canchaNombre: p.cancha || p.canchaNombre,
                            hora: p.hora || p.Hora,
                            arbitro: p.arbitro || p.arbitroNombre,
                            golesLocal: p.golesLocal ?? p.golesL,
                            golesVisitante: p.golesVisitante ?? p.golesV,
                            partidoId: p.partidoId || p.id
                        }}
                    />
                ))}
            </div>

            <div className="bg-[#050814] py-3 px-4 border-t border-blue-900/30">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-900/60 text-center">Programación Sujeta a Cambios</p>
            </div>
        </div>
    );
}