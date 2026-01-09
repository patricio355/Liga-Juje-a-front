import { useNavigate } from "react-router-dom";
import { FaChevronRight, FaTrophy, FaTools } from "react-icons/fa";

export default function TorneoCard({ torneo }) {
    const navigate = useNavigate();

    // Verificamos si el torneo tiene zonas para permitir el acceso
    const tieneZonas = torneo.zonas && torneo.zonas.length > 0;

    const handleClick = () => {
        if (tieneZonas) {
            navigate(`/torneo/${torneo.slug}`);
        }
    };

    return (
        <div
            onClick={handleClick}
            className={`w-full max-w-2xl mx-auto p-6 rounded-[2rem] border transition-all relative overflow-hidden group 
                ${tieneZonas
                ? "bg-[#0e1630] cursor-pointer border-blue-900/40 hover:border-blue-500/60 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                : "bg-[#0a0f24] cursor-default border-slate-800 opacity-80"
            }`}
        >
            {/* Resplandor de fondo solo si es clickeable */}
            {tieneZonas && (
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2rem] blur opacity-0 group-hover:opacity-10 transition duration-500"></div>
            )}

            <div className="flex justify-between items-center relative z-10">
                <div className="flex-1">
                    {/* Badge superior */}
                    <div className="inline-flex items-center gap-1.5 mb-3 px-3 py-1 rounded-full bg-[#050814] border border-blue-800/50 shadow-inner">
                        <FaTrophy className={`${tieneZonas ? "text-blue-500" : "text-slate-600"} text-[10px]`} />
                        <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${tieneZonas ? "text-blue-400" : "text-slate-500"}`}>
                            LIGA
                        </span>
                    </div>

                    <h2 className={`text-2xl font-black uppercase italic tracking-tighter transition-colors leading-none ${tieneZonas ? "text-white group-hover:text-blue-400" : "text-slate-500"}`}>
                        {torneo.nombre}
                    </h2>

                    {/* División Condicional: Solo se muestra si existe y no es vacío */}
                    {torneo.division && (
                        <p className="text-[10px] font-black bg-gradient-to-r from-slate-400 to-slate-100 bg-clip-text text-transparent uppercase tracking-[0.3em] mt-2 italic">
                            Division {torneo.division}
                        </p>
                    )}

                    {/* Cartel de "En proceso" si no hay zonas */}
                    {!tieneZonas && (
                        <div className="inline-flex items-center gap-2 mt-4 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                            <FaTools className="text-amber-500 text-[10px]" />
                            <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">
                                En proceso de creación
                            </span>
                        </div>
                    )}
                </div>

                {/* Botón lateral: Cambia según si está disponible o no */}
                <div className={`ml-4 p-4 rounded-2xl border transition-all duration-500 
                    ${tieneZonas
                    ? "bg-[#050814] border-blue-900/50 group-hover:bg-blue-600 group-hover:border-blue-400 group-hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                    : "bg-[#050814] border-slate-800"
                }`}
                >
                    {tieneZonas ? (
                        <FaChevronRight className="text-blue-500 group-hover:text-white transition-colors size-5 translate-x-0 group-hover:translate-x-1 transition-transform duration-300" />
                    ) : (
                        <FaTools size={18} className="text-slate-700" />
                    )}
                </div>
            </div>
        </div>
    );
}