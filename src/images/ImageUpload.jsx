import { useState } from "react";
import { FaCloudUploadAlt, FaRegImage } from "react-icons/fa";

export default function ImageUpload({ onUploadStart, onUploadSuccess, currentImage }) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(currentImage || null);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // 1. Mostrar vista previa local y avisar al padre que empezamos
        setPreview(URL.createObjectURL(file));
        setUploading(true);
        if (onUploadStart) onUploadStart();

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "escudos_preset"); // Usa tu preset 'Unsigned'

        try {
            const res = await fetch(
                `https://api.cloudinary.com/v1_1/drjn5sbwz/image/upload`,
                { method: "POST", body: formData }
            );
            const data = await res.json();

            // 2. Pasamos la URL REAL de Cloudinary al padre
            if (data.secure_url) {
                onUploadSuccess(data.secure_url);
            }
        } catch (error) {
            console.error("Error en Cloudinary:", error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="relative w-24 h-24 bg-[#1c213b] border-2 border-dashed border-slate-700 rounded-2xl flex items-center justify-center overflow-hidden">
                {preview ? (
                    <img src={preview} alt="Escudo" className="w-full h-full object-contain p-2" />
                ) : (
                    <FaRegImage className="text-2xl text-slate-600" />
                )}

                {uploading && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
            </div>
            <label className="cursor-pointer bg-emerald-600 hover:bg-emerald-500 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all active:scale-95">
                <FaCloudUploadAlt className="inline mr-2" /> Subir Escudo
                <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
            </label>
        </div>
    );
}