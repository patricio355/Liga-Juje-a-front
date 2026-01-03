import { useState } from "react";
import { apiFetch } from "../../api/api";
import ImageUpload from "../../images/ImageUpload";
import { FaShieldAlt, FaMapMarkerAlt, FaEnvelope, FaCheckCircle, FaTimes, FaToggleOn } from "react-icons/fa";

export default function ModalEquipoEditar({ equipo, onClose, onUpdated }) {
    const [nombre, setNombre] = useState(equipo?.nombre || "");
    const [localidad, setLocalidad] = useState(equipo?.localidad || "");
    const [escudo, setEscudo] = useState(equipo?.escudo || "");
    const [estado, setEstado] = useState(equipo?.estado ?? true);
    const [encargadoEmail, setEncargadoEmail] = useState(equipo?.encargadoEmail || "");

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    if (!equipo) return null;

    const guardar = async () => {
        if (nombre.length > 15) {
            setError("Máximo 15 caracteres para el nombre");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            await apiFetch(`/api/equipos/${equipo.id}`, {
                method: "PUT",
                body: JSON.stringify({
                    nombre,
                    localidad,
                    escudo,
                    estado,
                    encargadoEmail: encargadoEmail.trim() || null
                })
            });
            onUpdated();
            onClose();
        } catch (e) {
            setError(e.message || "Error al actualizar");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-[#0f172a]/95 backdrop-blur-md flex items-center justify-center z-[300] p-4" onClick={onClose}>
            <div className="bg-[#1e293b] w-full max-w-md rounded-[3rem] border border-slate-700/50 shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-700/30 flex justify-between items-center bg-[#111827]/40">
                    <div className="flex items-center gap-3">
                        <FaShieldAlt className="text-emerald-500" />
                        <h2 className="text-[11px] font-black uppercase italic tracking-widest text-white">Editar Club</h2>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors"><FaTimes /></button>
                </div>

                <div className="p-8 space-y-6">
                    {/* Sección de Imagen */}
                    <ImageUpload
                        onUploadStart={() => setIsUploading(true)}
                        onUploadSuccess={(url) => { setEscudo(url); setIsUploading(false); }}
                        currentImage={escudo}
                    />

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Nombre Oficial</label>
                            <input value={nombre} maxLength={15} onChange={e => setNombre(e.target.value)} className="w-full h-12 bg-[#0f172a] border border-slate-700/50 px-4 rounded-2xl text-sm text-white focus:border-emerald-500 outline-none transition-all" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1"><FaMapMarkerAlt size={8}/> Localidad</label>
                                <input value={localidad} onChange={e => setLocalidad(e.target.value)} className="w-full h-12 bg-[#0f172a] border border-slate-700/50 px-4 rounded-2xl text-sm text-white focus:border-emerald-500 outline-none" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1"><FaToggleOn size={8}/> Estado</label>
                                <select value={estado ? "true" : "false"} onChange={e => setEstado(e.target.value === "true")} className="w-full h-12 bg-[#0f172a] border border-slate-700/50 px-4 rounded-2xl text-sm text-white focus:border-emerald-500 outline-none cursor-pointer">
                                    <option value="true">Activo</option>
                                    <option value="false">Inactivo</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1"><FaEnvelope size={8}/> Responsable</label>
                            <input value={encargadoEmail} onChange={e => setEncargadoEmail(e.target.value)} className="w-full h-12 bg-[#0f172a] border border-slate-700/50 px-4 rounded-2xl text-sm text-white focus:border-emerald-500 outline-none" placeholder="email@club.com" />
                        </div>
                    </div>

                    <button
                        onClick={guardar}
                        disabled={loading || isUploading}
                        className="w-full h-14 bg-emerald-600 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-900/20 flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {loading || isUploading ? "Procesando..." : <><FaCheckCircle /> Guardar Cambios</>}
                    </button>
                </div>
            </div>
        </div>
    );
}