// src/components/modal/CerrarPartidoModal.jsx
import { useEffect, useState } from "react";
import Modal from "./Modal";

export default function CerrarPartidoModal({
                                               open,
                                               onClose,
                                               partido,
                                               onSuccess
                                           }) {
    const [golesLocal, setGolesLocal] = useState(0);
    const [golesVisitante, setGolesVisitante] = useState(0);
    const [loading, setLoading] = useState(false);

    // Resetear cuando cambia el partido
    useEffect(() => {
        if (partido) {
            setGolesLocal(partido.golesLocal ?? 0);
            setGolesVisitante(partido.golesVisitante ?? 0);
        }
    }, [partido]);

    if (!open || !partido) return null;

    const cerrar = async () => {
        try {
            setLoading(true);

            const res = await fetch(
                `http://localhost:8080/api/partidos/${partido.partidoId}/cerrar`,
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

            if (!res.ok) {
                throw new Error("Error al cerrar el partido");
            }

            // 🔥 refrescar ANTES de cerrar
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
        <Modal open={open} onClose={onClose}>
            <h2 className="text-lg font-bold mb-4">
                Cerrar partido
            </h2>

            <p className="mb-4 font-semibold">
                {partido.local} vs {partido.visitante}
            </p>

            <div className="flex items-center gap-3 mb-6">
                <input
                    type="number"
                    min="0"
                    className="border px-2 py-1 w-20"
                    value={golesLocal}
                    onChange={(e) =>
                        setGolesLocal(Number(e.target.value))
                    }
                />
                <span className="font-bold">-</span>
                <input
                    type="number"
                    min="0"
                    className="border px-2 py-1 w-20"
                    value={golesVisitante}
                    onChange={(e) =>
                        setGolesVisitante(Number(e.target.value))
                    }
                />
            </div>

            <div className="flex justify-end gap-2">
                <button
                    onClick={onClose}
                    className="px-4 py-2 rounded bg-gray-300"
                >
                    Cancelar
                </button>

                <button
                    onClick={cerrar}
                    disabled={loading}
                    className="px-4 py-2 rounded bg-green-600 text-white"
                >
                    {loading ? "Cerrando..." : "Confirmar"}
                </button>
            </div>
        </Modal>
    );
}
