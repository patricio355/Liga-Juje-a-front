import { useEffect, useState } from "react";
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

    const eliminarUltimaEtapa = async (etapaId) => {
        if (!window.confirm("¿Estás seguro de eliminar esta etapa vacía?")) return;
        try {
            // Usamos el endpoint que definimos en TorneoController
            await apiFetch(`/api/torneos/etapas/${etapaId}`, { method: "DELETE" });
            await cargarEtapas();
        } catch (error) {
            alert(error.message);
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

    const gestionarNuevaEtapa = async () => {
        const profundidadActual = etapasDb.length;
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
            await apiFetch(`/api/partidos/faseFinal/${partidoId}`, { method: "DELETE" });
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
        const columnaFinal = final ? [{ ...final, esFinal: true, celdas: [{ ordenReal: 1, partido: final.partidos[0] }] }] : [];
        return [...ladoIzquierdo, ...columnaFinal, ...ladoDerecho];
    };

    const columnas = generarColumnasEspejo();

    if (loading) return (
        <div className="min-h-screen bg-[#05081c] flex items-center justify-center">
            <FaSync className="text-cyan-500 animate-spin text-3xl" />
        </div>
    );

    // Buscamos el orden máximo para saber cuál es la última etapa
    const ordenMaximo = etapasDb.length > 0 ? Math.max(...etapasDb.map(e => e.orden)) : 0;

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
                    {etapasDb.length < 6 && (
                        <button onClick={gestionarNuevaEtapa} className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg font-black uppercase text-[10px] flex items-center gap-2 shadow-lg transition-all active:scale-95">
                            <FaPlus /> {etapasDb.length === 0 ? "Crear Cuadro" : "Agregar Etapa"}
                        </button>
                    )}
                </header>

                <div className="bg-[#0a0f2c] border border-slate-800 rounded-[2.5rem] p-6 overflow-x-auto shadow-2xl custom-scrollbar">
                    <div className="flex flex-row justify-center gap-2 min-w-max pb-10">
                        {columnas.map((col, idxCol) => {
                            // Una etapa es eliminable si es la última, no es la final, y no tiene partidos reales guardados en DB
                            const esUltima = col.orden === ordenMaximo;
                            const tienePartidosReales = col.partidos && col.partidos.length > 0;

                            return (
                                <div key={`${col.id}-${idxCol}`} className="flex flex-col w-[150px] md:w-[180px] relative">
                                    <div className="text-center mb-4 flex flex-col items-center gap-2">
                                        <span className={`border px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${col.esFinal ? 'border-yellow-500 text-yellow-500 bg-yellow-500/10' : 'border-cyan-500/30 text-cyan-400 bg-[#040714]'}`}>
                                            {col.nombre}
                                        </span>
                                        {/* BOTÓN ELIMINAR ETAPA */}
                                        {esUltima && !col.esFinal && !tienePartidosReales && (
                                            <button
                                                onClick={() => eliminarUltimaEtapa(col.id)}
                                                className="text-red-500 hover:text-red-400 p-1 transition-all"
                                                title="Eliminar etapa vacía"
                                            >
                                                <FaTrashAlt size={10} />
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex flex-col justify-around flex-grow relative">
                                        {col.celdas.map((celda, idxCelda) => (
                                            <div key={idxCelda} className="relative py-2 px-1 flex items-center">
                                                <div className={`w-full bg-[#040714] border rounded-lg overflow-hidden shadow-md relative z-10 ${celda.partido ? 'border-cyan-500/40' : 'border-slate-800'}`}>
                                                    <div className="p-2 transition-all">
                                                        <div className="space-y-2">
                                                            <div className="flex justify-between items-center text-[9px] font-black uppercase">
                                                                <div className="flex items-center gap-1.5 overflow-hidden">
                                                                    {celda.partido?.equipoLocalEscudo && <img src={celda.partido.equipoLocalEscudo} className="w-4 h-4 object-contain" alt="" />}
                                                                    <span className={`truncate max-w-[80px] ${celda.partido ? "text-white" : "text-slate-700"}`}>
                                                                        {celda.partido?.equipoLocal || "POR DEFINIR"}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-0.5">
                                                                    {celda.partido?.estado === "FINALIZADO" && celda.partido.golesLocal === celda.partido.golesVisitante && (
                                                                        <span className="text-slate-500 font-bold">({celda.partido.golesLocalPenales})</span>
                                                                    )}
                                                                    <span className="text-cyan-500">{celda.partido?.golesLocal ?? "--"}</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex justify-between items-center text-[9px] font-black uppercase">
                                                                <div className="flex items-center gap-1.5 overflow-hidden">
                                                                    {celda.partido?.equipoVisitanteEscudo && <img src={celda.partido.equipoVisitanteEscudo} className="w-4 h-4 object-contain" alt="" />}
                                                                    <span className={`truncate max-w-[80px] ${celda.partido ? "text-white" : "text-slate-700"}`}>
                                                                        {celda.partido?.equipoVisitante || "POR DEFINIR"}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-0.5">
                                                                    {celda.partido?.estado === "FINALIZADO" && celda.partido.golesLocal === celda.partido.golesVisitante && (
                                                                        <span className="text-slate-500 font-bold">({celda.partido.golesVisitantePenales})</span>
                                                                    )}
                                                                    <span className="text-cyan-500">{celda.partido?.golesVisitante ?? "--"}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="bg-[#0d1333] px-1 py-1 border-t border-slate-800/50 flex justify-around items-center">
                                                        <button
                                                            onClick={() => {
                                                                setEtapaSeleccionada({ ...col, etapaId: col.id });
                                                                setIdxPartSeleccionado(celda.ordenReal - 1);
                                                                setModalCrearOpen(true);
                                                            }}
                                                            className="text-slate-500 hover:text-cyan-400 transition-colors p-1"
                                                        >
                                                            <FaEdit size={12}/>
                                                        </button>
                                                        {celda.partido && (
                                                            <>
                                                                <button
                                                                    onClick={() => {
                                                                        setPartidoSeleccionado(prepararPartidoParaModal(celda.partido));
                                                                        setModalCerrarOpen(true);
                                                                    }}
                                                                    className="text-slate-500 hover:text-emerald-400 transition-colors p-1"
                                                                >
                                                                    <FaCheckCircle size={12}/>
                                                                </button>
                                                                <button
                                                                    onClick={() => eliminarPartido(celda.partido.id)}
                                                                    className="text-slate-500 hover:text-red-500 transition-colors p-1"
                                                                >
                                                                    <FaTrashAlt size={12}/>
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

            {/* MODALES IGUAL QUE ANTES */}
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