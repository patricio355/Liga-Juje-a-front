import { useState, useEffect } from "react";
import { apiFetch } from "../../api/api";
import { FaSave, FaTimes, FaShieldAlt } from "react-icons/fa";

export default function ModalPartidoEliminatorio({ torneoId, etapa, idxPart, onClose, onSuccess }) {
    const [equipos, setEquipos] = useState([]);
    const [canchas, setCanchas] = useState([]);
    const [loading, setLoading] = useState(true);

    const partidoExistente = etapa.partidos?.find(p => p.orden === (idxPart + 1));

    const [form, setForm] = useState({
        equipoLocalId: "",
        equipoVisitanteId: "",
        fecha: "",
        hora: "",
        canchaId: "",
        veedor: ""
    });

    useEffect(() => {
        const cargarData = async () => {
            try {
                const [dataTorneo, dataCanchas] = await Promise.all([
                    apiFetch(`/api/torneos/${torneoId}`),
                    apiFetch("/api/canchas")
                ]);

                // Validación de seguridad para equipos
                const todosLosEquipos = dataTorneo?.zonas?.flatMap(z => z.equipos || []) || [];
                setEquipos(todosLosEquipos);
                setCanchas(dataCanchas || []);

                if (partidoExistente) {
                    const encontrarIdPorNombre = (nombre) => todosLosEquipos.find(eq => eq.nombre === nombre)?.id || "";
                    const encontrarCanchaPorNombre = (nombre) => (dataCanchas || []).find(c => c.nombre === nombre)?.id || "";

                    setForm({
                        equipoLocalId: partidoExistente.equipoLocalId || encontrarIdPorNombre(partidoExistente.equipoLocal),
                        equipoVisitanteId: partidoExistente.equipoVisitanteId || encontrarIdPorNombre(partidoExistente.equipoVisitante),
                        fecha: partidoExistente.fecha || "",
                        hora: partidoExistente.hora || "",
                        canchaId: partidoExistente.canchaId || encontrarCanchaPorNombre(partidoExistente.cancha),
                        veedor: partidoExistente.veedor || ""
                    });
                }
            } catch (error) {
                console.error("Error al cargar datos:", error);
            } finally {
                setLoading(false);
            }
        };
        cargarData();
    }, [torneoId, partidoExistente]);

    const guardar = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                equipoLocalId: form.equipoLocalId ? Number(form.equipoLocalId) : null,
                equipoVisitanteId: form.equipoVisitanteId ? Number(form.equipoVisitanteId) : null,
                canchaId: form.canchaId ? Number(form.canchaId) : null,
                fecha: form.fecha || null,
                hora: form.hora || null,
                veedor: form.veedor || "",
                etapaId: Number(etapa.etapaId),
                torneoId: Number(torneoId),
                orden: idxPart + 1,
                numeroFecha: 1
            };
            const url = partidoExistente ? `/api/partidos/${partidoExistente.id}` : "/api/partidos";
            const method = partidoExistente ? "PUT" : "POST";
            await apiFetch(url, { method, body: JSON.stringify(payload) });
            onSuccess();
            onClose();
        } catch (error) {
            alert(error.message || "Error al guardar");
        }
    };

    if (loading) return null;

    return (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[600] flex items-center justify-center p-4" onClick={onClose}>
            <form
                onSubmit={guardar}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#0a0a0a] border border-white/10 w-full max-w-xl rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_-12px_rgba(255,255,255,0.1)] animate-in fade-in zoom-in-95 duration-300"
            >
                <div className="p-10">
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <h2 className="text-2xl font-black uppercase text-white tracking-tighter">
                                {partidoExistente ? "Editar" : "Configurar"} <span className="text-slate-400">{etapa?.nombre?.toUpperCase() || "ETAPA"}</span>
                            </h2>
                            <p className="text-[10px] text-slate-600 font-black uppercase mt-1.5 tracking-[0.2em]">Llave de eliminación #{idxPart + 1}</p>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-3 bg-white/5 rounded-2xl text-slate-500 hover:text-white border border-white/5 transition-all"
                        >
                            <FaTimes size={18} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* LOCAL */}
                        <div className="space-y-2.5">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Equipo Local</label>
                            <select
                                className="w-full bg-black border border-white/10 rounded-2xl p-4 text-sm font-bold text-white outline-none focus:border-white/30 appearance-none cursor-pointer"
                                value={form.equipoLocalId}
                                onChange={e => setForm({...form, equipoLocalId: e.target.value})}
                            >
                                <option value="" className="bg-black">--- POR DEFINIR ---</option>
                                {equipos.map(eq => (
                                    <option key={eq.id} value={eq.id} className="bg-black">
                                        {eq.nombre?.toUpperCase() || "SIN NOMBRE"}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* VISITANTE */}
                        <div className="space-y-2.5">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Equipo Visitante</label>
                            <select
                                className="w-full bg-black border border-white/10 rounded-2xl p-4 text-sm font-bold text-white outline-none focus:border-white/30 appearance-none cursor-pointer"
                                value={form.equipoVisitanteId}
                                onChange={e => setForm({...form, equipoVisitanteId: e.target.value})}
                            >
                                <option value="" className="bg-black">--- POR DEFINIR ---</option>
                                {equipos.map(eq => (
                                    <option key={eq.id} value={eq.id} className="bg-black">
                                        {eq.nombre?.toUpperCase() || "SIN NOMBRE"}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* FECHA */}
                        <div className="space-y-2.5">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Fecha</label>
                            <input
                                type="date"
                                className="w-full bg-black border border-white/10 rounded-2xl p-4 text-sm font-bold text-white outline-none focus:border-white/30 [color-scheme:dark]"
                                value={form.fecha}
                                onChange={e => setForm({...form, fecha: e.target.value})}
                            />
                        </div>

                        {/* HORA */}
                        <div className="space-y-2.5">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Hora</label>
                            <input
                                type="time"
                                className="w-full bg-black border border-white/10 rounded-2xl p-4 text-sm font-bold text-white outline-none focus:border-white/30 [color-scheme:dark]"
                                value={form.hora}
                                onChange={e => setForm({...form, hora: e.target.value})}
                            />
                        </div>

                        {/* CANCHA */}
                        <div className="md:col-span-2 space-y-2.5">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Sede / Predio</label>
                            <select
                                className="w-full bg-black border border-white/10 rounded-2xl p-4 text-sm font-bold text-white outline-none focus:border-white/30 appearance-none cursor-pointer"
                                value={form.canchaId}
                                onChange={e => setForm({...form, canchaId: e.target.value})}
                            >
                                <option value="" className="bg-black">--- SIN ASIGNAR ---</option>
                                {canchas.map(c => (
                                    <option key={c.id} value={c.id} className="bg-black">
                                        {c.nombre?.toUpperCase() || "CANCHA"} - {c.ubicacion?.toUpperCase() || "UBICACIÓN"}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-4 mt-12">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-500 border border-white/5 hover:bg-white/5 hover:text-white transition-all"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-[2] bg-white hover:bg-slate-200 text-black py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] shadow-[0_10px_30px_-10px_rgba(255,255,255,0.3)] transition-all active:scale-95"
                        >
                            {partidoExistente ? "Guardar Cambios" : "Confirmar Encuentro"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}