import { FaEdit, FaTrash, FaUserShield, FaEnvelope, FaCircle } from "react-icons/fa";

export default function UsuarioCard({ usuario, onEdit, onDelete }) {
    return (
        <div className="bg-[#1e293b] p-6 md:p-8 rounded-[2rem] border border-slate-700/30 shadow-2xl flex flex-col lg:flex-row justify-between items-start lg:items-center group hover:border-emerald-500/40 transition-all relative overflow-hidden">

            <div className="flex-1 w-full">
                <div className="flex items-center gap-5 flex-wrap">
                    {/* Icono de Perfil Estilizado */}
                    <div className="w-12 h-12 bg-[#0f172a] rounded-2xl flex items-center justify-center text-emerald-500 border border-slate-700/50 shadow-inner">
                        <FaUserShield size={20} />
                    </div>

                    <div>
                        <h3 className="text-xl font-black text-white uppercase italic tracking-tight group-hover:text-emerald-400 transition-colors leading-none">
                            {usuario.nombre}
                        </h3>

                        <div className="mt-2 flex items-center gap-4">
                            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                                <FaEnvelope className="text-emerald-500/50" />
                                <span className="text-slate-300 lowercase">{usuario.email}</span>
                            </div>
                        </div>
                    </div>

                    {/* Badge de Rol estilo Torneos */}
                    <span className={`ml-auto lg:ml-0 text-[10px] px-4 py-1.5 rounded-xl font-black border tracking-[0.1em] ${
                        usuario.rol?.toUpperCase() === 'ADMIN'
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                            : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>
                        {usuario.rol?.toUpperCase()}
                    </span>
                </div>

                <div className="mt-4 flex items-center gap-2">
                    <FaCircle size={8} className="text-emerald-500 animate-pulse" />
                    <p className="text-[10px] font-black uppercase text-slate-600 italic tracking-[0.2em]">
                        Acceso habilitado al sistema
                    </p>
                </div>
            </div>

            {/* BOTONES DE ACCIÓN - Idénticos a TorneosList */}
            <div className="flex gap-3 mt-8 lg:mt-0 w-full lg:w-auto">
                <button
                    title="Editar Usuario"
                    className="flex-1 lg:w-14 lg:h-14 p-4 bg-[#0f172a] hover:bg-amber-600 border border-slate-700/50 rounded-2xl text-amber-500 hover:text-white transition-all shadow-inner flex items-center justify-center"
                    onClick={() => onEdit(usuario)}
                >
                    <FaEdit size={20} />
                </button>

                <button
                    title="Desactivar / Eliminar"
                    className="flex-1 lg:w-14 lg:h-14 p-4 bg-[#0f172a] hover:bg-red-600 border border-slate-700/50 rounded-2xl text-red-500 hover:text-white transition-all shadow-inner flex items-center justify-center"
                    onClick={() => onDelete(usuario.id)}
                >
                    <FaTrash size={20} />
                </button>
            </div>
        </div>
    );
}