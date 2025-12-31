import { useNavigate } from "react-router-dom";
import { FaChevronRight, FaTrophy } from "react-icons/fa";

export default function TorneoCard({ torneo }) {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/torneo/${torneo.id}`)}
            className="w-full max-w-2xl mx-auto bg-[#1e293b] p-6 rounded-2xl cursor-pointer border border-slate-700/40 hover:border-emerald-500/50 transition-all shadow-xl group relative overflow-hidden"
        >
            <div className="flex justify-between items-center relative z-10">
                <div className="flex-1">
                    {/* Badge superior estilo "hueco" */}
                    <div className="inline-flex items-center gap-1.5 mb-3 px-2 py-1 rounded-md bg-[#0f172a] border border-slate-700/50">
                        <FaTrophy className="text-emerald-500 text-[10px]" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            Competencia Oficial
                        </span>
                    </div>

                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter group-hover:text-emerald-400 transition-colors">
                        {torneo.nombre}
                    </h2>

                    <p className="text-[10px] font-bold text-emerald-500/80 uppercase tracking-[0.2em] mt-1">
                        División {torneo.division || "A"}
                    </p>

                    {/* Zonas con fondo oscuro para resaltar */}
                    <div className="mt-6 flex items-center gap-3">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Zonas:</span>
                        <div className="flex gap-2 flex-wrap">
                            {torneo.zonas?.map((z, idx) => (
                                <span key={idx} className="text-[9px] px-3 py-1 rounded-lg bg-[#0f172a] border border-slate-700/50 text-slate-300 font-bold">
                                    {z.nombre}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Botón lateral estilizado */}
                <div className="ml-4 bg-[#0f172a] p-4 rounded-xl border border-slate-700/50 group-hover:bg-emerald-600 group-hover:border-emerald-500 transition-all duration-300 shadow-inner">
                    <FaChevronRight className="text-emerald-500 group-hover:text-white transition-colors size-5" />
                </div>
            </div>
        </div>
    );
}