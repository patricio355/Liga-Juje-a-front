import { useEffect, useState } from "react";
import { FaTrophy, FaTimes, FaCheck } from "react-icons/fa";

export default function CerrarPartidoModal({
                                               open,
                                               onClose,
                                               partido,
                                               onSuccess
                                           }) {
    const [golesLocal, setGolesLocal] = useState(0);
    const [golesVisitante, setGolesVisitante] = useState(0);
    const [loading, setLoading] = useState(false);

    // Definimos la URL base desde las variables de entorno
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (partido) {
            setGolesLocal(partido.golesLocal ?? 0);
            setGolesVisitante(partido.golesVisitante ?? 0);
        }
    }, [partido]);

    if (!open || !partido) return null;
    const idFinal = partido.partidoId || partido.id;
    const cerrar = async () => {
        try {
            setLoading(true);
            const res = await fetch(
                `${API_URL}/api/partidos/${idFinal}/cerrar`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                        golesLocal,
                        golesVisitante,
                    }),
                }
            );

            if (!res.ok) throw new Error("Error al cerrar el partido");

            await onSuccess();
            onClose();
        } catch (e) {
            console.error(e);
            alert("No se pudo cerrar el partido");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            {/* Overlay con desenfoque */}
            <div className="absolute inset-0 bg-[#0b1023]/80 backdrop-blur-sm" onClick={onClose}></div>

            {/* Contenedor Principal */}
            <div className="relative bg-[#1c213b] border border-gray-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Cabecera */}
                <div className="bg-green-600/10 p-6 flex flex-col items-center border-b border-gray-700">
                    <div className="bg-green-600/20 p-3 rounded-full mb-3">
                        <FaTrophy className="text-3xl text-green-500" />
                    </div>
                    <h2 className="text-xl font-bold text-white uppercase tracking-tighter">
                        Finalizar Encuentro
                    </h2>
                </div>

                {/* Cuerpo del Modal */}
                <div className="p-8">
                    <div className="flex justify-between items-center gap-4 mb-8">
                        {/* LOCAL */}
                        <div className="flex-1 text-center">
                            <p className="text-white font-bold text-sm mb-3 truncate px-1">
                                {partido.local}
                            </p>
                            <input
                                type="number"
                                min="0"
                                className="w-20 h-20 bg-[#12172d] border-2 border-gray-700 rounded-2xl text-center text-3xl font-black text-white focus:border-green-500 outline-none transition-all"
                                value={golesLocal}
                                onChange={(e) => setGolesLocal(Number(e.target.value))}
                            />
                        </div>

                        <div className="text-gray-600 font-black text-2xl pt-8">-</div>

                        {/* VISITANTE */}
                        <div className="flex-1 text-center">
                            <p className="text-white font-bold text-sm mb-3 truncate px-1">
                                {partido.visitante}
                            </p>
                            <input
                                type="number"
                                min="0"
                                className="w-20 h-20 bg-[#12172d] border-2 border-gray-700 rounded-2xl text-center text-3xl font-black text-white focus:border-green-500 outline-none transition-all"
                                value={golesVisitante}
                                onChange={(e) => setGolesVisitante(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    <p className="text-[11px] text-gray-400 bg-[#0b1023] p-3 rounded-lg border border-gray-800 text-center uppercase font-bold tracking-widest leading-relaxed">
                        Al confirmar, se guardará el resultado oficial y el partido ya no podrá ser modificado.
                    </p>
                </div>

                {/* Acciones */}
                <div className="flex p-4 gap-3 bg-[#0b1023]/50 border-t border-gray-700">
                    <button
                        onClick={onClose}
                        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-gray-400 hover:bg-gray-800 hover:text-white transition-all uppercase text-xs tracking-widest"
                    >
                        <FaTimes /> Cancelar
                    </button>
                    <button
                        onClick={cerrar}
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/20 transition-all uppercase text-xs tracking-widest disabled:opacity-50"
                    >
                        {loading ? "..." : <><FaCheck /> Confirmar</>}
                    </button>
                </div>
            </div>
        </div>
    );
}