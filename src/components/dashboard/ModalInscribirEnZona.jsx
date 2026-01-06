import { useEffect, useState } from "react";
import { apiFetch } from "../../api/api";
import { FaSearch, FaTimes, FaUserPlus, FaFutbol } from "react-icons/fa";

export default function ModalInscribirEnZona({ zona, torneo, onClose, onUpdated }) {
    const [equiposBase, setEquiposBase] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [loading, setLoading] = useState(true);
    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState(null);

    // 1. Carga de equipos global (Catálogo)
    useEffect(() => {
        const cargarEquipos = async () => {
            try {
                const data = await apiFetch("/api/equipos");
                setEquiposBase(data || []);
            } catch (err) {
                console.error("Error al cargar equipos:", err);
                setError("No se pudieron cargar los equipos");
            } finally {
                setLoading(false);
            }
        };
        cargarEquipos();
    }, []);

    // 2. Lógica de Filtrado: Obtenemos IDs de todos los equipos ya inscritos en CUALQUIER zona del torneo
    const idsEquiposInscritos = torneo?.zonas?.flatMap(z =>
        z.equipos?.map(e => e.id) || []
    ) || [];

    const handleInscribir = async (equipoId) => {
        if (!zona?.id) return;
        setEnviando(true);
        setError(null);

        try {
            // REVISIÓN DE URL: Asegúrate que el orden idEquipo/idZona sea el que espera tu Controller
            await apiFetch(`/api/torneos/inscribir/${equipoId}/zona/${zona.id}`, {
                method: "POST"
            });

            // Sincronización asíncrona: Esperamos la recarga del caché antes de cerrar
            if (onUpdated) {
                await onUpdated();
            }
            onClose();
        } catch (err) {
            // Si el backend lanza el error de "ya existe", lo capturamos aquí
            setError(err.message || "Este equipo ya está registrado en la competición.");
        } finally {
            setEnviando(false);
        }
    };

    // Filtramos: Que coincida con la búsqueda Y que NO esté en la lista de inscritos
    const disponibles = equiposBase.filter(e =>
        e.nombre?.toLowerCase().includes(busqueda.toLowerCase()) &&
        !idsEquiposInscritos.includes(e.id)
    );

    if (!torneo || !zona) return null;

    return (
        <div className="fixed inset-0 bg-[#0f172a]/90 backdrop-blur-sm flex justify-center items-center z-[250] p-4" onClick={onClose}>
            <div
                className="bg-[#1e293b] w-full max-w-md rounded-[2.5rem] border border-slate-700/50 shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Estilo Pro */}
                <div className="bg-[#111827]/50 px-8 py-6 border-b border-slate-700/50 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 rounded-lg">
                            <FaUserPlus className="text-emerald-500" />
                        </div>
                        <div>
                            <h3 className="text-xs font-black uppercase italic tracking-widest text-white leading-none">Inscribir Equipo</h3>
                            <p className="text-[10px] font-bold text-emerald-500 uppercase mt-1">Zona: {zona.nombre}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                        <FaTimes size={18} />
                    </button>
                </div>

                {/* Buscador Optimizado */}
                <div className="p-6 pb-0">
                    <div className="relative">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                        <input
                            type="text"
                            placeholder="Buscar equipo disponible..."
                            className="w-full bg-[#0f172a] border border-slate-700/50 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-slate-200 outline-none focus:border-emerald-500 transition-all placeholder:text-slate-700 shadow-inner"
                            autoFocus
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="mx-6 mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                        <p className="text-[10px] font-black text-red-400 uppercase text-center">{error}</p>
                    </div>
                )}

                {/* Lista de equipos con Scroll Esmeralda */}
                <div className="max-h-[350px] overflow-y-auto p-4 space-y-2 custom-scrollbar">
                    {loading ? (
                        <div className="flex flex-col items-center py-12 gap-4">
                            <FaFutbol className="text-3xl text-emerald-600 animate-spin" />
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Consultando Catálogo...</p>
                        </div>
                    ) : disponibles.length > 0 ? (
                        disponibles.map(equipo => (
                            <div key={equipo.id} className="flex justify-between items-center p-4 bg-[#0f172a]/40 hover:bg-emerald-500/5 rounded-2xl border border-slate-700/30 hover:border-emerald-500/30 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-[#0f172a] rounded-xl flex items-center justify-center text-xs font-black text-emerald-500 border border-slate-700/50 group-hover:border-emerald-500/50 transition-all">
                                        {equipo.nombre?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{equipo.nombre}</span>
                                </div>
                                <button
                                    disabled={enviando}
                                    onClick={() => handleInscribir(equipo.id)}
                                    className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-[10px] font-black px-5 py-2.5 rounded-xl transition-all shadow-lg active:scale-95 uppercase tracking-tighter"
                                >
                                    {enviando ? "..." : "Inscribir"}
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 px-6">
                            <p className="text-[11px] font-bold text-slate-600 uppercase tracking-widest leading-relaxed italic">
                                No se encontraron equipos disponibles o ya forman parte de este torneo.
                            </p>
                        </div>
                    )}
                </div>

                <div className="p-5 bg-[#111827]/30 text-center border-t border-slate-700/50">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Validación de inscripción centralizada</p>
                </div>
            </div>
        </div>
    );
}