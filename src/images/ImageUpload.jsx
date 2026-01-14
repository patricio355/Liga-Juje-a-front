import { useState, useEffect } from "react";
import { FaCloudUploadAlt, FaRegImage, FaSpinner } from "react-icons/fa";

export default function ImageUpload({ onUploadStart, onUploadSuccess, currentImage, label }) {
    const [status, setStatus] = useState("idle");
    const [preview, setPreview] = useState(currentImage || null);

    // --- SOLUCIÓN: ESTE EFECTO ESCUCHA CAMBIOS DESDE EL PADRE ---
    useEffect(() => {
        // Si el padre manda una nueva imagen (o carga la existente), actualizamos la vista previa
        if (currentImage) {
            setPreview(currentImage);
        }
    }, [currentImage]);
    // ------------------------------------------------------------

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // 1. Mostrar vista previa inmediata local
        const url = URL.createObjectURL(file);
        setPreview(url);

        // 2. Iniciar subida automática
        await subirACloudinary(file);
    };

    const subirACloudinary = async (file) => {
        if (onUploadStart) onUploadStart();
        setStatus("uploading");

        const formData = new FormData();
        formData.append("file", file);
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
            console.error("Error al subir:", error);
            setStatus("idle");
            alert("Error al subir la imagen. Intenta de nuevo.");
        }
    };

    return (
        <div className="flex flex-col items-center gap-3">
            {/* Preview Box */}
            <div className="relative w-28 h-28 bg-[#0f172a] border-2 border-dashed border-slate-800 rounded-3xl flex items-center justify-center overflow-hidden shadow-inner">
                {preview ? (
                    <img src={preview} alt="Vista previa" className="w-full h-full object-contain p-3 transition-all" />
                ) : (
                    <FaRegImage className="text-3xl text-slate-700" />
                )}

                {/* Overlay de carga */}
                {status === "uploading" && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-2">
                        <FaSpinner className="text-xl text-cyan-500 animate-spin mb-2" />
                        <span className="text-[8px] font-black uppercase text-cyan-400 tracking-widest">
                            Sincronizando...
                        </span>
                    </div>
                )}
            </div>

            {/* Controles */}
            <div className="flex flex-col gap-2 w-full">
                <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-white px-4 py-3 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all border border-slate-700 active:scale-95">
                    <FaCloudUploadAlt size={14}/>
                    {/* Usamos el prop 'label' si existe, sino el texto por defecto */}
                    {preview ? (label || "Cambiar Imagen") : "Seleccionar Foto"}
                    <input
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept="image/*"
                        disabled={status === "uploading"}
                    />
                </label>
            </div>
        </div>
    );
}