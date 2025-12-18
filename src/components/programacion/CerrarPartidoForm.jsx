import { useState } from "react";
import { cerrarPartido, solicitarCierre } from "../../api/partidos.api";
import { decodeToken } from "../../api/decodeToken";

export default function CerrarPartidoForm({ partidoId }) {
    const [golesLocal, setGolesLocal] = useState(0);
    const [golesVisitante, setGolesVisitante] = useState(0);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");
    const user = token ? decodeToken(token) : null;
    const esAdmin = user?.role === "ROLE_ADMIN";

    const submit = async () => {
        if (!partidoId) {
            alert("Partido inválido");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                golesLocal,
                golesVisitante,
            };

            if (esAdmin) {
                await cerrarPartido(partidoId, payload);
                alert("Partido cerrado correctamente");
            } else {
                await solicitarCierre(partidoId, payload);
                alert("Solicitud de cierre enviada");
            }
        } catch (err) {
            console.error("Error al cerrar partido:", err);
            alert("No se pudo cerrar el partido");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="border rounded-lg p-3 bg-white">
            <h3 className="font-semibold mb-2">
                {esAdmin ? "Cerrar partido" : "Solicitar cierre"}
            </h3>

            <div className="flex gap-2 mb-2">
                <input
                    type="number"
                    min="0"
                    className="border p-1 w-20"
                    value={golesLocal}
                    onChange={(e) => setGolesLocal(Number(e.target.value))}
                    placeholder="Local"
                />
                <input
                    type="number"
                    min="0"
                    className="border p-1 w-20"
                    value={golesVisitante}
                    onChange={(e) => setGolesVisitante(Number(e.target.value))}
                    placeholder="Visitante"
                />
            </div>

            <button
                onClick={submit}
                disabled={loading}
                className={`px-3 py-1 rounded text-white ${
                    esAdmin ? "bg-green-600" : "bg-yellow-600"
                }`}
            >
                {loading
                    ? "Procesando..."
                    : esAdmin
                        ? "Cerrar partido"
                        : "Solicitar cierre"}
            </button>
        </div>
    );
}
