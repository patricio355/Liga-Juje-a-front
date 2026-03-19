import { useEffect, useState, useContext } from "react";
import { createPortal } from "react-dom"; // Importante para el Portal
import { getCanchas } from "../../api/canchas.api";
import { apiFetch } from "../../api/api";
import ImageUpload from "../../images/ImageUpload";
import { AuthContext } from "../../context/AuthContext";
import {
    FaShieldAlt, FaMapMarkerAlt, FaUserAlt,
    FaCheckCircle, FaTimes, FaPalette, FaEnvelope, FaTrash, FaExternalLinkAlt
} from "react-icons/fa";

export default function ModalCrearEquipo({ onClose, onCreated, zonaId }) {
    const { user } = useContext(AuthContext);
    const esAdmin = user?.role === "ROLE_ADMIN" || user?.role === "ADMIN";

    const [form, setForm] = useState({
        nombre: "",
        localidad: "",
        escudo: "",
        camisetaTitular: "",
        camisetaSuplente: "",
        estado: true,
        canchaId: "",
        encargadoEmail: "",
        creadorEmail: ""
    });

    const [canchas, setCanchas] = useState([]);
    const [listaEncargados, setListaEncargados] = useState([]);
    const [error, setError] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const cargarCanchas = async () => {
            try {
                const data = await getCanchas();
                setCanchas(data.filter(c => c.estado));
            } catch (e) { console.error(e); }
        };
        cargarCanchas();

        if (esAdmin) {
            const cargarEncargados = async () => {
                try {
                    const data = await apiFetch("/api/usuarios/encargados");
                    if (data) setListaEncargados(data);
                } catch (e) { console.error("Error cargando encargados:", e); }
            };
            cargarEncargados();
        }

        // Bloquear scroll
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
    }, [esAdmin]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleEscudoUpload = (url) => {
        setForm(prev => ({ ...prev, escudo: url }));
        setIsUploading(false);
        setError("");
    };

    const quitarEscudo = () => {
        setForm(prev => ({ ...prev, escudo: "" }));
    };

    const guardar = async (e) => {
        if (e) e.preventDefault();
        if (!form.nombre.trim() || !form.escudo) {
            setError("Faltan datos: El nombre y el escudo son requeridos.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const url = zonaId ? `/api/equipos/zona/${zonaId}` : `/api/equipos`;
            await apiFetch(url, {
                method: "POST",
                body: JSON.stringify({
                    ...form,
                    canchaId: form.canchaId ? Number(form.canchaId) : null,
                    encargadoEmail: form.encargadoEmail || null,
                    creadorEmail: form.creadorEmail || null
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

    return createPortal(
        <div
            className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-[999999] p-2 md:p-6 italic"
            onClick={onClose}
        >
            <form
                className="bg-[#05070a] border border-white/10 rounded-[2.5rem] w-full max-w-3xl shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden flex flex-col max-h-[95vh] relative animate-in fade-in zoom-in duration-200"
                onClick={(e) => e.stopPropagation()}
                onSubmit={guardar}
            >
                {/* Header Fijo */}
                <div className="bg-[#0a0c10] px-8 py-6 border-b border-white/5 flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tighter uppercase flex items-center gap-3">
                            <FaShieldAlt className="text-slate-400" size={24} /> Nuevo Equipo
                        </h2>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-1">
                            Registro de Club Oficial
                        </p>
                    </div>
                    <button type="button" onClick={onClose} className="text-slate-600 hover:text-white transition-colors p-2 bg-white/5 rounded-full">
                        <FaTimes size={18} />
                    </button>
                </div>

                {/* Body con Scroll Interno */}
                <div className="p-6 md:p-10 overflow-y-auto custom-scrollbar bg-[#05070a] flex-1">

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

                        {/* Columna Izquierda: Escudo */}
                        <div className="md:col-span-5 flex flex-col items-center">
                            <div className="relative w-full bg-black p-8 rounded-[3rem] border border-white/5 shadow-inner flex flex-col items-center min-h-[250px] justify-center">
                                {!form.escudo ? (
                                    <ImageUpload
                                        onUploadStart={() => setIsUploading(true)}
                                        onUploadSuccess={handleEscudoUpload}
                                        currentImage={form.escudo}
                                        autoConfirm={true}
                                        showAiOptions={false}
                                    />
                                ) : (
                                    <div className="relative w-full aspect-square flex items-center justify-center">
                                        <img
                                            src={form.escudo}
                                            alt="Escudo preview"
                                            className="w-full h-full object-contain p-2 opacity-90"
                                        />
                                        <button
                                            type="button"
                                            onClick={quitarEscudo}
                                            className="absolute -top-2 -right-2 p-3 bg-red-900 text-white rounded-2xl hover:bg-red-600 transition-all shadow-xl z-20 active:scale-90"
                                        >
                                            <FaTrash size={14} />
                                        </button>
                                    </div>
                                )}
                                <p className="text-[9px] font-black text-slate-600 uppercase mt-6 tracking-[0.2em]">Escudo Principal</p>
                            </div>

                            <a
                                href="https://www.remove.bg/es"
                                target="_blank"
                                rel="noreferrer"
                                className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-2 hover:bg-white/10 transition-all w-full"
                            >
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 italic">
                                    ¿Foto con fondo? <FaExternalLinkAlt size={8} />
                                </span>
                                <p className="text-[10px] text-slate-500 font-medium leading-tight tracking-tight">
                                    Usa <span className="text-white font-bold">remove.bg</span> para transparencia profesional.
                                </p>
                            </a>
                        </div>

                        {/* Columna Derecha: Datos principales */}
                        <div className="md:col-span-7 space-y-6">
                            {esAdmin && (
                                <div className="space-y-2 bg-slate-400/5 p-5 rounded-3xl border border-white/5 shadow-inner">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <FaUserAlt size={10} /> Propietario del Equipo
                                    </label>
                                    <select
                                        name="creadorEmail"
                                        value={form.creadorEmail}
                                        onChange={handleChange}
                                        className="w-full px-5 py-3.5 bg-black border border-white/10 rounded-xl outline-none focus:border-slate-400 text-xs font-black text-white cursor-pointer uppercase"
                                    >
                                        <option value="">ASIGNARME A MÍ (ADMIN)</option>
                                        {listaEncargados.map(enc => (
                                            <option key={enc.id} value={enc.email}>{enc.nombre.toUpperCase()}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nombre del Equipo</label>
                                <input
                                    name="nombre"
                                    maxLength={20}
                                    value={form.nombre}
                                    onChange={e => setForm({...form, nombre: e.target.value.toUpperCase()})}
                                    className="w-full px-6 py-4 bg-black border border-white/10 rounded-2xl outline-none focus:border-slate-400 text-sm font-black text-white italic placeholder:text-slate-900"
                                    placeholder="NOMBRE DEL CLUB"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Localidad</label>
                                <div className="relative">
                                    <input name="localidad" value={form.localidad} onChange={handleChange} className="w-full px-6 py-4 bg-black border border-white/10 rounded-2xl outline-none focus:border-slate-400 text-sm font-black text-white italic placeholder:text-slate-900" placeholder="CIUDAD / BARRIO" />
                                    <FaMapMarkerAlt className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-800" size={14} />
                                </div>
                            </div>
                        </div>

                        {/* Detalles inferiores */}
                        <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-white/5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Sede / Cancha (Opcional)</label>
                                <select
                                    name="canchaId"
                                    value={form.canchaId}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 bg-black border border-white/10 rounded-2xl outline-none focus:border-slate-400 text-xs font-black text-white appearance-none uppercase"
                                >
                                    <option value="">SIN SEDE ASIGNADA</option>
                                    {canchas.map(c => (
                                        <option key={c.id} value={c.id}>{c.nombre.toUpperCase()}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <FaEnvelope size={10} /> Email Encargado
                                </label>
                                <input name="encargadoEmail" value={form.encargadoEmail} onChange={handleChange} className="w-full px-6 py-4 bg-black border border-white/10 rounded-2xl outline-none focus:border-slate-400 text-xs font-medium text-slate-300" placeholder="usuario@email.com" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <FaPalette size={10} /> Camiseta Titular
                                </label>
                                <input name="camisetaTitular" value={form.camisetaTitular} onChange={handleChange} className="w-full px-6 py-4 bg-black border border-white/10 rounded-2xl text-[10px] font-black text-slate-400 uppercase" placeholder="COLORES OFICIALES" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <FaPalette size={10} /> Camiseta Suplente
                                </label>
                                <input name="camisetaSuplente" value={form.camisetaSuplente} onChange={handleChange} className="w-full px-6 py-4 bg-black border border-white/10 rounded-2xl text-[10px] font-black text-slate-400 uppercase" placeholder="EQUIPACIÓN ALTERNATIVA" />
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
                        className="flex-1 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 border border-white/5 hover:bg-white/5 transition-all"
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        disabled={isUploading || loading || !form.escudo || !form.nombre}
                        className="flex-[2] py-5 bg-gradient-to-r from-slate-200 to-slate-400 hover:from-white hover:to-slate-300 text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-[0_10px_30px_rgba(0,0,0,0.5)] active:scale-95 disabled:opacity-20 flex items-center justify-center gap-3"
                    >
                        {isUploading ? "SUBIENDO..." : loading ? "PROCESANDO..." : <><FaCheckCircle size={14} /> Registrar Equipo</>}
                    </button>
                </div>
                </div>
            </form>
        </div>,
        document.body
    );
}