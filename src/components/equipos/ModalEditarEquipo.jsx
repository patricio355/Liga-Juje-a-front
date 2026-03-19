import { useState, useContext, useEffect } from "react";
import { createPortal } from "react-dom"; // Importante para el Portal
import { apiFetch } from "../../api/api";
import { getCanchas } from "../../api/canchas.api";
import { AuthContext } from "../../context/AuthContext";
import ImageUpload from "../../images/ImageUpload";
import {
    FaShieldAlt, FaMapMarkerAlt, FaEnvelope, FaCheckCircle,
    FaTimes, FaToggleOn, FaTrash, FaPalette, FaLayerGroup
} from "react-icons/fa";

export default function ModalEquipoEditar({ equipo, onClose, onUpdated }) {
    const { user } = useContext(AuthContext);

    // Normalizamos el rol para verificar si es ADMIN
    const miRol = user?.role?.toUpperCase().replace("ROLE_", "") || "";
    const esAdminGenuino = miRol === "ADMIN";

    const [nombre, setNombre] = useState(equipo?.nombre || "");
    const [localidad, setLocalidad] = useState(equipo?.localidad || "");
    const [escudo, setEscudo] = useState(equipo?.escudo || "");
    const [estado, setEstado] = useState(equipo?.estado ?? true);
    const [encargadoEmail, setEncargadoEmail] = useState(equipo?.encargadoEmail || "");
    const [canchaId, setCanchaId] = useState(equipo?.canchaId || "");

    const [camisetaTitular, setCamisetaTitular] = useState(equipo?.camisetaTitular || "");
    const [camisetaSuplente, setCamisetaSuplente] = useState(equipo?.camisetaSuplente || "");

    const [canchas, setCanchas] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        const cargarCanchas = async () => {
            try {
                const data = await getCanchas();
                setCanchas(data.filter(c => c.estado));
            } catch (e) {
                console.error("Error al cargar canchas:", e);
            }
        };
        cargarCanchas();

        // Bloquear scroll del body al abrir el modal
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
    }, []);

    if (!equipo) return null;

    const handleEscudoUpload = (url) => {
        setEscudo(url);
        setIsUploading(false);
        setError(null);
    };

    const quitarEscudo = () => {
        setEscudo("");
    };

    const guardar = async (e) => {
        if (e) e.preventDefault();

        if (!nombre.trim() || !escudo) {
            setError("El nombre y el escudo son obligatorios.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await apiFetch(`/api/equipos/${equipo.id}`, {
                method: "PUT",
                body: JSON.stringify({
                    nombre: nombre.toUpperCase(),
                    localidad,
                    escudo,
                    estado: esAdminGenuino ? estado : equipo.estado,
                    encargadoEmail: encargadoEmail.trim() || null,
                    camisetaTitular,
                    camisetaSuplente,
                    canchaId: canchaId ? Number(canchaId) : null
                })
            });
            if (onUpdated) await onUpdated();
            onClose();
        } catch (e) {
            setError(e.message || "Error al actualizar");
        } finally {
            setLoading(false);
        }
    };

    return createPortal(
        <div
            className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-[999999] p-2 md:p-6 italic"
            onClick={onClose}
        >
            <form
                className="bg-[#05070a] border border-white/10 rounded-[2.5rem] w-full max-w-2xl shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden flex flex-col max-h-[95vh] relative animate-in fade-in zoom-in duration-200"
                onClick={(e) => e.stopPropagation()}
                onSubmit={guardar}
            >
                {/* Header Fijo */}
                <div className="bg-[#0a0c10] px-8 py-6 border-b border-white/5 flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tighter uppercase flex items-center gap-3">
                            <FaShieldAlt className="text-slate-400" size={24} /> Editar Club
                        </h2>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-1">
                            Ajustes de Identidad Oficial
                        </p>
                    </div>
                    <button type="button" onClick={onClose} className="text-slate-600 hover:text-white transition-colors p-2 bg-white/5 rounded-full">
                        <FaTimes size={18} />
                    </button>
                </div>

                <div className="p-6 md:p-10 overflow-y-auto custom-scrollbar bg-[#05070a] flex-1">

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

                        {/* Columna Izquierda: Escudo */}
                        <div className="md:col-span-5 flex flex-col items-center">
                            <div className="relative w-full bg-black p-8 rounded-[3rem] border border-white/5 shadow-inner flex flex-col items-center min-h-[250px] justify-center">
                                {!escudo ? (
                                    <ImageUpload
                                        onUploadStart={() => setIsUploading(true)}
                                        onUploadSuccess={handleEscudoUpload}
                                        currentImage={escudo}
                                    />
                                ) : (
                                    <div className="relative w-full aspect-square flex items-center justify-center">
                                        <img src={escudo} alt="Escudo" className="w-full h-full object-contain p-2 opacity-90" />
                                        <button type="button" onClick={quitarEscudo} className="absolute -top-2 -right-2 p-3 bg-red-900 text-white rounded-2xl hover:bg-red-600 transition-all shadow-xl z-20 active:scale-90">
                                            <FaTrash size={14} />
                                        </button>
                                    </div>
                                )}
                                <p className="text-[9px] font-black text-slate-600 uppercase mt-6 tracking-[0.2em]">Escudo del Club</p>
                            </div>
                        </div>

                        {/* Columna Derecha: Datos principales */}
                        <div className="md:col-span-7 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nombre Oficial</label>
                                <input
                                    maxLength={20}
                                    value={nombre}
                                    onChange={e => setNombre(e.target.value.toUpperCase())}
                                    className="w-full px-6 py-4 bg-black border border-white/10 rounded-2xl outline-none focus:border-slate-400 text-sm font-black text-white italic transition-all placeholder:text-slate-900"
                                />
                            </div>

                            <div className={`grid gap-4 ${esAdminGenuino ? "grid-cols-2" : "grid-cols-1"}`}>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1"><FaMapMarkerAlt size={10}/> Localidad</label>
                                    <input value={localidad} onChange={e => setLocalidad(e.target.value)} className="w-full px-6 py-4 bg-black border border-white/10 rounded-2xl outline-none focus:border-slate-400 text-xs font-black text-white italic" />
                                </div>

                                {esAdminGenuino && (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                                            <FaToggleOn size={10}/> Estado
                                        </label>
                                        <select
                                            value={estado ? "true" : "false"}
                                            onChange={e => setEstado(e.target.value === "true")}
                                            className="w-full px-6 py-4 bg-black border border-white/10 rounded-2xl outline-none focus:border-slate-400 text-xs font-black text-white appearance-none cursor-pointer uppercase italic"
                                        >
                                            <option value="true" className="bg-black">ACTIVO</option>
                                            <option value="false" className="bg-black">INACTIVO</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Detalles Adicionales */}
                        <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-white/5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <FaLayerGroup size={10} /> Sede / Cancha
                                </label>
                                <select value={canchaId} onChange={e => setCanchaId(e.target.value)} className="w-full px-6 py-4 bg-black border border-white/10 rounded-2xl outline-none focus:border-slate-400 text-xs font-black text-white appearance-none cursor-pointer uppercase">
                                    <option value="">SIN SEDE ASIGNADA</option>
                                    {canchas.map(c => <option key={c.id} value={c.id}>{c.nombre.toUpperCase()}</option>)}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <FaEnvelope size={10} /> Email Responsable
                                </label>
                                <input value={encargadoEmail} onChange={e => setEncargadoEmail(e.target.value)} className="w-full px-6 py-4 bg-black border border-white/10 rounded-2xl outline-none focus:border-slate-400 text-xs font-medium text-slate-300" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <FaPalette size={10} /> Camiseta Titular
                                </label>
                                <input value={camisetaTitular} onChange={e => setCamisetaTitular(e.target.value)} className="w-full px-6 py-4 bg-black border border-white/10 rounded-2xl text-[10px] font-black text-slate-400 uppercase" placeholder="EQUIPACIÓN PRINCIPAL" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <FaPalette size={10} /> Camiseta Suplente
                                </label>
                                <input value={camisetaSuplente} onChange={e => setCamisetaSuplente(e.target.value)} className="w-full px-6 py-4 bg-black border border-white/10 rounded-2xl text-[10px] font-black text-slate-400 uppercase" placeholder="EQUIPACIÓN ALTERNATIVA" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Fijo */}
                <div className="p-8 bg-[#0a0c10] border-t border-white/5 flex flex-col shrink-0 shrink-0">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 mb-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-4">

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 border border-white/5 hover:bg-white/5 transition-all shadow-lg"
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        disabled={loading || isUploading || !escudo || !nombre}
                        className="flex-[2] py-5 bg-gradient-to-r from-slate-200 to-slate-400 hover:from-white hover:to-slate-300 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-black transition-all shadow-[0_10px_30px_rgba(0,0,0,0.5)] active:scale-95 disabled:opacity-20 flex items-center justify-center gap-3"
                    >
                        {loading || isUploading ? "Sincronizando..." : <><FaCheckCircle size={14} /> Guardar Cambios</>}
                    </button>
                </div>
                </div>
            </form>
        </div>,
        document.body
    );
}