import { FaEdit, FaTrash, FaUserShield, FaEnvelope, FaCircle, FaPhoneAlt, FaLock } from "react-icons/fa";

export default function UsuarioCard({ usuario, onEdit, onDelete }) {

    // Determinar si el usuario está activo o no
    const isActivo = usuario.activo === true;

    // Mapeo de colores por rol
    const getRolStyle = (rol) => {
        const r = rol?.toUpperCase();
        if (!isActivo) return 'bg-slate-900 text-slate-600 border-slate-800'; // Estilo apagado
        if (r === 'ADMIN') return 'bg-cyan-500/10 text-cyan-400 border-cyan-400/20';
        if (r === 'ENCARGADOTORNEO') return 'bg-emerald-500/10 text-emerald-400 border-emerald-400/20';
        return 'bg-slate-800 text-slate-400 border-slate-700';
    };

    return (
        <div className={`bg-[#0a0f2c] p-6 rounded-[1.5rem] border transition-all flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 group relative
            ${isActivo
            ? 'border-slate-800 hover:border-cyan-500/30'
            : 'border-red-900/20 opacity-60 grayscale-[0.5]'
        }`}
        >
            {/* Marca de agua / Icono de candado si está inactivo */}
            {!isActivo && (
                <div className="absolute right-6 top-6 text-red-500/20 pointer-events-none">
                    <FaLock size={40} />
                </div>
            )}

            <div className="flex-1 w-full">
                <div className="flex items-start md:items-center gap-5">
                    {/* Icono de Perfil */}
                    <div className={`hidden md:flex w-14 h-14 rounded-2xl items-center justify-center border shadow-inner shrink-0 transition-colors
                        ${isActivo ? 'bg-[#040714] text-cyan-500 border-slate-800' : 'bg-black text-slate-700 border-slate-900'}`}
                    >
                        <FaUserShield size={24} />
                    </div>

                    <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                            <h3 className={`text-lg font-bold tracking-tight ${isActivo ? 'text-white' : 'text-slate-500'}`}>
                                {usuario.nombre}
                            </h3>
                            <span className={`w-fit text-[10px] px-3 py-1 rounded-lg font-bold border tracking-wider uppercase transition-colors ${getRolStyle(usuario.rol)}`}>
                                {usuario.rol}
                            </span>
                        </div>

                        {/* Información de Contacto */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-6">
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                <FaEnvelope className={`${isActivo ? 'text-cyan-500/70' : 'text-slate-700'} text-xs`} />
                                <span className="truncate">{usuario.email}</span>
                            </div>

                            {usuario.telefono && (
                                <div className="flex items-center gap-2 text-sm text-slate-400">
                                    <FaPhoneAlt className={`${isActivo ? 'text-cyan-500/70' : 'text-slate-700'} text-xs`} />
                                    <span>{usuario.telefono}</span>
                                </div>
                            )}

                            {usuario.dni && (
                                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                                    <span className={isActivo ? 'text-cyan-500/50' : 'text-slate-800'}>DNI:</span>
                                    <span className={isActivo ? 'text-slate-400' : 'text-slate-600'}>{usuario.dni}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Status bar inferior */}
                <div className={`mt-4 flex items-center gap-2 border-t pt-3 transition-colors ${isActivo ? 'border-slate-800/50' : 'border-red-900/10'}`}>
                    <FaCircle size={7} className={`${isActivo ? 'text-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse' : 'text-red-600 shadow-[0_0_8px_rgba(220,38,38,0.3)]'}`} />
                    <p className={`text-[11px] font-bold uppercase tracking-wider ${isActivo ? 'text-slate-500' : 'text-red-900/60'}`}>
                        {isActivo ? 'Acceso Habilitado' : 'Acceso Restringido / Inactivo'}
                        <span className="mx-2 text-slate-800">•</span>
                        <span className="text-slate-600 font-medium lowercase italic">Alta por: {usuario.creadorNombre || 'Sistema'}</span>
                    </p>
                </div>
            </div>

            {/* BOTONES DE ACCIÓN */}
            <div className="flex gap-2 w-full lg:w-auto relative z-10">
                <button
                    title="Editar Perfil"
                    className="flex-1 lg:w-12 lg:h-12 p-3 bg-[#040714] hover:bg-cyan-600/20 border border-slate-800 hover:border-cyan-500/50 rounded-xl text-slate-400 hover:text-cyan-400 transition-all flex items-center justify-center"
                    onClick={() => onEdit(usuario)}
                >
                    <FaEdit size={18} />
                </button>

                <button
                    title={isActivo ? "Desactivar Usuario" : "Activar Usuario"}
                    className={`flex-1 lg:w-12 lg:h-12 p-3 bg-[#040714] border border-slate-800 rounded-xl transition-all flex items-center justify-center
                        ${isActivo
                        ? 'text-slate-500 hover:bg-red-600/10 hover:border-red-500/50 hover:text-red-500'
                        : 'text-emerald-500 hover:bg-emerald-600/10 hover:border-emerald-500/50'
                    }`}
                    onClick={() => onDelete(usuario.id)}
                >
                    <FaTrash size={18} />
                </button>
            </div>
        </div>
    );
}