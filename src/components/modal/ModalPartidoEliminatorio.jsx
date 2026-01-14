import { useState, useEffect } from "react";
import { apiFetch } from "../../api/api";
import { FaSave, FaTimes, FaFutbol } from "react-icons/fa";

export default function ModalPartidoEliminatorio({ torneoId, etapa, idxPart, onClose, onSuccess }) {
    const [equipos, setEquipos] = useState([]);
    const [canchas, setCanchas] = useState([]);
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
            const dataTorneo = await apiFetch(`/api/torneos/${torneoId}`);
            // Recolectamos todos los equipos de todas las zonas
            const todosLosEquipos = dataTorneo.zonas.flatMap(z => z.equipos);
            setEquipos(todosLosEquipos);

            const dataCanchas = await apiFetch("/api/canchas");
            setCanchas(dataCanchas);
        };
        cargarData();
    }, [torneoId]);

    const guardar = async (e) => {
        e.preventDefault();

        if (!etapa?.etapaId) {
            alert("Error: No se encontró el ID de la etapa.");
            return;
        }

        try {
            const payload = {
                // Si el ID está vacío, enviamos null para que la base de datos lo acepte como "A definir"
                equipoLocalId: form.equipoLocalId ? Number(form.equipoLocalId) : null,
                equipoVisitanteId: form.equipoVisitanteId ? Number(form.equipoVisitanteId) : null,
                canchaId: form.canchaId ? Number(form.canchaId) : null,
                fecha: form.fecha || null,
                hora: form.hora || null,
                veedor: form.veedor || "",

                etapaId: Number(etapa.etapaId),
                torneoId: Number(torneoId),
                zonaId: null,
                // Guardamos el orden del partido dentro de la etapa para que el Cuadro lo renderice bien
                orden: idxPart + 1,
                numeroFecha: 1
            };

            await apiFetch("/api/partidos", {
                method: "POST",
                body: JSON.stringify(payload)
            });

            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error al guardar:", error);
            alert(error.message || "Error al guardar el partido");
        }
    };

    return (
        <div className="fixed inset-0 bg-[#040714]/95 backdrop-blur-md z-[300] flex items-center justify-center p-4">
            <form onSubmit={guardar} className="bg-[#0a0f2c] border border-cyan-500/30 w-full max-w-xl rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="p-8 bg-gradient-to-b from-cyan-500/10 to-transparent">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-2xl font-black uppercase italic text-white tracking-tighter">
                                Configurar <span className="text-cyan-500">{etapa.nombre}</span>
                            </h2>
                            <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Llave #{idxPart + 1}</p>
                        </div>
                        <button type="button" onClick={onClose} className="text-slate-500 hover:text-white"><FaTimes /></button>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* EQUIPO LOCAL */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Local</label>
                            <select
                                className="w-full bg-[#040714] border border-slate-800 rounded-xl p-4 text-white outline-none focus:border-cyan-500 transition-all"
                                value={form.equipoLocalId}
                                onChange={e => setForm({...form, equipoLocalId: e.target.value})}
                            >
                                <option value="">--- A definir ---</option>
                                {equipos.map(eq => <option key={eq.id} value={eq.id}>{eq.nombre}</option>)}
                            </select>
                        </div>

                        {/* EQUIPO VISITANTE */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Visitante</label>
                            <select
                                className="w-full bg-[#040714] border border-slate-800 rounded-xl p-4 text-white outline-none focus:border-cyan-500 transition-all"
                                value={form.equipoVisitanteId}
                                onChange={e => setForm({...form, equipoVisitanteId: e.target.value})}
                            >
                                <option value="">--- A definir ---</option>
                                {equipos.map(eq => <option key={eq.id} value={eq.id}>{eq.nombre}</option>)}
                            </select>
                        </div>

                        {/* FECHA Y HORA */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Fecha (Opcional)</label>
                            <input type="date" className="w-full bg-[#040714] border border-slate-800 rounded-xl p-4 text-white"
                                   value={form.fecha} onChange={e => setForm({...form, fecha: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Hora (Opcional)</label>
                            <input type="time" className="w-full bg-[#040714] border border-slate-800 rounded-xl p-4 text-white"
                                   value={form.hora} onChange={e => setForm({...form, hora: e.target.value})} />
                        </div>

                        {/* CANCHA */}
                        <div className="col-span-2 space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sede / Cancha (Opcional)</label>
                            <select
                                className="w-full bg-[#040714] border border-slate-800 rounded-xl p-4 text-white outline-none focus:border-cyan-500"
                                value={form.canchaId}
                                onChange={e => setForm({...form, canchaId: e.target.value})}
                            >
                                <option value="">--- Sin asignar ---</option>
                                {canchas.map(c => <option key={c.id} value={c.id}>{c.nombre} - {c.ubicacion}</option>)}
                            </select>
                        </div>
                    </div>

                    <button type="submit" className="w-full mt-10 bg-cyan-600 hover:bg-cyan-500 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-cyan-900/40 transition-all active:scale-95">
                        Confirmar Encuentro
                    </button>
                    <p className="text-center text-[8px] text-slate-600 uppercase font-black tracking-widest mt-4">Nota: Los campos vacíos se mostrarán como "A definir" en el cuadro público</p>
                </div>
            </form>
        </div>
    );
}