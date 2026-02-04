import { FaEdit, FaTrash, FaUserShield, FaEnvelope, FaCircle, FaPhoneAlt, FaLock } from "react-icons/fa";

export default function UsuarioCard({ usuario, onEdit, onDelete }) {

    // Determinar si el usuario está activo o no
    const isActivo = usuario.activo === true;

    // Mapeo de colores por rol (Estética Plateada)
    const getRolStyle = (rol) => {
        const r = rol?.toUpperCase();
        if (!isActivo) return 'bg-black text-slate-700 border-white/5';
        if (r === 'ADMIN') return 'bg-white text-black border-white'; // Resalte máximo
        if (r === 'ENCARGADOTORNEO') return 'bg-white/10 text-white border-white/20';
        return 'bg-transparent text-slate-400 border-white/10';
    };

    return (
        <div className={`bg-[#0a0c10] p-6 rounded-[2rem] border transition-all duration-500 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 group relative overflow-hidden
            ${isActivo
            ? 'border-white/5 hover:border-white/20 shadow-2xl'
            : 'border-red-900/10 opacity-50 grayscale'
        }`}
        >
            {/* Brillo sutil de fondo en hover */}
            {isActivo && (
                <div className="absolute inset-0 bg-gradient-to-r from-slate-400/0 via-slate-400/0 to-slate-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            )}

            {/* Marca de agua si está inactivo */}
            {!isActivo && (
                <div className="absolute right-8 top-1/2 -translate-y-1/2 text-red-600/10 pointer-events-none">
                    <FaLock size={60} />
                </div>
            )}

            <div className="flex-1 w-full relative z-10">
                <div className="flex items-start md:items-center gap-6">
                    {/* Icono de Perfil estilo Premium */}
                    <div className={`hidden md:flex w-14 h-14 rounded-2xl items-center justify-center border shadow-[0_10px_20px_rgba(0,0,0,0.4)] shrink-0 transition-all duration-500
                        ${isActivo
                        ? 'bg-black text-slate-300 border-white/10 group-hover:border-white/30'
                        : 'bg-black text-slate-700 border-white/5'}`}
                    >
                        <FaUserShield size={24} />
                    </div>

                    <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-3">
                            <h3 className={`text-xl font-black italic uppercase tracking-tighter transition-colors ${isActivo ? 'text-white' : 'text-slate-600'}`}>
                                {usuario.nombre}
                            </h3>
                            <span className={`w-fit text-[9px] px-3 py-1 rounded-full font-black border tracking-[0.2em] uppercase transition-all ${getRolStyle(usuario.rol)}`}>
                                {usuario.rol}
                            </span>
                        </div>

                        {/* Información de Contacto */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-8">
                            <div className="flex items-center gap-2 text-[13px] font-medium text-slate-400">
                                <FaEnvelope className={`${isActivo ? 'text-slate-500' : 'text-slate-800'} text-xs`} />
                                <span className="lowercase tracking-tight">{usuario.email}</span>
                            </div>

                            {usuario.telefono && (
                                <div className="flex items-center gap-2 text-[13px] font-medium text-slate-400">
                                    <FaPhoneAlt className={`${isActivo ? 'text-slate-500' : 'text-slate-800'} text-xs`} />
                                    <span className="tracking-tighter">{usuario.telefono}</span>
                                </div>
                            )}

                            {usuario.dni && (
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                    <span className={isActivo ? 'text-slate-600' : 'text-slate-800'}>DNI</span>
                                    <span className={isActivo ? 'text-slate-300' : 'text-slate-600'}>{usuario.dni}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Status bar inferior */}
                <div className={`mt-5 flex items-center gap-3 border-t pt-4 transition-colors ${isActivo ? 'border-white/5' : 'border-red-900/5'}`}>
                    <FaCircle size={6} className={`${isActivo ? 'text-slate-400 shadow-[0_0_10px_rgba(255,255,255,0.2)] animate-pulse' : 'text-red-800'}`} />
                    <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${isActivo ? 'text-slate-600' : 'text-red-900/40'}`}>
                        {isActivo ? 'Acceso Habilitado' : 'Cuenta Suspendida'}
                        <span className="mx-3 text-slate-800">|</span>
                        <span className="text-slate-700 font-bold italic lowercase tracking-normal">id: {usuario.id}</span>
                    </p>
                </div>
            </div>

            {/* BOTONES DE ACCIÓN (Estilo Plateado) */}
            <div className="flex gap-3 w-full lg:w-auto relative z-10">
                <button
                    title="Editar Perfil"
                    className="flex-1 lg:w-12 lg:h-12 p-3 bg-white/5 hover:bg-white border border-white/10 hover:border-white rounded-2xl text-slate-400 hover:text-black transition-all duration-300 flex items-center justify-center shadow-xl active:scale-90"
                    onClick={() => onEdit(usuario)}
                >
                    <FaEdit size={18} />
                </button>

                <button
                    title={isActivo ? "Desactivar Usuario" : "Activar Usuario"}
                    className={`flex-1 lg:w-12 lg:h-12 p-3 bg-white/5 border border-white/10 rounded-2xl transition-all duration-300 flex items-center justify-center active:scale-90 shadow-xl
                        ${isActivo
                        ? 'text-slate-700 hover:bg-red-600 hover:border-red-600 hover:text-white'
                        : 'text-slate-400 hover:bg-white hover:border-white hover:text-black'
                    }`}
                    onClick={() => onDelete(usuario.id)}
                >
                    <FaTrash size={18} />
                </button>
            </div>
        </div>
    );
}