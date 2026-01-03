import { useEffect, useState } from "react";
import { crearEquipo } from "../../api/equipos.api";
import { getCanchas } from "../../api/canchas.api";
import ImageUpload from "../../images/ImageUpload";

export default function ModalCrearEquipo({ onClose, onCreated }) {
    const [form, setForm] = useState({
        nombre: "",
        localidad: "",
        escudo: "",
        camisetaTitular: "",
        camisetaSuplente: "",
        estado: true,
        canchaId: "",
        encargadoEmail: ""
    });

    const [canchas, setCanchas] = useState([]);
    const [error, setError] = useState("");
    const [isUploading, setIsUploading] = useState(false); // ✅ Control de subida

    useEffect(() => {
        const cargarCanchas = async () => {
            try {
                const data = await getCanchas();
                setCanchas(data.filter(c => c.estado));
            } catch (e) { console.error(e); }
        };
        cargarCanchas();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleEscudoUpload = (url) => {
        setForm(prev => ({ ...prev, escudo: url }));
        setIsUploading(false); // ✅ Ya tenemos la URL de Cloudinary
    };

    const guardar = async () => {
        if (!form.nombre || !form.canchaId ) {
            setError("Nombre y cancha son obligatorios");
            return;
        }

        // Validación de longitud para proteger la tabla
        if (form.nombre.length > 15) {
            setError("El nombre no puede superar los 15 caracteres");
            return;
        }

        try {
            await crearEquipo({
                ...form,
                canchaId: Number(form.canchaId),
                encargadoEmail: form.encargadoEmail || null
            });
            onCreated();
            onClose();
        } catch (e) {
            setError("Error al crear el equipo. Revisa los datos.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#1c213b] p-8 rounded-[2.5rem] border border-slate-700 w-full max-w-lg text-white shadow-2xl">
                <h2 className="text-xl font-black uppercase italic tracking-tighter mb-6 text-emerald-400">Nuevo Equipo</h2>

                {error && (
                    <p className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-[10px] font-bold uppercase text-center mb-4 italic">{error}</p>
                )}

                <div className="space-y-4">
                    <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800">
                        <ImageUpload
                            onUploadStart={() => setIsUploading(true)} // Bloquea el botón
                            onUploadSuccess={handleEscudoUpload}
                            currentImage={form.escudo}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Nombre (Máx 15)</label>
                            <input name="nombre" maxLength={15} value={form.nombre} onChange={handleChange} className="w-full p-3 rounded-xl bg-[#0f172a] border border-slate-800 focus:border-emerald-500 outline-none text-sm" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Localidad</label>
                            <input name="localidad" value={form.localidad} onChange={handleChange} className="w-full p-3 rounded-xl bg-[#0f172a] border border-slate-800 focus:border-emerald-500 outline-none text-sm" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Cancha Principal</label>
                        <select name="canchaId" value={form.canchaId} onChange={handleChange} className="w-full p-3 rounded-xl bg-[#0f172a] border border-slate-800 focus:border-emerald-500 outline-none text-sm appearance-none">
                            <option value="">Seleccionar cancha...</option>
                            {canchas.map(c => <option key={c.id} value={c.id}>{c.nombre} — {c.ubicacion}</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <input name="camisetaTitular" placeholder="Titular" value={form.camisetaTitular} onChange={handleChange} className="w-full p-3 rounded-xl bg-[#0f172a] border border-slate-800 text-sm" />
                        <input name="camisetaSuplente" placeholder="Suplente" value={form.camisetaSuplente} onChange={handleChange} className="w-full p-3 rounded-xl bg-[#0f172a] border border-slate-800 text-sm" />
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                    <button onClick={onClose} className="px-6 py-2.5 bg-slate-800 text-slate-400 rounded-xl text-xs font-black uppercase hover:text-white transition-all">Cancelar</button>
                    <button
                        onClick={guardar}
                        disabled={isUploading || !form.escudo}
                        className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${ (isUploading || !form.escudo) ? "bg-slate-700 text-slate-500 cursor-not-allowed" : "bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg" }`}
                    >
                        {isUploading ? "Subiendo..." : "Crear Equipo"}
                    </button>
                </div>
            </div>
        </div>
    );
}