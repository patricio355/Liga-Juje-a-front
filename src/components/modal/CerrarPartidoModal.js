import { useState } from "react";
import Modal from "./Modal";
import { cerrarPartido } from "../../api/partidos.api";

export default function CerrarPartidoModal({ partido, isOpen, onClose, onSuccess }) {
    const [golesLocal, setGolesLocal] = useState(0);
    const [golesVisitante, setGolesVisitante] = useState(0);
    const [loading, setLoading] = useState(false);

    const submit = async () => {
        setLoading(true);
        try {
            await cerrarPartido(partido.partidoId, {
                golesLocal,
                golesVisitante,
            });
            onSuccess();
            onClose();
        } catch (e) {
            alert("No se pudo cerrar el partido");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Cerrar partido">
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
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                    {loading ? "Cerrando..." : "Confirmar cierre"}
                </button>
            </div>
        </Modal>
    );
}
