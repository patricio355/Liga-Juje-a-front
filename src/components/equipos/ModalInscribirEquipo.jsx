import { useEffect, useState } from "react";
import { apiFetch } from "../../api/api";

export default function ModalInscribirEquipo({ equipo, onClose, onInscripto }) {

    const [torneos, setTorneos] = useState([]);
    const [zonas, setZonas] = useState([]);

    const [busqueda, setBusqueda] = useState("");
    const [mostrarLista, setMostrarLista] = useState(false);

    const [torneoSeleccionado, setTorneoSeleccionado] = useState(null);
    const [zonaId, setZonaId] = useState("");

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        apiFetch(`/api/torneos/disponibles/equipo/${equipo.id}`)
            .then(setTorneos)
            .catch(err => setError(err.message));
    }, [equipo.id]);

    useEffect(() => {
        if (!torneoSeleccionado) return;

        apiFetch(`/api/torneos/zonas/torneo/${torneoSeleccionado.id}`)
            .then(setZonas)
            .catch(err => setError(err.message));
    }, [torneoSeleccionado]);

    const torneosFiltrados = torneos.filter(t =>
        t.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    const inscribir = async () => {
        setError(null);
        setLoading(true);

        try {
            await apiFetch(
                `/api/torneos/inscribir/${equipo.id}/zona/${zonaId}`,
                { method: "POST" }
            );

            onInscripto();
            onClose();

        } catch (err) {
            try {
                const parsed = JSON.parse(err.message);
                setError(parsed.message || "Error al inscribir equipo");
            } catch {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#1c213b] p-6 rounded-xl w-full max-w-md flex flex-col">

                {/* HEADER */}
                <h2 className="text-xl font-bold mb-4">
                    Inscribir {equipo.nombre}
                </h2>

                {/* BODY */}
                <div className="flex-1 space-y-4">

                    {/* TORNEOS ACTUALES */}
                    {equipo.inscripciones?.length > 0 && (
                        <div className="bg-[#262b45] rounded-lg p-3">
                            <p className="text-sm font-semibold text-gray-300 mb-2">
                                Torneos actuales
                            </p>

                            <ul className="text-sm text-gray-400 space-y-1">
                                {equipo.inscripciones.map(i => (
                                    <li key={i.id}>
                                        • {i.nombreTorneo}
                                        {i.nombreZona && ` (${i.nombreZona})`}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* ERROR */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500 text-red-400 px-3 py-2 rounded text-sm">
                            {error}
                        </div>
                    )}

                    {/* BUSCADOR TORNEO */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar torneo..."
                            value={busqueda}
                            onChange={(e) => {
                                setBusqueda(e.target.value);
                                setMostrarLista(true);
                            }}
                            onFocus={() => setMostrarLista(true)}
                            className="w-full px-3 py-2 rounded bg-gray-700 outline-none"
                        />

                        {mostrarLista && (
                            <div className="absolute z-10 w-full bg-[#262b45] rounded mt-1 max-h-48 overflow-y-auto">
                                {torneosFiltrados.map(t => (
                                    <div
                                        key={t.id}
                                        className="px-3 py-2 hover:bg-blue-600 cursor-pointer"
                                        onClick={() => {
                                            setTorneoSeleccionado(t);
                                            setMostrarLista(false);
                                            setBusqueda(t.nombre);
                                            setZonaId("");
                                        }}
                                    >
                                        {t.nombre}
                                    </div>
                                ))}

                                {torneosFiltrados.length === 0 && (
                                    <p className="px-3 py-2 text-gray-400">
                                        No se encontraron torneos
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* SELECT ZONA */}
                    {torneoSeleccionado && (
                        <select
                            value={zonaId}
                            onChange={(e) => setZonaId(e.target.value)}
                            className="w-full px-3 py-2 rounded bg-gray-700"
                        >
                            <option value="">Seleccione zona</option>
                            {zonas.map(z => (
                                <option key={z.id} value={z.id}>
                                    {z.nombre}
                                </option>
                            ))}
                        </select>
                    )}

                </div>

                {/* FOOTER */}
                <div className="flex justify-end gap-3 mt-10 pt-4 border-t border-white/10">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-600 rounded"
                        disabled={loading}
                    >
                        Cancelar
                    </button>

                    <button
                        disabled={!zonaId || loading}
                        onClick={inscribir}
                        className="px-4 py-2 bg-blue-600 rounded disabled:opacity-50"
                    >
                        {loading ? "Inscribiendo..." : "Inscribir"}
                    </button>
                </div>

            </div>
        </div>
    );
}
