import { useNavigate } from "react-router-dom";
import { FaChevronRight, FaTrophy, FaMars, FaVenus, FaVenusMars } from "react-icons/fa";

export default function TorneoCard({ torneo }) {
    const navigate = useNavigate();

    // Seguridad: si no hay torneo, no renderizar nada
    if (!torneo) return null;

    const handleClick = () => {
        // Navegación directa por slug
        navigate(`/torneo/${torneo.slug}`);
    };

    const getGeneroIcon = () => {
        switch (torneo.genero) {
            case "MASCULINO": return <FaMars />;
            case "FEMENINO": return <FaVenus />;
            case "MIXTO": return <FaVenusMars />;
            default: return null;
        }
    };

    return (
        <div
            onClick={handleClick}
            className="w-full max-w-2xl mx-auto p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border bg-[#0a0c10] cursor-pointer border-slate-800 hover:border-slate-500 shadow-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-all duration-300 relative overflow-hidden group"
        >
            {/* Efecto de resplandor plateado al pasar el mouse */}
            <div className="absolute -inset-1 bg-gradient-to-r from-slate-700 to-slate-500 rounded-[2rem] blur opacity-0 group-hover:opacity-10 transition duration-500"></div>

            <div className="flex items-center gap-3 md:gap-5 relative z-10">

                {/* --- 1. LOGO DEL TORNEO --- */}
                <div className="shrink-0 w-14 h-14 md:w-20 md:h-20 rounded-full border border-slate-700 group-hover:border-slate-400 shadow-lg p-1 overflow-hidden bg-[#05070a] flex items-center justify-center transition-colors">
                    {torneo.fotoUrl ? (
                        <img
                            src={torneo.fotoUrl}
                            alt={torneo.nombre}
                            className="w-full h-full object-cover rounded-full"
                        />
                    ) : (
                        <FaTrophy className="text-slate-800 text-xl md:text-2xl" />
                    )}
                </div>

                {/* --- 2. INFORMACIÓN (TEXTO) --- */}
                <div className="flex-1 min-w-0">
                    {/* Badge de Género */}
                    {torneo.genero && (
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#16181b] border border-slate-700 shadow-sm">
                                <span className="text-slate-400 text-[9px]">
                                    {getGeneroIcon()}
                                </span>
                                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-300">
                                    {torneo.genero}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Nombre del Torneo (Ajustado para no cortarse en móvil) */}
                    <h2 className="text-lg md:text-2xl font-black uppercase italic tracking-tighter text-white group-hover:text-slate-200 transition-colors leading-tight break-words">
                        {torneo.nombre}
                    </h2>

                    {/* División */}
                    {torneo.division && (
                        <p className="text-[9px] md:text-[10px] font-black bg-gradient-to-r from-slate-500 to-slate-300 bg-clip-text text-transparent uppercase tracking-[0.3em] mt-1 italic">
                            Division {torneo.division}
                        </p>
                    )}
                </div>

                {/* --- 3. INDICADOR DE ACCESO (FLECHA) --- */}
                <div className="p-2 md:p-4 rounded-2xl border bg-[#16181b] border-slate-800 group-hover:bg-slate-200 group-hover:border-white group-hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-500 shrink-0 flex items-center justify-center">
                    <FaChevronRight className="text-slate-500 group-hover:text-black transition-colors size-3 md:size-5 translate-x-0 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
            </div>
        </div>
    );
}