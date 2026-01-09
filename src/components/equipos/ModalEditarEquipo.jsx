import { useState, useContext, useEffect } from "react";
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
                    // Solo el admin envía el nuevo estado, de lo contrario se mantiene el original
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

    return (
        <div className="fixed inset-0 bg-[#040714]/95 backdrop-blur-md flex items-center justify-center z-[300] p-4" onClick={onClose}>
            <form
                className="bg-[#0a0f2c] border border-cyan-500/30 rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
                onSubmit={guardar}
            >
                {/* Header */}
                <div className="bg-[#0d143d] px-10 py-8 border-b border-slate-800 flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                            <FaShieldAlt className="text-cyan-500" size={28} /> Editar Club
                        </h2>
                        <p className="text-[11px] font-bold text-cyan-500 uppercase tracking-[0.2em] mt-1">
                            Ajustes de identidad oficial
                        </p>
                    </div>
                    <button onClick={onClose} type="button" className="p-3 bg-[#040714] rounded-2xl text-slate-500 hover:text-white border border-slate-800 transition-all">
                        <FaTimes size={24} />
                    </button>
                </div>

                <div className="p-10 overflow-y-auto custom-scrollbar">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 mb-8 rounded-2xl text-[12px] font-black uppercase tracking-widest text-center animate-pulse">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

                        {/* Columna Izquierda: Escudo */}
                        <div className="md:col-span-5 flex flex-col items-center">
                            <div className="relative w-full bg-[#040714] p-8 rounded-[3rem] border border-slate-800 shadow-inner flex flex-col items-center min-h-[250px] justify-center">
                                {!escudo ? (
                                    <ImageUpload
                                        onUploadStart={() => setIsUploading(true)}
                                        onUploadSuccess={handleEscudoUpload}
                                        currentImage={escudo}
                                    />
                                ) : (
                                    <div className="relative w-full aspect-square flex items-center justify-center">
                                        <img src={escudo} alt="Escudo" className="w-full h-full object-contain p-2 drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]" />
                                        <button type="button" onClick={quitarEscudo} className="absolute -top-2 -right-2 p-3 bg-red-600 text-white rounded-2xl hover:bg-red-500 transition-all shadow-xl z-20 active:scale-90">
                                            <FaTrash size={16} />
                                        </button>
                                    </div>
                                )}
                                <p className="text-[10px] font-black text-slate-600 uppercase mt-6 tracking-[0.2em]">Escudo del Club</p>
                            </div>
                        </div>

                        {/* Columna Derecha: Datos principales */}
                        <div className="md:col-span-7 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 text-cyan-500/70">Nombre Oficial</label>
                                <input maxLength={20} value={nombre} onChange={e => setNombre(e.target.value.toUpperCase())} className="w-full px-6 py-4 bg-[#040714] border border-slate-800 rounded-2xl outline-none focus:border-cyan-500 text-base font-bold text-white transition-all placeholder:text-slate-800" />
                            </div>

                            <div className={`grid gap-4 ${esAdminGenuino ? "grid-cols-2" : "grid-cols-1"}`}>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1"><FaMapMarkerAlt size={10}/> Localidad</label>
                                    <input value={localidad} onChange={e => setLocalidad(e.target.value)} className="w-full px-6 py-4 bg-[#040714] border border-slate-800 rounded-2xl outline-none focus:border-cyan-500 text-sm font-bold text-white transition-all" />
                                </div>

                                {/* EL INPUT DE ESTADO SOLO APARECE SI ES ADMIN */}
                                {esAdminGenuino && (
                                    <div className="space-y-2 animate-in fade-in duration-500">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                                            <FaToggleOn size={10}/> Estado
                                        </label>
                                        <select
                                            value={estado ? "true" : "false"}
                                            onChange={e => setEstado(e.target.value === "true")}
                                            className="w-full px-6 py-4 bg-[#040714] border border-slate-800 rounded-2xl outline-none focus:border-cyan-500 text-sm font-bold text-white appearance-none cursor-pointer"
                                        >
                                            <option value="true" className="bg-[#0a0f2c]">ACTIVO</option>
                                            <option value="false" className="bg-[#0a0f2c]">INACTIVO</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Detalles Adicionales */}
                        <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-800/50">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <FaLayerGroup size={12} className="text-cyan-500" /> Cancha de Localía
                                </label>
                                <select value={canchaId} onChange={e => setCanchaId(e.target.value)} className="w-full px-6 py-4 bg-[#040714] border border-slate-800 rounded-2xl outline-none focus:border-cyan-500 text-sm font-bold text-white appearance-none cursor-pointer">
                                    <option value="">SIN CANCHA ASIGNADA</option>
                                    {canchas.map(c => <option key={c.id} value={c.id}>{c.nombre.toUpperCase()}</option>)}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <FaEnvelope size={12} className="text-cyan-500" /> Email Responsable
                                </label>
                                <input value={encargadoEmail} onChange={e => setEncargadoEmail(e.target.value)} className="w-full px-6 py-4 bg-[#040714] border border-slate-800 rounded-2xl outline-none focus:border-cyan-500 text-sm font-medium text-white transition-all" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <FaPalette size={12} className="text-cyan-500" /> Camiseta Titular
                                </label>
                                <input value={camisetaTitular} onChange={e => setCamisetaTitular(e.target.value)} className="w-full px-6 py-4 bg-[#040714] border border-slate-800 rounded-2xl text-[11px] font-bold text-white transition-all" placeholder="COLORES PRINCIPALES" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <FaPalette size={12} className="text-cyan-500" /> Camiseta Suplente
                                </label>
                                <input value={camisetaSuplente} onChange={e => setCamisetaSuplente(e.target.value)} className="w-full px-6 py-4 bg-[#040714] border border-slate-800 rounded-2xl text-[11px] font-bold text-white transition-all" placeholder="COLORES ALTERNATIVOS" />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-6 mt-12 pb-4">
                        <button type="button" onClick={onClose} className="flex-1 py-5 rounded-[1.5rem] text-[12px] font-black uppercase tracking-[0.2em] text-slate-500 border border-slate-800 hover:bg-slate-800 hover:text-white transition-all active:scale-95 shadow-lg">
                            Cancelar
                        </button>

                        <button type="submit" disabled={loading || isUploading || !escudo || !nombre} className="flex-[2] py-5 bg-cyan-600 hover:bg-cyan-500 rounded-[1.5rem] text-[12px] font-black uppercase tracking-[0.2em] text-white transition-all shadow-[0_0_25px_-5px_rgba(6,182,212,0.4)] active:scale-95 disabled:opacity-30 flex items-center justify-center gap-3">
                            {loading || isUploading ? "Sincronizando..." : <><FaCheckCircle size={18} /> Guardar Cambios</>}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}