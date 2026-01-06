import { useState } from "react";
import imglyRemoveBackground from "@imgly/background-removal";
import { FaCloudUploadAlt, FaMagic, FaCheckCircle, FaSpinner } from "react-icons/fa";

export default function EscudoUploader({ onImagenProcesada }) {
    const [imagenOriginal, setImagenOriginal] = useState(null);
    const [imagenSinFondo, setImagenSinFondo] = useState(null);
    const [procesando, setProcesando] = useState(false);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // 1. Mostrar preview original
        const urlOriginal = URL.createObjectURL(file);
        setImagenOriginal(urlOriginal);
        setImagenSinFondo(null);
        setProcesando(true);

        try {
            // 2. MAGIA: Quitar fondo usando AI
            // Esto devuelve un Blob (como un archivo)
            const blob = await imglyRemoveBackground(urlOriginal);

            // 3. Convertir a URL para mostrar
            const urlSinFondo = URL.createObjectURL(blob);
            setImagenSinFondo(urlSinFondo);

            // 4. Convertir Blob a File para que puedas subirlo a tu backend
            const fileSinFondo = new File([blob], "escudo_clean.png", { type: "image/png" });

            // Pasamos el archivo limpio al componente padre
            if (onImagenProcesada) {
                onImagenProcesada(fileSinFondo);
            }

        } catch (error) {
            console.error("Error quitando fondo:", error);
            alert("No se pudo quitar el fondo automáticamente.");
        } finally {
            setProcesando(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto bg-[#0e1630] p-6 rounded-2xl border border-blue-900/40 shadow-xl">
            <h3 className="text-white font-black uppercase italic text-sm mb-4 flex items-center gap-2">
                <FaMagic className="text-blue-500" /> Auto-Magic Remover
            </h3>

            {/* AREA DE CARGA */}
            <div className="relative border-2 border-dashed border-blue-500/30 hover:border-blue-500/60 rounded-xl p-8 transition-all group text-center cursor-pointer bg-[#050814]/50">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />

                {!imagenOriginal && !procesando ? (
                    <div className="flex flex-col items-center gap-3">
                        <FaCloudUploadAlt className="text-4xl text-blue-400 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            Subir Escudo (JPG/PNG)
                        </span>
                    </div>
                ) : null}

                {/* VISTA PREVIA DEL PROCESO */}
                {procesando && (
                    <div className="flex flex-col items-center gap-3">
                        <FaSpinner className="text-3xl text-blue-500 animate-spin" />
                        <span className="text-xs font-black text-blue-400 uppercase animate-pulse">
                            Eliminando fondo...
                        </span>
                    </div>
                )}
            </div>

            {/* RESULTADO: COMPARATIVA */}
            {(imagenOriginal && imagenSinFondo) && (
                <div className="mt-6 grid grid-cols-2 gap-4 animate-fade-in">
                    <div className="text-center">
                        <span className="text-[9px] uppercase font-bold text-red-400 block mb-1">Original</span>
                        <div className="bg-white/10 p-2 rounded-lg h-24 flex items-center justify-center">
                            <img src={imagenOriginal} className="h-full object-contain opacity-50 grayscale" alt="Original" />
                        </div>
                    </div>

                    <div className="text-center relative">
                        <div className="absolute -top-2 -right-2 bg-green-500 text-black rounded-full p-1 z-10 shadow-lg">
                            <FaCheckCircle size={12} />
                        </div>
                        <span className="text-[9px] uppercase font-bold text-green-400 block mb-1">Sin Fondo</span>
                        {/* Fondo de ajedrez para verificar transparencia */}
                        <div className="bg-[url('https://upload.wikimedia.org/wikipedia/commons/5/50/Checkerboard_pattern.svg')] bg-repeat bg-[length:10px_10px] p-2 rounded-lg h-24 flex items-center justify-center border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                            <img src={imagenSinFondo} className="h-full object-contain drop-shadow-md transform hover:scale-110 transition-transform" alt="Sin Fondo" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}