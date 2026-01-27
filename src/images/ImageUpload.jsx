import { useState } from "react";
import { FaCloudUploadAlt, FaRegImage, FaSpinner } from "react-icons/fa";
import imageCompression from "browser-image-compression"; // Librería para salvar tus 0.10 Mbps

export default function ImageUpload({ onUploadStart, onUploadSuccess, currentImage, label }) {
    const [status, setStatus] = useState("idle");
    const [localPreview, setLocalPreview] = useState(null);

    // Derivamos la preview: si hay una local (recién elegida) la usamos, sino la del padre
    const displayImage = localPreview || currentImage;

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // 1. Mostrar vista previa local inmediata
        setLocalPreview(URL.createObjectURL(file));

        // 2. COMPRESIÓN: Esto es vital por tu velocidad de subida
        const options = {
            maxSizeMB: 0.2, // La achicamos a 200KB (ideal para escudos)
            maxWidthOrHeight: 500,
            useWebWorker: true,
        };

        try {
            setStatus("uploading");
            if (onUploadStart) onUploadStart();

            // Comprimimos antes de mandar a Cloudinary
            const compressedFile = await imageCompression(file, options);
            await subirACloudinary(compressedFile);
        } catch (error) {
            console.error("Error en el proceso:", error);
            setStatus("idle");
        }
    };

    const subirACloudinary = async (file) => {
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
                setLocalPreview(null); // Limpiamos la preview local una vez guardado en la nube
            }
        } catch (error) {
            console.error("Error al subir:", error);
            setStatus("idle");
            alert("Error de red. Tu conexión de subida es muy baja.");
        }
    };

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="relative w-28 h-28 bg-[#0f172a] border-2 border-dashed border-slate-800 rounded-3xl flex items-center justify-center overflow-hidden shadow-inner">
                {displayImage ? (
                    <img src={displayImage} alt="Vista previa" className="w-full h-full object-contain p-3 transition-all" />
                ) : (
                    <FaRegImage className="text-3xl text-slate-700" />
                )}

                {status === "uploading" && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-2">
                        <FaSpinner className="text-xl text-cyan-500 animate-spin mb-2" />
                        <span className="text-[8px] font-black uppercase text-cyan-400 tracking-widest">
                            Comprimiendo y subiendo...
                        </span>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-2 w-full">
                <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-white px-4 py-3 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all border border-slate-700 active:scale-95">
                    <FaCloudUploadAlt size={14}/>
                    {displayImage ? (label || "Cambiar Imagen") : "Seleccionar Foto"}
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