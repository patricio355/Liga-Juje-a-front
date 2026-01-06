import { useEffect, useRef } from "react";
import { FaChevronDown, FaExclamationCircle } from "react-icons/fa";

export default function FilaProgramacion({
                                             tarjeta,
                                             opciones,
                                             equipoYaProgramado,
                                             open,
                                             onOpen,
                                             onClose,
                                             onSelect,
                                         }) {
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                onClose();
            }
        };
        document.addEventListener("click", handler);
        return () => document.removeEventListener("click", handler);
    }, [onClose]);

    const seleccionar = (op) => {
        onSelect(op);
        onClose();
    };

    return (
        <div
            ref={ref}
            className={`
                flex flex-col sm:flex-row items-center gap-5 sm:gap-8 
                bg-[#1e293b] border border-slate-700/50 rounded-[2rem] 
                p-6 sm:px-8 sm:py-5 transition-all duration-300 
                w-full sm:w-fit mb-4 shadow-2xl
            `}
        >
            {/* EQUIPO BASE - Letras más grandes */}
            <div className="flex flex-col w-full sm:w-[240px] text-center sm:text-left">
                <span className="font-black text-xl md:text-2xl uppercase tracking-tighter text-slate-100 leading-none">
                    {tarjeta.equipoNombre}
                </span>

                {/* Cartel informativo - Letra aumentada */}
                {equipoYaProgramado && (
                    <div className="flex items-center justify-center sm:justify-start gap-2 mt-2 text-red-500 bg-red-500/10 py-1.5 px-3 rounded-xl sm:bg-transparent sm:p-0">
                        <FaExclamationCircle size={12} />
                        <span className="text-[11px] md:text-xs uppercase font-black leading-tight tracking-widest">
                            Ya juega en esta fecha
                        </span>
                    </div>
                )}
            </div>

            {/* DIVISOR VS - Más grande e intenso */}
            <span className="text-slate-700 font-black italic text-lg hidden sm:block">VS</span>

            {/* SELECTOR DE RIVAL - Más robusto */}
            <div className="relative w-full sm:w-64">
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onOpen();
                    }}
                    className={`
                        w-full h-14 flex justify-between items-center px-6 rounded-2xl border transition-all font-black text-base
                        ${open
                        ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/40"
                        : "bg-[#0f172a] border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white"}
                    `}
                >
                    <span className="truncate">{open ? "Elegir..." : "Seleccionar"}</span>
                    <FaChevronDown className={`text-xs transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
                </button>

                {open && (
                    <div className="absolute z-[100] mt-3 w-full sm:w-80 bg-[#1e293b] border border-slate-700 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-h-72 overflow-y-auto left-0 sm:left-auto">
                        {opciones.length === 0 ? (
                            <div className="px-6 py-8 text-xs text-slate-500 italic text-center uppercase font-black tracking-[0.2em]">
                                Sin rivales libres
                            </div>
                        ) : (
                            opciones.map((op) => (
                                <button
                                    key={op.partidoId}
                                    type="button"
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        seleccionar(op);
                                    }}
                                    className="w-full text-left px-6 py-5 text-sm text-slate-100 font-black uppercase hover:bg-blue-600 hover:text-white border-b border-slate-700/50 last:border-0 transition-all flex items-center gap-4"
                                >
                                    <span className="text-slate-500 font-black italic text-xs">VS</span>
                                    <span className="truncate tracking-tight">{op.vs}</span>
                                </button>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}