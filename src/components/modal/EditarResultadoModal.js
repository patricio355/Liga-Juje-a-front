import { useState } from "react";
import Modal from "./Modal";

export default function EditarResultadoModal({
                                                 partido,
                                                 isOpen,
                                                 onClose,
                                                 onSave,
                                             }) {
    const [golesLocal, setGolesLocal] = useState(partido.golesLocal);
    const [golesVisitante, setGolesVisitante] = useState(partido.golesVisitante);

    const submit = async () => {
        await onSave({
            golesLocal,
            golesVisitante,
        });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Editar resultado">
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <span>{partido.local}</span>
                    <input
                        type="number"
                        min="0"
                        value={golesLocal}
                        onChange={(e) => setGolesLocal(+e.target.value)}
                        className="w-16 border rounded text-center"
                    />
                </div>

                <div className="flex justify-between items-center">
                    <span>{partido.visitante}</span>
                    <input
                        type="number"
                        min="0"
                        value={golesVisitante}
                        onChange={(e) => setGolesVisitante(+e.target.value)}
                        className="w-16 border rounded text-center"
                    />
                </div>

                <button
                    onClick={submit}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Guardar cambios
                </button>
            </div>
        </Modal>
    );
}
