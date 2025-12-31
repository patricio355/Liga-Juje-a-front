import { useEffect, useState } from "react";
import { apiFetch } from "../../api/api";
import { FaSearch, FaTimes } from "react-icons/fa";

export default function ModalInscribirEnZona({ zona, torneo, onClose, onSuccess }) {
    const [equiposBase, setEquiposBase] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [loading, setLoading] = useState(true);
    const [enviando, setEnviando] = useState(false);

    // 1. Carga de equipos
    useEffect(() => {
        const cargarEquipos = async () => {
            try {
                const data = await apiFetch("/api/equipos");
                setEquiposBase(data || []);
            } catch (err) {
                console.error("Error al cargar equipos:", err);
            } finally {
                setLoading(false);
            }
        };
        cargarEquipos();
    }, []);

    // 2. Blindaje: Si no hay torneo o zona, no procesamos nada
    // Usamos ?. para que si torneo es null, no explote al leer zonas
    const idsEquiposInscritos = torneo?.zonas?.flatMap(z =>
        z.equipos?.map(e => e.id) || []
    ) || [];

    const handleInscribir = async (equipoId) => {
        if (!zona?.id) return;
        setEnviando(true);
        try {
            await apiFetch(`/api/torneos/inscribir/${equipoId}/zona/${zona.id}`, {
                method: "POST"
            });
            onSuccess();
            onClose();
        } catch (err) {
            alert("Error al inscribir el equipo.");
        } finally {
            setEnviando(false);
        }
    };

    const disponibles = equiposBase.filter(e =>
        e.nombre?.toLowerCase().includes(busqueda.toLowerCase()) &&
        !idsEquiposInscritos.includes(e.id)
    );

    // Si por alguna razón los props obligatorios no están, no mostramos nada
    if (!torneo || !zona) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
            <div className="bg-[#1c213b] w-full max-w-md rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-[#242b4d]">
                    <div>
                        <h3 className="text-lg font-bold text-white">Inscribir Equipo</h3>
                        <p className="text-xs text-blue-400 font-semibold uppercase">Zona: {zona.nombre}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Buscador */}
                <div className="p-4">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-3 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Buscar equipo disponible..."
                            className="w-full bg-gray-900 border border-gray-700 rounded-xl py-2.5 pl-10 pr-4 text-white outline-none focus:border-blue-500 transition"
                            autoFocus
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>
                </div>

                {/* Lista de equipos */}
                <div className="max-h-[400px] overflow-y-auto p-2">
                    {loading ? (
                        <div className="flex flex-col items-center py-10 gap-2">
                            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-sm text-gray-500">Buscando equipos...</p>
                        </div>
                    ) : disponibles.length > 0 ? (
                        disponibles.map(equipo => (
                            <div key={equipo.id} className="flex justify-between items-center p-3 hover:bg-blue-600/10 rounded-xl transition group border border-transparent hover:border-blue-600/30 mb-1">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-sm font-bold text-blue-400 border border-gray-700">
                                        {equipo.nombre?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-gray-200 font-medium">{equipo.nombre}</span>
                                </div>
                                <button
                                    disabled={enviando}
                                    onClick={() => handleInscribir(equipo.id)}
                                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-4 py-2 rounded-lg font-bold transition shadow-lg active:scale-95"
                                >
                                    {enviando ? "Cargando..." : "INSCRIBIR"}
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-gray-500 text-sm">No hay equipos disponibles o ya están en el torneo.</p>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-[#242b4d]/50 text-center border-t border-gray-700">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">Solo aparecen equipos fuera de este torneo</p>
                </div>
            </div>
        </div>
    );
}