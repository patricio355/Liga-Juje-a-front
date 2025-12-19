import { useState } from "react";
import Modal from "./Modal";

export default function EditarResultadoModal({
                                                 open,
                                                 onClose,
                                                 partido,
                                                 onSuccess
                                             }) {
    const [golesLocal, setGolesLocal] = useState(partido?.golesLocal ?? 0);
    const [golesVisitante, setGolesVisitante] = useState(partido?.golesVisitante ?? 0);

    if (!partido) return null;

    const guardarCambios = async () => {
        await fetch(
            `http://localhost:8080/api/partidos/${partido.partidoId}/editar-resultado`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    golesLocal,
                    golesVisitante
                })
            }
        );

        onClose();
        onSuccess();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <h2 className="text-lg font-bold mb-4">
                Editar resultado
            </h2>

            <p className="mb-3 font-semibold">
                {partido.local} vs {partido.visitante}
            </p>

            <div className="flex gap-2 mb-4">
                <input
                    type="number"
                    min="0"
                    value={golesLocal}
                    onChange={e => setGolesLocal(+e.target.value)}
                    className="border px-2 py-1 w-20"
                />
                <span>-</span>
                <input
                    type="number"
                    min="0"
                    value={golesVisitante}
                    onChange={e => setGolesVisitante(+e.target.value)}
                    className="border px-2 py-1 w-20"
                />
            </div>

            <button
                onClick={guardarCambios}
                className="px-4 py-2 bg-blue-600 text-white rounded"
            >
                Guardar cambios
            </button>
        </Modal>
    );
}
