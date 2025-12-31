import { useEffect, useRef } from "react";

export default function FilaProgramacion({
                                             tarjeta,
                                             opciones,
                                             equipoYaProgramado, // Nueva prop restaurada
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
            className="flex items-center gap-4 bg-[#ECECFF] border border-gray-300 rounded-xl px-5 py-3 hover:shadow-md transition-all duration-200"
        >
            <div className="flex flex-col min-w-[140px]">
                {/* Color rojo y cartel informativo */}
                <span className={`font-bold text-base transition-colors ${equipoYaProgramado ? "text-red-500" : "text-black"}`}>
                    {tarjeta.equipoNombre}
                </span>
                {equipoYaProgramado && (
                    <span className="text-[9px] uppercase font-black text-red-400 leading-tight">
                        Ya juega en esta fecha
                    </span>
                )}
            </div>

            <span className="text-gray-400 font-bold italic text-sm">VS</span>

            <div className="relative flex-1 max-w-xs">
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onOpen();
                    }}
                    className="w-full flex justify-between items-center bg-white text-black px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm hover:border-gray-400 transition-all font-medium"
                >
                    <span className="truncate text-sm">Seleccionar equipo</span>
                    <span className={`text-[10px] transition-transform ${open ? "rotate-180" : ""}`}>▼</span>
                </button>

                {open && (
                    <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                        {opciones.length === 0 ? (
                            <div className="px-4 py-3 text-sm text-gray-500 italic text-center">Sin rivales disponibles</div>
                        ) : (
                            opciones.map((op) => (
                                <button
                                    key={op.partidoId}
                                    type="button"
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        seleccionar(op);
                                    }}
                                    className="w-full text-left px-4 py-3 text-sm text-gray-700 font-bold hover:bg-blue-50 hover:text-blue-700 border-b border-gray-50 last:border-0 transition-colors"
                                >
                                    <span className="text-gray-400 mr-2">VS</span> {op.vs}
                                </button>
                            ))
                        )}
                    </div>
                )}
            </div>
            <div className="w-4"></div>
        </div>
    );
}