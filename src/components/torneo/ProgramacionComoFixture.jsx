import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import PartidoCard from "./PartidoCard";

export default function ProgramacionComoFixture({ zonaId }) {
    const [fechaActual, setFechaActual] = useState(null);
    const [partidos, setPartidos] = useState([]);
    const [fechasValidas, setFechasValidas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarFechasReales = async () => {
            setLoading(true);
            try {
                const res = await fetch(`http://localhost:8080/api/programacion/zona/${zonaId}/fechas-disponibles`);
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
    }, [zonaId]);

    useEffect(() => {
        if (fechaActual === null) return;
        const cargarPartidos = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/programacion/zona/${zonaId}/fecha/${fechaActual}`);
                const data = await res.json();
                setPartidos(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error(error);
            }
        };
        cargarPartidos();
    }, [zonaId, fechaActual]);

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
        <div className="mt-8 bg-white rounded-2xl border-2 border-gray-300 shadow-md overflow-hidden max-w-2xl mx-auto">
            {/* SELECTOR DE FECHAS */}
            <div className="bg-gray-100 border-b-2 border-gray-300 p-4 flex flex-col items-center gap-3">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] italic">FECHA</span>

                <div className="flex items-start justify-center gap-3 w-full">
                    <button
                        onClick={() => navegar("prev")}
                        disabled={fechasValidas.indexOf(fechaActual) === 0}
                        className="shrink-0 w-8 h-8 mt-1 flex items-center justify-center rounded-full border-2 border-gray-300 text-gray-400 hover:border-emerald-500 hover:text-emerald-600 disabled:opacity-10 transition-all"
                    >
                        <FaChevronLeft size={12} />
                    </button>

                    {/* GRILLA FORZADA A 10 POR FILA */}
                    <div className="flex flex-wrap gap-[6px] justify-center max-w-[400px]">
                        {fechasValidas.map(f => (
                            <button
                                key={f}
                                onClick={() => setFechaActual(f)}
                                className={`w-[34px] h-8 rounded-lg text-[10px] font-black transition-all border-2 flex items-center justify-center
                                    ${fechaActual === f
                                    ? "bg-emerald-600 text-white border-emerald-700 shadow-sm scale-105"
                                    : "bg-white text-gray-400 border-gray-200 hover:border-gray-400"}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => navegar("next")}
                        disabled={fechasValidas.indexOf(fechaActual) === fechasValidas.length - 1}
                        className="shrink-0 w-8 h-8 mt-1 flex items-center justify-center rounded-full border-2 border-gray-300 text-gray-400 hover:border-emerald-500 hover:text-emerald-600 disabled:opacity-10 transition-all"
                    >
                        <FaChevronRight size={12} />
                    </button>
                </div>
            </div>

            <div className="p-4 bg-white min-h-[200px]">
                <div className="space-y-4">
                    {partidos.map(p => (
                        <PartidoCard key={p.partidId || p.id} partido={{
                            estado: p.estado,
                            equipoLocalNombre: p.local || p.equipoLocalNombre,
                            equipoVisitanteNombre: p.visitante || p.equipoVisitanteNombre,
                            golesLocal: p.golesLocal,
                            golesVisitante: p.golesVisitante,
                            fecha: p.fecha,
                            canchaNombre: p.cancha || p.canchaNombre
                        }} />
                    ))}
                </div>
            </div>
        </div>
    );
}