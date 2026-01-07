import { useNavigate } from "react-router-dom";
import { FaChevronRight, FaTrophy } from "react-icons/fa";

export default function TorneoCard({ torneo }) {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/torneo/${torneo.slug}`)}
            className="w-full max-w-2xl mx-auto bg-[#0e1630] p-6 rounded-[2rem] cursor-pointer border border-blue-900/40 hover:border-blue-500/60 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.5)] group relative overflow-hidden"
        >
            {/* Resplandor de fondo al hacer hover */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2rem] blur opacity-0 group-hover:opacity-10 transition duration-500"></div>

            <div className="flex justify-between items-center relative z-10">
                <div className="flex-1">
                    {/* Badge superior estilo Champions */}
                    <div className="inline-flex items-center gap-1.5 mb-3 px-3 py-1 rounded-full bg-[#050814] border border-blue-800/50 shadow-inner">
                        <FaTrophy className="text-blue-500 text-[10px]" />
                        <span className="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em]">
                            LIGA
                        </span>
                    </div>

                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter group-hover:text-blue-400 transition-colors leading-none">
                        {torneo.nombre}
                    </h2>

                    {/* Gradiente plateado para la división */}
                    <p className="text-[10px] font-black bg-gradient-to-r from-slate-400 to-slate-100 bg-clip-text text-transparent uppercase tracking-[0.3em] mt-2 italic">
                        Division {torneo.division || "A"}
                    </p>
                </div>

                {/* Botón lateral estilizado */}
                <div className="ml-4 bg-[#050814] p-4 rounded-2xl border border-blue-900/50 group-hover:bg-blue-600 group-hover:border-blue-400 group-hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all duration-500">
                    <FaChevronRight className="text-blue-500 group-hover:text-white transition-colors size-5 translate-x-0 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
            </div>
        </div>
    );
}