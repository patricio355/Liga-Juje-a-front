import { useState, useEffect } from "react";
import { apiFetch } from "../../api/api";
import { FaMapMarkerAlt, FaTimes, FaCheckCircle, FaMoneyBillWave } from "react-icons/fa";
import ImageUpload from "../../images/ImageUpload";

// Importaciones de Leaflet
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix para iconos de marcadores
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const JUJUY_CENTER = [-24.1858, -65.2995];

export default function ModalCancha({ open, cancha, onClose, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [form, setForm] = useState({
        nombre: "",
        ubicacion: "", // Referencia textual (Ej: Barrio Centro)
        ubicacionUrl: "", // Link de Google Maps
        valorEntrada: 0,
        fotoUrl: "",
        lat: JUJUY_CENTER[0],
        lng: JUJUY_CENTER[1]
    });

    function MapEvents() {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                setForm(prev => ({
                    ...prev,
                    lat,
                    lng,
                    // Generamos el link de Google Maps automáticamente al hacer click
                    ubicacionUrl: `https://www.google.com/maps?q=${lat},${lng}`
                }));
            },
        });
        return null;
    }

    useEffect(() => {
        if (open && cancha) {
            setForm({
                id: cancha.id,
                nombre: cancha.nombre || "",
                ubicacion: cancha.ubicacion || "",
                ubicacionUrl: cancha.ubicacionUrl || "",
                valorEntrada: cancha.valorEntrada || 0,
                fotoUrl: cancha.fotoUrl || "",
                lat: cancha.lat || JUJUY_CENTER[0],
                lng: cancha.lng || JUJUY_CENTER[1]
            });
        } else {
            setForm({
                nombre: "",
                ubicacion: "",
                ubicacionUrl: "",
                valorEntrada: 0,
                fotoUrl: "",
                lat: JUJUY_CENTER[0],
                lng: JUJUY_CENTER[1]
            });
        }
        setError(null);
    }, [open, cancha]);

    if (!open) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        const nombreLimpio = form.nombre.trim();
        const ubicacionLimpia = form.ubicacion.trim();

        if (!nombreLimpio) return setError("El nombre es obligatorio");

        setLoading(true);
        try {
            const url = cancha ? `/api/canchas/${cancha.id}` : "/api/canchas";
            const method = cancha ? "PUT" : "POST";

            // Aseguramos que si no hizo click, al menos se mande el centro inicial
            const finalUrl = form.ubicacionUrl || `https://www.google.com/maps?q=${form.lat},${form.lng}`;

            await apiFetch(url, {
                method,
                body: JSON.stringify({
                    ...form,
                    nombre: nombreLimpio.toUpperCase(),
                    ubicacion: ubicacionLimpia,
                    ubicacionUrl: finalUrl,
                    valorEntrada: Number(form.valorEntrada),
                    estado: true
                })
            });

            onSuccess();
            onClose();
        } catch (err) {
            setError(err.message || "Error al procesar la solicitud");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[600] flex items-center justify-center p-4" onClick={onClose}>
            <form
                onSubmit={handleSubmit}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#0a0a0a] border border-white/10 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_-12px_rgba(255,255,255,0.1)]"
            >
                {/* Header */}
                <div className="bg-[#111] px-10 py-8 border-b border-white/5 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black uppercase text-white tracking-tighter">
                            {cancha ? "Editar" : "Nueva"} <span className="text-slate-400">Cancha</span>
                        </h2>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1.5">Configuración de Predio</p>
                    </div>
                    <button type="button" onClick={onClose} className="p-3 bg-black rounded-2xl text-slate-500 hover:text-white border border-white/10 transition-all">
                        <FaTimes size={18} />
                    </button>
                </div>

                <div className="p-8 space-y-6 overflow-y-auto max-h-[80vh]">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-[10px] font-black uppercase text-center">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Columna Izquierda: Imagen e Info */}
                        <div className="space-y-6">
                            <div className="flex justify-center">
                                <ImageUpload
                                    currentImage={form.fotoUrl}
                                    onUploadSuccess={(url) => setForm({ ...form, fotoUrl: url })}
                                    label="Foto del Predio"
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nombre</label>
                                    <input
                                        type="text"
                                        className="w-full h-12 bg-black border border-white/10 rounded-2xl px-6 text-sm font-bold text-white focus:border-white/30 outline-none uppercase"
                                        value={form.nombre}
                                        onChange={e => setForm({...form, nombre: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <FaMoneyBillWave size={10}/> Valor Entrada
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full h-12 bg-black border border-white/10 rounded-2xl px-6 text-sm font-bold text-white outline-none"
                                        value={form.valorEntrada}
                                        onChange={e => setForm({...form, valorEntrada: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Columna Derecha: Mapa */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <FaMapMarkerAlt size={10}/> Ubicación en Mapa (S.S. de Jujuy)
                            </label>

                            <div className="h-64 w-full rounded-[2rem] overflow-hidden border border-white/10 bg-slate-900 relative z-10">
                                <MapContainer
                                    center={[form.lat, form.lng]}
                                    zoom={14}
                                    style={{ height: "100%", width: "100%" }}
                                >
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                    <MapEvents />
                                    <Marker position={[form.lat, form.lng]} />
                                </MapContainer>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Referencia y Link</label>
                                <input
                                    type="text"
                                    className="w-full h-12 bg-black border border-white/10 rounded-2xl px-6 text-[10px] font-bold text-white outline-none uppercase placeholder:text-slate-700"
                                    placeholder="BARRIO O CALLE"
                                    value={form.ubicacion}
                                    onChange={e => setForm({...form, ubicacion: e.target.value})}
                                />
                                <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/5 overflow-hidden">
                                    <p className="text-[8px] text-slate-500 uppercase font-black mb-1">Link generado:</p>
                                    <p className="text-[9px] text-blue-400 truncate font-mono">{form.ubicacionUrl || "Haga clic en el mapa"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex gap-4 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 py-5 rounded-2xl text-[11px] font-black uppercase text-slate-500 border border-white/5 hover:bg-white/5 transition-all">
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] bg-white hover:bg-slate-200 text-black py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] transition-all flex items-center justify-center gap-2 disabled:opacity-20"
                        >
                            {loading ? <span className="animate-pulse">Procesando...</span> : <><FaCheckCircle size={16}/> {cancha ? "Guardar" : "Registrar"}</>}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}