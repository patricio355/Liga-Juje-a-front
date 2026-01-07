import { useEffect, useState } from "react";
import { getCanchas } from "../../api/canchas.api";
import { apiFetch } from "../../api/api"; // Usamos apiFetch para mayor control
import ImageUpload from "../../images/ImageUpload";

// Recibimos zonaId como prop opcional
export default function ModalCrearEquipo({ onClose, onCreated, zonaId }) {
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
    const [isUploading, setIsUploading] = useState(false);
    const [loading, setLoading] = useState(false); // Estado para el envío

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
        setIsUploading(false);
    };

    const guardar = async () => {
        if (!form.nombre || !form.canchaId ) {
            setError("Nombre y cancha son obligatorios");
            return;
        }

        if (form.nombre.length > 15) {
            setError("El nombre no puede superar los 15 caracteres");
            return;
        }

        setLoading(true);
        setError("");

        try {
            // DETECTAR ENDPOINT: Si hay zonaId, usamos el nuevo camino
            const url = zonaId
                ? `/api/equipos/zona/${zonaId}`
                : `/api/equipos`;

            await apiFetch(url, {
                method: "POST",
                body: JSON.stringify({
                    ...form,
                    canchaId: Number(form.canchaId),
                    encargadoEmail: form.encargadoEmail || null
                })
            });

            if (onCreated) await onCreated();
            onClose();
        } catch (e) {
            setError(e.message || "Error al crear el equipo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[300] p-4" onClick={onClose}>
            <div className="bg-[#1c213b] p-8 rounded-[2.5rem] border border-slate-700 w-full max-w-lg text-white shadow-2xl overflow-y-auto max-h-[95vh]" onClick={(e) => e.stopPropagation()}>

                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-black uppercase italic tracking-tighter text-emerald-400">Nuevo Equipo</h2>
                        {zonaId && <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Se vinculará automáticamente a la zona</p>}
                    </div>
                </div>

                {error && (
                    <p className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-[10px] font-bold uppercase text-center mb-4 italic">{error}</p>
                )}

                <div className="space-y-4">
                    <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800">
                        <ImageUpload
                            onUploadStart={() => setIsUploading(true)}
                            onUploadSuccess={handleEscudoUpload}
                            currentImage={form.escudo}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Nombre (Máx 15)</label>
                            <input name="nombre" maxLength={15} value={form.nombre} onChange={handleChange} className="w-full p-3 rounded-xl bg-[#0f172a] border border-slate-800 focus:border-emerald-500 outline-none text-sm placeholder:text-slate-700" placeholder="Nombre del club" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Localidad</label>
                            <input name="localidad" value={form.localidad} onChange={handleChange} className="w-full p-3 rounded-xl bg-[#0f172a] border border-slate-800 focus:border-emerald-500 outline-none text-sm placeholder:text-slate-700" placeholder="Ej: San Salvador" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Cancha Principal (Localía)</label>
                        <select name="canchaId" value={form.canchaId} onChange={handleChange} className="w-full p-3 rounded-xl bg-[#0f172a] border border-slate-800 focus:border-emerald-500 outline-none text-sm appearance-none cursor-pointer">
                            <option value="">Seleccionar cancha...</option>
                            {canchas.map(c => <option key={c.id} value={c.id}>{c.nombre} — {c.ubicacion}</option>)}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Email del Encargado (Opcional)</label>
                        <input name="encargadoEmail" value={form.encargadoEmail} onChange={handleChange} className="w-full p-3 rounded-xl bg-[#0f172a] border border-slate-800 focus:border-emerald-500 outline-none text-sm placeholder:text-slate-700" placeholder="usuario@ejemplo.com" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Color Titular</label>
                            <input name="camisetaTitular" placeholder="Ej: Rojo y Blanco" value={form.camisetaTitular} onChange={handleChange} className="w-full p-3 rounded-xl bg-[#0f172a] border border-slate-800 text-sm" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Color Suplente</label>
                            <input name="camisetaSuplente" placeholder="Ej: Azul" value={form.camisetaSuplente} onChange={handleChange} className="w-full p-3 rounded-xl bg-[#0f172a] border border-slate-800 text-sm" />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-slate-800 text-slate-400 rounded-xl text-[10px] font-black uppercase hover:text-white transition-all border border-slate-700"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={guardar}
                        disabled={isUploading || loading || !form.escudo}
                        className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${ (isUploading || loading || !form.escudo) ? "bg-slate-700 text-slate-500 cursor-not-allowed" : "bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-900/20" }`}
                    >
                        {isUploading ? "Subiendo Escudo..." : loading ? "Creando..." : "Finalizar Registro"}
                    </button>
                </div>
            </div>
        </div>
    );
}