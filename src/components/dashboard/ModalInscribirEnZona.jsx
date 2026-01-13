import { useEffect, useState } from "react";
import { apiFetch } from "../../api/api";
// AGREGADO FaLayerGroup AQUÍ ABAJO
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
        <div className="fixed inset-0 bg-[#040714]/90 backdrop-blur-md flex justify-center items-center z-[500] p-4" onClick={onClose}>
            <div
                className="bg-[#0a0f2c] w-full max-w-md rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Decoración de fondo */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl"></div>

                {/* Header */}
                <div className="bg-[#05081c]/50 px-8 py-6 border-b border-slate-800 flex justify-between items-center relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 text-cyan-500">
                            <FaUserPlus size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-white leading-none">Inscribir Equipo</h3>
                            <p className="text-[10px] font-bold text-cyan-500 uppercase mt-1.5 tracking-tighter">Zona Destino: {zona.nombre}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="bg-slate-800/50 p-2 rounded-xl text-slate-400 hover:text-white transition-all">
                        <FaTimes size={16} />
                    </button>
                </div>

                {/* Buscador */}
                <div className="p-6 pb-2 relative z-10">
                    <div className="relative">
                        <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Buscar en mis equipos..."
                            className="w-full bg-[#040714] border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold text-slate-200 outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-600 shadow-inner uppercase tracking-widest"
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
                <div className="max-h-[380px] overflow-y-auto p-6 space-y-3 custom-scrollbar relative z-10">
                    {loading ? (
                        <div className="flex flex-col items-center py-16 gap-4 opacity-50">
                            <FaFutbol className="text-4xl text-cyan-500 animate-spin" />
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Cargando Autorizados</p>
                        </div>
                    ) : disponibles.length > 0 ? (
                        disponibles.map(equipo => (
                            <div key={equipo.id} className="flex justify-between items-center p-4 bg-[#05081c] hover:bg-[#0d153a] rounded-[1.5rem] border border-slate-800 hover:border-cyan-500/30 transition-all group">
                                <div className="flex items-center gap-4 overflow-hidden">
                                    <div className="w-12 h-12 bg-[#0a0f2c] rounded-2xl border border-slate-800 flex items-center justify-center shrink-0 overflow-hidden shadow-inner group-hover:border-cyan-500/30 transition-all">
                                        {equipo.escudo ? (
                                            <img
                                                src={equipo.escudo}
                                                alt={equipo.nombre}
                                                className="w-full h-full object-contain p-1.5"
                                            />
                                        ) : (
                                            <FaShieldAlt className="text-slate-700 text-xl" />
                                        )}
                                    </div>
                                    <div className="truncate">
                                        <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest group-hover:text-white transition-colors block truncate">
                                            {equipo.nombre}
                                        </span>
                                        <span className="text-[8px] font-bold text-slate-600 uppercase">Disponible</span>
                                    </div>
                                </div>
                                <button
                                    disabled={enviando}
                                    onClick={() => handleInscribir(equipo.id)}
                                    className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-[10px] font-black px-5 py-3 rounded-xl transition-all shadow-lg active:scale-95 uppercase tracking-widest shrink-0"
                                >
                                    {enviando ? "..." : "Inscribir"}
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-16 px-6 border border-dashed border-slate-800 rounded-[2rem]">
                            <FaLayerGroup className="mx-auto text-slate-800 mb-4" size={30} />
                            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest leading-relaxed italic">
                                {busqueda ? "No hay coincidencias." : "No hay equipos disponibles."}
                            </p>
                        </div>
                    )}
                </div>

                <div className="p-5 bg-[#05081c]/50 text-center border-t border-slate-800">
                    <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em]">
                        Seguridad de la Liga • Control de Acceso
                    </p>
                </div>
            </div>
        </div>
    );
}