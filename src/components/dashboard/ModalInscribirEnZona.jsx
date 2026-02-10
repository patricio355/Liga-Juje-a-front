import { useEffect, useState } from "react";
import { apiFetch } from "../../api/api";
import { FaSearch, FaTimes, FaUserPlus, FaFutbol, FaShieldAlt, FaLayerGroup } from "react-icons/fa";

export default function ModalInscribirEnZona({ zona, torneo, onClose, onUpdated }) {
    const [equiposBase, setEquiposBase] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [loading, setLoading] = useState(true);
    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cargarEquipos = async () => {
            try {
                const data = await apiFetch("/api/equipos/mis-equipos");
                setEquiposBase(data || []);
            } catch (err) {
                console.error("Error al cargar equipos:", err);
                setError("No se pudieron cargar los equipos autorizados");
            } finally {
                setLoading(false);
            }
        };
        cargarEquipos();
    }, []);

    const idsEquiposInscritos = torneo?.zonas?.flatMap(z =>
        z.equipos?.map(e => e.id) || []
    ) || [];

    const handleInscribir = async (equipoId) => {
        if (!zona?.id) return;
        setEnviando(true);
        setError(null);

        try {
            await apiFetch(`/api/torneos/inscribir/${equipoId}/zona/${zona.id}`, {
                method: "POST"
            });

            if (onUpdated) {
                await onUpdated();
            }
            onClose();
        } catch (err) {
            setError(err.message || "Este equipo ya está registrado en la competición.");
        } finally {
            setEnviando(false);
        }
    };

    const disponibles = equiposBase.filter(e =>
        e.nombre?.toLowerCase().includes(busqueda.toLowerCase()) &&
        !idsEquiposInscritos.includes(e.id)
    );

    if (!torneo || !zona) return null;

    return (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex justify-center items-center z-[500] p-4" onClick={onClose}>
            <div
                className="bg-[#0a0a0a] w-full max-w-md rounded-[2.5rem] border border-white/10 shadow-[0_0_50px_-12px_rgba(255,255,255,0.1)] overflow-hidden relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-[#111]/50 px-8 py-7 border-b border-white/5 flex justify-between items-center relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-white">
                            <FaUserPlus size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-white leading-none">Inscribir Equipo</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mt-1.5 tracking-tighter">
                                Zona Destino: <span className="text-white">{zona.nombre}</span>
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="bg-white/5 p-2.5 rounded-xl text-slate-500 hover:text-white border border-white/5 transition-all">
                        <FaTimes size={16} />
                    </button>
                </div>

                {/* Buscador */}
                <div className="p-6 pb-2 relative z-10">
                    <div className="relative">
                        <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" />
                        <input
                            type="text"
                            placeholder="Buscar equipo por nombre..."
                            className="w-full bg-black border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold text-white outline-none focus:border-white/30 transition-all placeholder:text-slate-800 shadow-inner uppercase tracking-widest"
                            autoFocus
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="mx-6 mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl animate-pulse">
                        <p className="text-[9px] font-black text-red-400 uppercase text-center tracking-widest">{error}</p>
                    </div>
                )}

                {/* Lista de Equipos */}
                <div className="max-h-[380px] overflow-y-auto p-6 space-y-4 custom-scrollbar relative z-10">
                    {loading ? (
                        <div className="flex flex-col items-center py-16 gap-4 opacity-50">
                            <FaFutbol className="text-4xl text-white animate-spin" />
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Cargando Autorizados</p>
                        </div>
                    ) : disponibles.length > 0 ? (
                        disponibles.map(equipo => (
                            <div
                                key={equipo.id}
                                className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-5 bg-[#111] hover:bg-[#1a1a1a] rounded-[2rem] border border-white/5 hover:border-white/20 transition-all group gap-5"
                            >
                                <div className="flex items-center gap-5">
                                    {/* Escudo Agrandado */}
                                    <div className="w-16 h-16 bg-black rounded-2xl border border-white/10 flex items-center justify-center shrink-0 overflow-hidden shadow-inner group-hover:border-white/30 transition-all">
                                        {equipo.escudo ? (
                                            <img
                                                src={equipo.escudo}
                                                alt={equipo.nombre}
                                                className="w-full h-full object-contain p-2"
                                            />
                                        ) : (
                                            <FaShieldAlt className="text-slate-800 text-2xl" />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <span className="text-xs font-black text-slate-300 uppercase tracking-widest group-hover:text-white transition-colors block break-words">
                                            {equipo.nombre}
                                        </span>
                                        <span className="text-[8px] font-bold text-slate-600 uppercase tracking-tighter block mt-1">
                                            Disponible para inscripción
                                        </span>
                                    </div>
                                </div>

                                <button
                                    disabled={enviando}
                                    onClick={() => handleInscribir(equipo.id)}
                                    className="w-full sm:w-auto bg-white hover:bg-slate-200 disabled:opacity-20 text-black text-[10px] font-black px-8 py-4 rounded-xl transition-all shadow-lg active:scale-95 uppercase tracking-widest shrink-0"
                                >
                                    {enviando ? "..." : "Inscribir"}
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-16 px-6 border border-dashed border-white/10 rounded-[2rem]">
                            <FaLayerGroup className="mx-auto text-white/10 mb-4" size={30} />
                            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest leading-relaxed italic">
                                {busqueda ? "No hay coincidencias." : "No hay equipos disponibles."}
                            </p>
                        </div>
                    )}
                </div>

                <div className="p-6 bg-black text-center border-t border-white/5">
                    <p className="text-[8px] font-black text-slate-700 uppercase tracking-[0.4em]">
                        Seguridad de la Liga • Control de Acceso
                    </p>
                </div>
            </div>
        </div>
    );
}