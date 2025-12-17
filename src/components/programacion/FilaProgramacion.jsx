// src/components/programacion/FilaProgramacion.jsx
import { useEffect, useRef } from "react";

export default function FilaProgramacion({
                                             tarjeta,
                                             opciones,
                                             open,
                                             onOpen,
                                             onClose,
                                             onSelect,
                                             onConfirm,
                                             seleccion,
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
            className="
        flex items-center gap-4
        bg-[#ECECFF]
        border border-gray-300
        rounded-xl
        px-4 py-3
      "
        >
            <div className="w-48 text-black font-semibold truncate">
                {tarjeta.equipoNombre}
            </div>

            <span className="text-gray-600">VS</span>

            <div className="relative w-56">
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onOpen();
                    }}
                    className="
            w-full flex justify-between items-center
            bg-white
            text-black
            px-3 py-2
            rounded-lg
            border border-gray-400
          "
                >
          <span className="truncate text-sm">
            {seleccion ? seleccion.vs : "Seleccionar equipo"}
          </span>
                    <span className="text-xs">▼</span>
                </button>

                {open && (
                    <div
                        className="
              absolute z-30 mt-1 w-full
              bg-white
              border border-gray-300
              rounded-lg shadow-lg
              max-h-60 overflow-y-auto
            "
                        onClick={(e) => e.stopPropagation()}
                    >
                        {opciones.length === 0 ? (
                            <div className="px-3 py-2 text-sm text-gray-500">
                                Sin opciones
                            </div>
                        ) : (
                            opciones.map((op) => (
                                <button
                                    key={op.partidoId}
                                    type="button"
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        seleccionar(op);
                                    }}
                                    className="
                    w-full text-left px-3 py-2 text-sm
                    text-black
                    hover:bg-gray-100
                  "
                                >
                                    {op.vs}
                                </button>
                            ))
                        )}
                    </div>
                )}
            </div>

            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    onConfirm();
                }}
                disabled={!seleccion}
                className={`
          ml-auto px-3 py-2 rounded-lg
          ${
                    seleccion
                        ? "bg-green-600 text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }
        `}
            >
                ✓
            </button>
        </div>
    );
}
