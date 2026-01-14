import { useNavigate } from "react-router-dom";
import { FaChevronRight, FaTrophy, FaTools, FaMars, FaVenus, FaVenusMars } from "react-icons/fa";

export default function TorneoCard({ torneo }) {
    const navigate = useNavigate();

    // Verificamos si el torneo tiene zonas para permitir el acceso
    const tieneZonas = torneo.zonas && torneo.zonas.length > 0;

    const handleClick = () => {
        if (tieneZonas) {
            navigate(`/torneo/${torneo.slug}`);
        }
    };

    // Función auxiliar para el icono de género
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
            className={`w-full max-w-2xl mx-auto p-5 md:p-6 rounded-[2rem] border transition-all duration-300 relative overflow-hidden group 
                ${tieneZonas
                ? "bg-[#0a0c10] cursor-pointer border-slate-800 hover:border-slate-500 shadow-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]"
                : "bg-[#05070a] cursor-default border-slate-900 opacity-60"
            }`}
        >
            {/* Resplandor plateado sutil al hacer hover */}
            {tieneZonas && (
                <div className="absolute -inset-1 bg-gradient-to-r from-slate-700 to-slate-500 rounded-[2rem] blur opacity-0 group-hover:opacity-10 transition duration-500"></div>
            )}

            <div className="flex items-center gap-5 relative z-10">

                {/* --- 1. IMAGEN / LOGO (Izquierda) --- */}
                <div className={`shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-full border p-1 overflow-hidden bg-[#05070a] flex items-center justify-center 
                    ${tieneZonas ? "border-slate-700 group-hover:border-slate-400 shadow-lg" : "border-slate-900 opacity-50"}`}
                >
                    {torneo.fotoUrl ? (
                        <img
                            src={torneo.fotoUrl}
                            alt={torneo.nombre}
                            className="w-full h-full object-cover rounded-full"
                        />
                    ) : (
                        <FaTrophy className="text-slate-800 text-2xl" />
                    )}
                </div>

                {/* --- 2. CONTENIDO TEXTO (Centro) --- */}
                <div className="flex-1 min-w-0">

                    {/* Badges Superiores: LIGA + GÉNERO */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        {/* Badge Tipo */}
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#16181b] border border-slate-700 shadow-sm">
                            <FaTrophy className={`${tieneZonas ? "text-slate-400" : "text-slate-700"} text-[9px]`} />
                            <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${tieneZonas ? "text-slate-300" : "text-slate-600"}`}>
                                LIGA
                            </span>
                        </div>

                        {/* Badge Género */}
                        {torneo.genero && (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#16181b] border border-slate-700 shadow-sm">
                                <span className={`${tieneZonas ? "text-slate-400" : "text-slate-700"} text-[9px]`}>
                                    {getGeneroIcon()}
                                </span>
                                <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${tieneZonas ? "text-slate-300" : "text-slate-600"}`}>
                                    {torneo.genero}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Título del Torneo */}
                    <h2 className={`text-xl md:text-2xl font-black uppercase italic tracking-tighter transition-colors leading-none truncate ${tieneZonas ? "text-white group-hover:text-slate-200" : "text-slate-600"}`}>
                        {torneo.nombre}
                    </h2>

                    {/* División (Gradiente Metálico) */}
                    {torneo.division && (
                        <p className="text-[10px] font-black bg-gradient-to-r from-slate-500 to-slate-300 bg-clip-text text-transparent uppercase tracking-[0.3em] mt-1.5 italic">
                            Division {torneo.division}
                        </p>
                    )}

                    {/* Cartel de "En proceso" */}
                    {!tieneZonas && (
                        <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-lg bg-[#16181b] border border-amber-900/30">
                            <FaTools className="text-amber-600 text-[9px]" />
                            <span className="text-[8px] font-black text-amber-600 uppercase tracking-widest">
                                Configurando torneo
                            </span>
                        </div>
                    )}
                </div>

                {/* --- 3. FLECHA (Derecha) --- */}
                <div className={`p-3 md:p-4 rounded-2xl border transition-all duration-500 shrink-0
                    ${tieneZonas
                    ? "bg-[#16181b] border-slate-800 group-hover:bg-slate-200 group-hover:border-white group-hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                    : "bg-[#0a0c10] border-slate-900"
                }`}
                >
                    {tieneZonas ? (
                        <FaChevronRight className="text-slate-500 group-hover:text-black transition-colors size-4 md:size-5 translate-x-0 group-hover:translate-x-1 transition-transform duration-300" />
                    ) : (
                        <FaTools size={16} className="text-slate-800" />
                    )}
                </div>
            </div>
        </div>
    );
}