import { useEffect, useState, useContext } from "react";
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
                            <FaShieldAlt className="text-cyan-500" size={28} /> Nuevo Equipo
                        </h2>
                        <p className="text-[11px] font-bold text-cyan-500 uppercase tracking-[0.2em] mt-1">
                            Registro de club oficial
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

                        {/* Columna Izquierda: Escudo y Recomendación */}
                        <div className="md:col-span-5 flex flex-col items-center">
                            <div className="relative w-full bg-[#040714] p-8 rounded-[3rem] border border-slate-800 shadow-inner flex flex-col items-center min-h-[250px] justify-center">
                                {!form.escudo ? (
                                    <ImageUpload
                                        onUploadStart={() => setIsUploading(true)}
                                        onUploadSuccess={handleEscudoUpload}
                                        currentImage={form.escudo}
                                        // Estas props deben estar programadas en tu ImageUpload
                                        autoConfirm={true}
                                        showAiOptions={false}
                                    />
                                ) : (
                                    <div className="relative w-full aspect-square flex items-center justify-center">
                                        <img
                                            src={form.escudo}
                                            alt="Escudo preview"
                                            className="w-full h-full object-contain p-2 drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                                        />
                                        <button
                                            type="button"
                                            onClick={quitarEscudo}
                                            className="absolute -top-2 -right-2 p-3 bg-red-600 text-white rounded-2xl hover:bg-red-500 transition-all shadow-xl z-20 active:scale-90"
                                        >
                                            <FaTrash size={16} />
                                        </button>
                                    </div>
                                )}
                                <p className="text-[10px] font-black text-slate-600 uppercase mt-6 tracking-[0.2em]">Escudo Oficial</p>
                            </div>

                            {/* Sugerencia Externa */}
                            <a
                                href="https://www.remove.bg/es"
                                target="_blank"
                                rel="noreferrer"
                                className="mt-6 p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/10 flex flex-col gap-2 hover:bg-cyan-500/10 transition-all w-full"
                            >
                                <span className="text-[9px] font-black text-cyan-500 uppercase tracking-widest flex items-center gap-2">
                                    ¿Tu foto tiene fondo? <FaExternalLinkAlt size={10} />
                                </span>
                                <p className="text-[10px] text-slate-400 font-medium leading-tight">
                                    Usa <span className="text-white font-bold">remove.bg</span> para que el escudo quede transparente.
                                </p>
                            </a>
                        </div>

                        {/* Columna Derecha: Datos principales */}
                        <div className="md:col-span-7 space-y-6">
                            {esAdmin && (
                                <div className="space-y-2 bg-cyan-500/5 p-5 rounded-2xl border border-cyan-500/10">
                                    <label className="text-[10px] font-black text-cyan-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <FaUserAlt size={12} /> Dueño del Equipo
                                    </label>
                                    <select
                                        name="creadorEmail"
                                        value={form.creadorEmail}
                                        onChange={handleChange}
                                        className="w-full px-5 py-3.5 bg-[#040714] border border-slate-800 rounded-xl outline-none focus:border-cyan-500 text-sm font-bold text-white cursor-pointer"
                                    >
                                        <option value="">ASIGNARME A MÍ (ADMIN)</option>
                                        {listaEncargados.map(enc => (
                                            <option key={enc.id} value={enc.email}>{enc.nombre.toUpperCase()}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 text-cyan-500/70">Nombre del Equipo</label>
                                <input
                                    name="nombre"
                                    maxLength={20}
                                    value={form.nombre}
                                    onChange={e => setForm({...form, nombre: e.target.value.toUpperCase()})}
                                    className="w-full px-6 py-4 bg-[#040714] border border-slate-800 rounded-2xl outline-none focus:border-cyan-500 text-base font-bold text-white"
                                    placeholder="EJ: LOCOS F.C."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Localidad</label>
                                <div className="relative">
                                    <input name="localidad" value={form.localidad} onChange={handleChange} className="w-full px-6 py-4 bg-[#040714] border border-slate-800 rounded-2xl outline-none focus:border-cyan-500 text-base font-bold text-white" placeholder="CIUDAD" />
                                    <FaMapMarkerAlt className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-700" size={16} />
                                </div>
                            </div>
                        </div>

                        {/* Detalles inferiores */}
                        <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-800/50">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Cancha Principal (Opcional)</label>
                                <select
                                    name="canchaId"
                                    value={form.canchaId}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 bg-[#040714] border border-slate-800 rounded-2xl outline-none focus:border-cyan-500 text-sm font-bold text-white cursor-pointer"
                                >
                                    <option value="">SIN CANCHA ASIGNADA</option>
                                    {canchas.map(c => (
                                        <option key={c.id} value={c.id}>{c.nombre.toUpperCase()}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <FaEnvelope size={12} className="text-cyan-500" /> Email Encargado
                                </label>
                                <input name="encargadoEmail" value={form.encargadoEmail} onChange={handleChange} className="w-full px-6 py-4 bg-[#040714] border border-slate-800 rounded-2xl outline-none focus:border-cyan-500 text-sm font-medium text-white" placeholder="USUARIO@EMAIL.COM" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <FaPalette size={12} className="text-cyan-500" /> Camiseta Titular
                                </label>
                                <input name="camisetaTitular" value={form.camisetaTitular} onChange={handleChange} className="w-full px-6 py-4 bg-[#040714] border border-slate-800 rounded-2xl text-xs font-bold text-white" placeholder="COLORES OFICIALES" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <FaPalette size={12} className="text-cyan-500" /> Camiseta Suplente
                                </label>
                                <input name="camisetaSuplente" value={form.camisetaSuplente} onChange={handleChange} className="w-full px-6 py-4 bg-[#040714] border border-slate-800 rounded-2xl text-xs font-bold text-white" placeholder="COLORES ALTERNATIVOS" />
                            </div>
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-6 mt-12 pb-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-5 rounded-[1.5rem] text-[12px] font-black uppercase tracking-[0.2em] text-slate-500 border border-slate-800 hover:bg-slate-800 hover:text-white transition-all"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={isUploading || loading || !form.escudo || !form.nombre}
                            className="flex-[2] py-5 bg-cyan-600 hover:bg-cyan-500 rounded-[1.5rem] text-[12px] font-black uppercase tracking-[0.2em] text-white transition-all shadow-[0_0_25px_-5px_rgba(6,182,212,0.4)] disabled:opacity-30 disabled:grayscale flex items-center justify-center gap-3"
                        >
                            {isUploading ? "Subiendo..." : loading ? "Guardando..." : <><FaCheckCircle size={18} /> Registrar Equipo</>}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}