import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import PartidoCard from "./PartidoCard";

export default function ProgramacionComoFixture({ zonaId }) {
    const [fechaActual, setFechaActual] = useState(null);
    const [partidos, setPartidos] = useState([]);
    const [fechasValidas, setFechasValidas] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const cargarFechasReales = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${API_URL}/api/programacion/zona/${zonaId}/fechas-disponibles`);
                if (!res.ok) throw new Error("Error de red");
                const data = await res.json();

                if (Array.isArray(data) && data.length > 0) {
                    const fechasOrdenadas = data.sort((a, b) => a - b);
                    setFechasValidas(fechasOrdenadas);
                    setFechaActual(fechasOrdenadas[0]);
                } else {
                    setFechasValidas([]);
                }
            } catch (error) {
                console.error("Error:", error);
                setFechasValidas([]);
            } finally {
                setLoading(false);
            }
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
            } catch (error) {
                console.error(error);
            }
        };
        cargarPartidos();
    }, [zonaId, fechaActual, API_URL]);

    const navegar = (direccion) => {
        const indiceActual = fechasValidas.indexOf(fechaActual);
        if (direccion === "next" && indiceActual < fechasValidas.length - 1) {
            setFechaActual(fechasValidas[indiceActual + 1]);
        } else if (direccion === "prev" && indiceActual > 0) {
            setFechaActual(fechasValidas[indiceActual - 1]);
        }
    };

    if (fechasValidas.length === 0 && !loading) return null;

    return (
        <div className="mt-8 bg-[#12172d] rounded-2xl border border-gray-800 shadow-2xl overflow-hidden max-w-2xl mx-auto">
            {/* CABECERA / SELECTOR DE FECHAS */}
            <div className="bg-[#1c213b] border-b border-gray-800 p-4 flex flex-col items-center gap-3">
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] italic">
                    FECHA
                </span>

                <div className="flex items-start justify-center gap-3 w-full">
                    <button
                        onClick={() => navegar("prev")}
                        disabled={fechasValidas.indexOf(fechaActual) === 0}
                        className="shrink-0 w-8 h-8 mt-1 flex items-center justify-center rounded-full border border-gray-700 text-gray-500 hover:border-emerald-500 hover:text-emerald-500 bg-[#0b1023] disabled:opacity-10 transition-all"
                    >
                        <FaChevronLeft size={10} />
                    </button>

                    <div className="flex flex-wrap gap-[6px] justify-center max-w-[400px]">
                        {fechasValidas.map(f => (
                            <button
                                key={`fecha-btn-${f}`}
                                onClick={() => setFechaActual(f)}
                                className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all border flex items-center justify-center
                                    ${fechaActual === f
                                    ? "bg-emerald-600 text-white border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)] scale-110"
                                    : "bg-[#0b1023] text-gray-500 border-gray-800 hover:border-gray-600 hover:text-gray-300"}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => navegar("next")}
                        disabled={fechasValidas.indexOf(fechaActual) === fechasValidas.length - 1}
                        className="shrink-0 w-8 h-8 mt-1 flex items-center justify-center rounded-full border border-gray-700 text-gray-500 hover:border-emerald-500 hover:text-emerald-500 bg-[#0b1023] disabled:opacity-10 transition-all"
                    >
                        <FaChevronRight size={10} />
                    </button>
                </div>
            </div>

            {/* LISTADO DE PARTIDOS */}
            <div className="p-4 bg-[#12172d] min-h-[200px]">
                <div className="space-y-4">
                    {partidos.map((p, index) => (
                        <PartidoCard
                            key={p.partidId || p.id || `partido-${index}`}
                            partido={{
                                estado: p.estado,
                                equipoLocalNombre: p.local || p.equipoLocalNombre,
                                equipoVisitanteNombre: p.visitante || p.equipoVisitanteNombre,
                                // ✅ Agregamos los escudos aquí para que la Card los dibuje
                                equipoLocalEscudo: p.equipoLocalEscudo || p.localEscudo,
                                equipoVisitanteEscudo: p.equipoVisitanteEscudo || p.visitanteEscudo,
                                golesLocal: p.golesLocal,
                                golesVisitante: p.golesVisitante,
                                fecha: p.fecha,
                                canchaNombre: p.cancha || p.canchaNombre
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* PIE DE SECCIÓN */}
            <div className="bg-[#0b1023] py-2 px-4 border-t border-gray-800">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600 text-center">
                    Programación sujeta a cambios
                </p>
            </div>
        </div>
    );
}