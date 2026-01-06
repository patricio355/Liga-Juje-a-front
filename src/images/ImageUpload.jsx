import { useState } from "react";
import { FaCloudUploadAlt, FaRegImage, FaMagic, FaSpinner, FaCheck } from "react-icons/fa";
import { removeBackground } from "@imgly/background-removal";

export default function ImageUpload({ onUploadStart, onUploadSuccess, currentImage }) {
    const [status, setStatus] = useState("idle"); // idle, ready, processing, uploading, success
    const [preview, setPreview] = useState(currentImage || null);
    const [fileActual, setFileActual] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        setPreview(url);
        setFileActual(file);
        setStatus("ready"); // Imagen lista para procesar o subir
    };

    const limpiarFondo = async () => {
        if (!fileActual) return;
        setStatus("processing");
        try {
            // Usamos el modelo 'medium' para mayor precisión en los bordes
            const blob = await removeBackground(fileActual, {
                model: "medium",
                output: { type: "image/png", quality: 0.9 }
            });
            const fileLimpio = new File([blob], fileActual.name, { type: "image/png" });
            setPreview(URL.createObjectURL(blob));
            setFileActual(fileLimpio);
            setStatus("ready");
        } catch (error) {
            console.error(error);
            setStatus("ready");
            alert("Error al limpiar el fondo.");
        }
    };

    const subirACloudinary = async () => {
        if (!fileActual) return;
        if (onUploadStart) onUploadStart();
        setStatus("uploading");

        const formData = new FormData();
        formData.append("file", fileActual);
        formData.append("upload_preset", "escudos_preset");

        try {
            const res = await fetch(
                `https://api.cloudinary.com/v1_1/drjn5sbwz/image/upload`,
                { method: "POST", body: formData }
            );
            const data = await res.json();
            if (data.secure_url) {
                setStatus("success");
                onUploadSuccess(data.secure_url);
            }
        } catch (error) {
            console.error(error);
            setStatus("ready");
        }
    };

    return (
        <div className="flex flex-col items-center gap-3">
            {/* Preview Box */}
            <div className="relative w-28 h-28 bg-[#0f172a] border-2 border-dashed border-slate-800 rounded-3xl flex items-center justify-center overflow-hidden shadow-inner">
                {preview ? (
                    <img src={preview} alt="Escudo" className="w-full h-full object-contain p-3 transition-all" />
                ) : (
                    <FaRegImage className="text-3xl text-slate-700" />
                )}

                {/* Overlay de carga */}
                {(status === "processing" || status === "uploading") && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-2">
                        <FaSpinner className="text-xl text-emerald-500 animate-spin mb-2" />
                        <span className="text-[8px] font-black uppercase text-emerald-400 tracking-widest">
                            {status === "processing" ? "Refinando..." : "Sincronizando..."}
                        </span>
                    </div>
                )}
            </div>

            {/* Controles */}
            <div className="flex flex-col gap-2 w-full">
                <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all border border-slate-700">
                    <FaCloudUploadAlt /> {preview ? "Cambiar Imagen" : "Elegir Imagen"}
                    <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                </label>

                {fileActual && status === "ready" && (
                    <div className="flex gap-2 animate-fade-in">
                        <button
                            onClick={limpiarFondo}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-xl text-[9px] font-black uppercase flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-900/20"
                        >
                            <FaMagic /> Limpiar IA
                        </button>
                        <button
                            onClick={subirACloudinary}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-xl text-[9px] font-black uppercase flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-900/20"
                        >
                            <FaCheck /> Confirmar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}