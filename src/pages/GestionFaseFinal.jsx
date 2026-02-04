import { useEffect, useRef, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    FaArrowLeft, FaPlus, FaTrophy, FaSync,
    FaEdit, FaCheckCircle, FaTrashAlt
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import { apiFetch } from "../api/api";

// Modales
import ModalPartidoEliminatorio from "../components/modal/ModalPartidoEliminatorio";
import CerrarPartidoModal from "../components/modal/CerrarPartidoModal";
import EditarInfoModal from "../components/modal/EditarInfoModal";

export default function GestionFaseFinal() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [etapasDb, setEtapasDb] = useState([]);
    const [loading, setLoading] = useState(true);

    const [partidoSeleccionado, setPartidoSeleccionado] = useState(null);
    const [etapaSeleccionada, setEtapaSeleccionada] = useState(null);
    const [idxPartSeleccionado, setIdxPartSeleccionado] = useState(null);

    const [modalCrearOpen, setModalCrearOpen] = useState(false);
    const [modalCerrarOpen, setModalCerrarOpen] = useState(false);
    const [modalEditarOpen, setModalEditarOpen] = useState(false);

    // 1. Ampliamos los nombres hasta 32avos
    const nombresFases = ["Final", "Semifinales", "Cuartos de Final", "Octavos de Final", "16avos de Final", "32avos de Final"];

    const cargarEtapas = async () => {
        try {
            setLoading(true);
            const data = await apiFetch(`/api/torneos/${id}/cuadro-completo`);
            setEtapasDb(data.sort((a, b) => a.orden - b.orden));
        } catch (error) {
            console.error("Error al cargar etapas:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { cargarEtapas(); }, [id]);

    const prepararPartidoParaModal = (p) => {
        if (!p) return null;
        return {
            ...p,
            partidoId: p.id,
            equipoLocalNombre: p.equipoLocal,
            equipoVisitanteNombre: p.equipoVisitante,
            esFaseFinal: true,
            cancha:p.cancha,
            arbitro:p.arbitro
        };
    };

    const gestionarNuevaEtapa = async () => {
        const profundidadActual = etapasDb.length;
        // 2. Aumentamos el límite a 6 (Final + 5 fases previas hasta 32avos)
        if (profundidadActual >= 6) return;

        try {
            await apiFetch(`/api/torneos/${id}/etapas`, {
                method: "POST",
                body: JSON.stringify({
                    nombre: nombresFases[profundidadActual],
                    tipo: "ELIMINACION",
                    orden: profundidadActual + 1
                })
            });
            await cargarEtapas();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    const eliminarPartido = async (partidoId) => {
        if (!window.confirm("¿Estás seguro de eliminar este partido?")) return;
        try {
            await apiFetch(`/api/partidos/${partidoId}`, { method: "DELETE" });
            await cargarEtapas();
        } catch (error) {
            alert("Error al eliminar");
        }
    };

    const generarColumnasEspejo = () => {
        if (etapasDb.length === 0) return [];

        const final = etapasDb.find(e => e.orden === 1);
        const otrasEtapas = etapasDb.filter(e => e.orden !== 1).sort((a, b) => b.orden - a.orden);

        const ladoIzquierdo = otrasEtapas.map(etapa => {
            const mitad = Math.pow(2, etapa.orden - 1) / 2;
            return {
                ...etapa,
                celdas: [...Array(mitad)].map((_, i) => ({
                    ordenReal: i + 1,
                    partido: etapa.partidos.find(p => p.orden === i + 1)
                }))
            };
        });

        const ladoDerecho = [...otrasEtapas].reverse().map(etapa => {
            const total = Math.pow(2, etapa.orden - 1);
            const mitad = total / 2;
            return {
                ...etapa,
                celdas: [...Array(mitad)].map((_, i) => ({
                    ordenReal: i + 1 + mitad,
                    partido: etapa.partidos.find(p => p.orden === i + 1 + mitad)
                }))
            };
        });

        const columnaFinal = final ? [{
            ...final,
            esFinal: true,
            celdas: [{ ordenReal: 1, partido: final.partidos[0] }]
        }] : [];

        return [...ladoIzquierdo, ...columnaFinal, ...ladoDerecho];
    };

    const columnas = generarColumnasEspejo();

    if (loading) return (
        <div className="min-h-screen bg-[#05081c] flex items-center justify-center">
            <FaSync className="text-cyan-500 animate-spin text-3xl" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#05081c] text-slate-200 font-sans">
            <Navbar />
            <main className="p-4 md:p-6 max-w-[1800px] mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-cyan-400 text-[10px] font-bold uppercase mb-1">
                            <FaArrowLeft /> Volver
                        </button>
                        <h1 className="text-2xl font-black uppercase italic text-white tracking-tighter">
                            Gestión <span className="text-cyan-500">Fase Final</span>
                        </h1>
                    </div>
                    {/* 3. Condición para ocultar el botón al llegar a 32avos (6 etapas) */}
                    {etapasDb.length < 6 && (
                        <button onClick={gestionarNuevaEtapa} className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg font-black uppercase text-[10px] flex items-center gap-2 shadow-lg transition-all active:scale-95">
                            <FaPlus /> {etapasDb.length === 0 ? "Crear Cuadro" : "Agregar Etapa"}
                        </button>
                    )}
                </header>

                <div className="bg-[#0a0f2c] border border-slate-800 rounded-[2.5rem] p-6 overflow-x-auto shadow-2xl custom-scrollbar">
                    <div className="flex flex-row justify-center gap-0 min-w-max pb-10">
                        {columnas.map((col, idxCol) => (
                            <div key={`${col.id}-${idxCol}`} className="flex flex-col w-[260px] relative">
                                <div className="text-center mb-8">
                                    <span className={`border px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${col.esFinal ? 'border-yellow-500 text-yellow-500 bg-yellow-500/10' : 'border-cyan-500/30 text-cyan-400 bg-[#040714]'}`}>
                                        {col.nombre}
                                    </span>
                                </div>
                                <div className="flex flex-col justify-around flex-grow relative">
                                    {col.celdas.map((celda, idxCelda) => (
                                        <div key={idxCelda} className="relative py-4 px-4 flex items-center">
                                            <div className={`w-full bg-[#040714] border rounded-xl overflow-hidden shadow-md relative z-10 ${celda.partido ? 'border-cyan-500/40' : 'border-slate-800'}`}>
                                                <div
                                                    onClick={() => {
                                                        if (!celda.partido) {
                                                            setEtapaSeleccionada({ ...col, etapaId: col.id });
                                                            setIdxPartSeleccionado(celda.ordenReal - 1);
                                                            setModalCrearOpen(true);
                                                        }
                                                    }}
                                                    className={`p-4 ${!celda.partido ? 'cursor-pointer hover:bg-slate-800/40' : ''}`}
                                                >
                                                    <div className="space-y-3 pointer-events-none">
                                                        <div className="flex justify-between items-center text-[10px] font-black uppercase">
                                                            <div className="flex items-center gap-2 overflow-hidden">
                                                                {celda.partido?.equipoLocalEscudo && <img src={celda.partido.equipoLocalEscudo} className="w-5 h-5 object-contain" alt="" />}
                                                                <span className={celda.partido ? "text-white" : "text-slate-700"}>{celda.partido?.equipoLocal || "POR DEFINIR"}</span>
                                                            </div>
                                                            <span className="text-cyan-500">{celda.partido?.golesLocal ?? "--"}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center text-[10px] font-black uppercase">
                                                            <div className="flex items-center gap-2 overflow-hidden">
                                                                {celda.partido?.equipoVisitanteEscudo && <img src={celda.partido.equipoVisitanteEscudo} className="w-5 h-5 object-contain" alt="" />}
                                                                <span className={celda.partido ? "text-white" : "text-slate-700"}>{celda.partido?.equipoVisitante || "POR DEFINIR"}</span>
                                                            </div>
                                                            <span className="text-cyan-500">{celda.partido?.golesVisitante ?? "--"}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {celda.partido && (
                                                    <div className="bg-[#0d1333] px-3 py-2 border-t border-slate-800/50 flex justify-around items-center">
                                                        <button onClick={() => { setPartidoSeleccionado(prepararPartidoParaModal(celda.partido)); setModalEditarOpen(true); }} className="text-slate-500 hover:text-cyan-400 transition-colors p-1.5"><FaEdit /></button>
                                                        <button onClick={() => { setPartidoSeleccionado(prepararPartidoParaModal(celda.partido)); setModalCerrarOpen(true); }} className="text-slate-500 hover:text-emerald-400 transition-colors p-1.5"><FaCheckCircle /></button>
                                                        <button onClick={() => eliminarPartido(celda.partido.id)} className="text-slate-500 hover:text-red-500 transition-colors p-1.5"><FaTrashAlt /></button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* MODALES */}
            {modalCrearOpen && etapaSeleccionada && (
                <ModalPartidoEliminatorio
                    torneoId={id}
                    etapa={etapaSeleccionada}
                    idxPart={idxPartSeleccionado}
                    onClose={() => { setModalCrearOpen(false); setEtapaSeleccionada(null); }}
                    onSuccess={cargarEtapas}
                />
            )}

            {modalEditarOpen && partidoSeleccionado && (
                <EditarInfoModal
                    open={modalEditarOpen}
                    partido={partidoSeleccionado}
                    onClose={() => { setModalEditarOpen(false); setPartidoSeleccionado(null); }}
                    onSuccess={cargarEtapas}
                />
            )}

            {modalCerrarOpen && partidoSeleccionado && (
                <CerrarPartidoModal
                    open={modalCerrarOpen}
                    partido={partidoSeleccionado}
                    onClose={() => { setModalCerrarOpen(false); setPartidoSeleccionado(null); }}
                    onSuccess={cargarEtapas}
                />
            )}
        </div>
    );
}