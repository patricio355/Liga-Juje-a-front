import React, { useState } from "react";
import { FaCheckCircle, FaTimes, FaExclamationTriangle } from "react-icons/fa";
import { apiFetch } from "../../api/api";

export default function CerrarPartidoModal({ open, partido, onClose, onSuccess }) {
    const [loading, setLoading] = useState(false);

    if (!open || !partido) return null;

    const handleConfirmar = async () => {
        setLoading(true);
        try {
            // Ajusta la URL según tu API de backend para cerrar partidos
            await apiFetch(`/api/partidos/${partido.partidoId}/cerrar`, {
                method: "PUT",
            });
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error al cerrar el partido:", error);
            alert("No se pudo cerrar el partido. Verifique la conexión.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Overlay con desenfoque */}
            <div
                className="absolute inset-0 bg-[#0b1023]/80 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Contenedor del Modal */}
            <div className="relative bg-[#1c213b] border border-gray-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Cabecera con icono de advertencia */}
                <div className="bg-orange-500/10 p-6 flex flex-col items-center border-b border-gray-700">
                    <div className="bg-orange-500/20 p-4 rounded-full mb-4">
                        <FaExclamationTriangle className="text-4xl text-orange-500" />
                    </div>
                    <h2 className="text-xl font-bold text-white uppercase tracking-tight text-center">
                        ¿Finalizar Partido?
                    </h2>
                </div>

                {/* Cuerpo del mensaje */}
                <div className="p-8 text-center">
                    <p className="text-gray-300 mb-6 leading-relaxed">
                        Estás a punto de cerrar el encuentro entre <br/>
                        <span className="text-white font-bold block mt-2 text-lg">
                            {partido.local} VS {partido.visitante}
                        </span>
                    </p>

                    <div className="bg-[#12172d] p-4 rounded-xl border border-gray-800 text-sm text-gray-400 italic">
                        Una vez cerrado, el resultado se volverá oficial y se actualizará la tabla de posiciones.
                    </div>
                </div>

                {/* Acciones */}
                <div className="p-6 bg-[#12172d]/50 flex gap-4 border-t border-gray-700">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-gray-400 hover:bg-gray-700 hover:text-white transition-all uppercase text-xs tracking-widest border border-transparent hover:border-gray-600"
                    >
                        <FaTimes /> Cancelar
                    </button>
                    <button
                        onClick={handleConfirmar}
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/20 transition-all uppercase text-xs tracking-widest disabled:opacity-50"
                    >
                        {loading ? (
                            "Procesando..."
                        ) : (
                            <>
                                <FaCheckCircle /> Confirmar
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}