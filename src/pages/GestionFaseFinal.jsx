import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    FaArrowLeft, FaPlus, FaSync,
    FaEdit, FaCheckCircle, FaTrashAlt, FaTrophy, FaShieldAlt // <-- Agregado aquí
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
    const [creandoEtapa, setCreandoEtapa] = useState(false); // Nuevo estado para el feedback

    const [partidoSeleccionado, setPartidoSeleccionado] = useState(null);
    const [etapaSeleccionada, setEtapaSeleccionada] = useState(null);
    const [idxPartSeleccionado, setIdxPartSeleccionado] = useState(null);

    const [modalCrearOpen, setModalCrearOpen] = useState(false);
    const [modalCerrarOpen, setModalCerrarOpen] = useState(false);
    const [modalEditarOpen, setModalEditarOpen] = useState(false);

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

    const gestionarNuevaEtapa = async () => {
        const profundidadActual = etapasDb.length;
        if (profundidadActual >= 6) return;

        setCreandoEtapa(true); // Activar feedback
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
        } finally {
            setCreandoEtapa(false); // Desactivar feedback
        }
    };

    const eliminarUltimaEtapa = async (etapaId) => {
        if (!window.confirm("¿Estás seguro de eliminar esta etapa vacía?")) return;
        try {
            await apiFetch(`/api/torneos/etapas/${etapaId}`, { method: "DELETE" });
            await cargarEtapas();
        } catch (error) {
            alert(error.message);
        }
    };

    const eliminarPartido = async (partidoId) => {
        if (!window.confirm("¿Estás seguro de eliminar este partido?")) return;
        try {
            await apiFetch(`/api/partidos/faseFinal/${partidoId}`, { method: "DELETE" });
            await cargarEtapas();
        } catch (error) {
            alert("Error al eliminar");
        }
    };

    const prepararPartidoParaModal = (p) => {
        if (!p) return null;
        return {
            ...p,
            partidoId: p.id,
            equipoLocalNombre: p.equipoLocal,
            equipoVisitanteNombre: p.equipoVisitante,
            esFaseFinal: true,
            cancha: p.cancha,
            arbitro: p.arbitro,
            golesLocalPenales: p.golesLocalPenales,
            golesVisitantePenales: p.golesVisitantePenales
        };
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

        const columnaFinal = final ? [{ ...final, esFinal: true, celdas: [{ ordenReal: 1, partido: final.partidos[0] }] }] : [];
        return [...ladoIzquierdo, ...columnaFinal, ...ladoDerecho];
    };

    const columnas = generarColumnasEspejo();

    if (loading && !creandoEtapa) return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
            <FaSync className="text-white animate-spin text-4xl" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Sincronizando Cuadro</span>
        </div>
    );

    const ordenMaximo = etapasDb.length > 0 ? Math.max(...etapasDb.map(e => e.orden)) : 0;

    return (
        <div className="min-h-screen bg-black text-slate-200 font-sans">
            <Navbar />
            <main className="p-4 md:p-8 max-w-[1800px] mx-auto">

                {/* Header Acciones */}
                <header className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
                    <div className="text-center md:text-left">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-3 bg-white text-black px-5 py-2 rounded-full hover:bg-slate-200 transition-all mb-4 uppercase text-[10px] font-black tracking-widest shadow-lg"
                        >
                            <FaArrowLeft /> Volver al Panel
                        </button>
                        <h1 className="text-4xl md:text-5xl font-black uppercase text-white tracking-tighter leading-none">
                            GESTIÓN <span className="text-white/40">FASE FINAL</span>
                        </h1>
                    </div>

                    {etapasDb.length < 6 && (
                        <button
                            onClick={gestionarNuevaEtapa}
                            disabled={creandoEtapa}
                            className="bg-white hover:bg-slate-200 text-black px-10 py-5 rounded-2xl font-black uppercase text-xs flex items-center gap-4 shadow-[0_10px_30px_-10px_rgba(255,255,255,0.3)] transition-all active:scale-95 disabled:opacity-50"
                        >
                            {creandoEtapa ? (
                                <><FaSync className="animate-spin" /> Creando...</>
                            ) : (
                                <><FaPlus /> {etapasDb.length === 0 ? "Inicializar Cuadro" : "Expandir Etapa"}</>
                            )}
                        </button>
                    )}
                </header>

                {/* Contenedor del Cuadro */}
                <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-8 md:p-12 overflow-x-auto shadow-2xl custom-scrollbar relative">
                    <div className="flex flex-row justify-center gap-4 min-w-max pb-10">
                        {columnas.map((col, idxCol) => {
                            const esUltima = col.orden === ordenMaximo;
                            const tienePartidosReales = col.partidos && col.partidos.length > 0;

                            return (
                                <div key={`${col.id}-${idxCol}`} className="flex flex-col w-[180px] md:w-[220px] relative">
                                    <div className="text-center mb-8 flex flex-col items-center gap-3">
                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm ${col.esFinal ? 'border-white bg-white text-black' : 'border-white/10 text-slate-400 bg-black'}`}>
                                            {col.nombre}
                                        </span>
                                        {esUltima && !col.esFinal && !tienePartidosReales && (
                                            <button
                                                onClick={() => eliminarUltimaEtapa(col.id)}
                                                className="text-red-500 hover:text-red-400 transition-all flex items-center gap-2 text-[8px] font-black uppercase"
                                                title="Eliminar etapa vacía"
                                            >
                                                <FaTrashAlt size={10} /> Quitar
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex flex-col justify-around flex-grow relative min-h-[500px]">
                                        {col.celdas.map((celda, idxCelda) => (
                                            <div key={idxCelda} className="relative py-4 px-1 flex items-center">
                                                <div className={`w-full bg-black border rounded-2xl overflow-hidden shadow-2xl relative z-10 transition-all ${celda.partido ? 'border-white/20' : 'border-white/5 opacity-40 hover:opacity-100'}`}>
                                                    <div className="p-4">
                                                        <div className="space-y-3">
                                                            {/* Local */}
                                                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-tighter">
                                                                <div className="flex items-center gap-2 overflow-hidden">
                                                                    <div className="w-6 h-6 bg-[#111] rounded-md flex items-center justify-center shrink-0 border border-white/5">
                                                                        {celda.partido?.equipoLocalEscudo ? <img src={celda.partido.equipoLocalEscudo} className="w-4 h-4 object-contain" alt="" /> : <FaShieldAlt className="text-white/10" />}
                                                                    </div>
                                                                    <span className={`truncate max-w-[90px] ${celda.partido ? "text-white" : "text-slate-800"}`}>
                                                                        {celda.partido?.equipoLocal || "ESPERANDO"}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    {celda.partido?.estado === "FINALIZADO" && celda.partido.golesLocal === celda.partido.golesVisitante && (
                                                                        <span className="text-slate-600 text-[8px]">({celda.partido.golesLocalPenales})</span>
                                                                    )}
                                                                    <span className="text-white text-xs">{celda.partido?.golesLocal ?? "-"}</span>
                                                                </div>
                                                            </div>

                                                            {/* Visitante */}
                                                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-tighter">
                                                                <div className="flex items-center gap-2 overflow-hidden">
                                                                    <div className="w-6 h-6 bg-[#111] rounded-md flex items-center justify-center shrink-0 border border-white/5">
                                                                        {celda.partido?.equipoVisitanteEscudo ? <img src={celda.partido.equipoVisitanteEscudo} className="w-4 h-4 object-contain" alt="" /> : <FaShieldAlt className="text-white/10" />}
                                                                    </div>
                                                                    <span className={`truncate max-w-[90px] ${celda.partido ? "text-white" : "text-slate-800"}`}>
                                                                        {celda.partido?.equipoVisitante || "ESPERANDO"}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    {celda.partido?.estado === "FINALIZADO" && celda.partido.golesLocal === celda.partido.golesVisitante && (
                                                                        <span className="text-slate-600 text-[8px]">({celda.partido.golesVisitantePenales})</span>
                                                                    )}
                                                                    <span className="text-white text-xs">{celda.partido?.golesVisitante ?? "-"}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="bg-[#0a0a0a] px-2 py-2 border-t border-white/5 flex justify-around items-center">
                                                        <button
                                                            onClick={() => {
                                                                setEtapaSeleccionada({ ...col, etapaId: col.id });
                                                                setIdxPartSeleccionado(celda.ordenReal - 1);
                                                                setModalCrearOpen(true);
                                                            }}
                                                            className="text-slate-600 hover:text-white transition-all p-2"
                                                        >
                                                            <FaEdit size={14}/>
                                                        </button>
                                                        {celda.partido && (
                                                            <>
                                                                <button
                                                                    onClick={() => {
                                                                        setPartidoSeleccionado(prepararPartidoParaModal(celda.partido));
                                                                        setModalCerrarOpen(true);
                                                                    }}
                                                                    className="text-slate-600 hover:text-white transition-all p-2"
                                                                >
                                                                    <FaCheckCircle size={14}/>
                                                                </button>
                                                                <button
                                                                    onClick={() => eliminarPartido(celda.partido.id)}
                                                                    className="text-slate-600 hover:text-red-500 transition-all p-2"
                                                                >
                                                                    <FaTrashAlt size={14}/>
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>

            {/* Modales con el sistema unificado */}
            {modalCrearOpen && (
                <ModalPartidoEliminatorio
                    torneoId={id}
                    etapa={etapaSeleccionada}
                    idxPart={idxPartSeleccionado}
                    onClose={() => { setModalCrearOpen(false); setEtapaSeleccionada(null); }}
                    onSuccess={cargarEtapas}
                />
            )}
            {modalEditarOpen && partidoSeleccionado && (
                <EditarInfoModal open={modalEditarOpen} partido={partidoSeleccionado} onClose={() => { setModalEditarOpen(false); setPartidoSeleccionado(null); }} onSuccess={cargarEtapas} />
            )}
            {modalCerrarOpen && partidoSeleccionado && (
                <CerrarPartidoModal open={modalCerrarOpen} partido={partidoSeleccionado} onClose={() => { setModalCerrarOpen(false); setPartidoSeleccionado(null); }} onSuccess={cargarEtapas} />
            )}
        </div>
    );
}