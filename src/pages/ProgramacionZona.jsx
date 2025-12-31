import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { apiFetch } from "../api/api";
import {
    getOpcionesProgramacion,
    getProgramacionFecha,
    programarPartido,
} from "../api/programacion.api";
import FilaProgramacion from "../components/programacion/FilaProgramacion";
import PartidoCardAdmin from "../components/torneo/PartidoCardAdmin.jsx";
import CerrarPartidoModal from "../components/modal/CerrarPartidoModal.jsx";
import EditarResultadoModal from "../components/modal/EditarResultadoModal.jsx";
import { FaArrowLeft, FaUserCircle, FaExclamationTriangle, FaPlus } from "react-icons/fa";

export default function ProgramacionZona() {
    const { zonaId } = useParams();
    const navigate = useNavigate();

    // 1. Persistencia de fechas
    const [totalFechas, setTotalFechas] = useState(() => {
        const guardado = localStorage.getItem(`totalFechas_${zonaId}`);
        return guardado ? parseInt(guardado) : 1;
    });

    const [fechaSeleccionada, setFechaSeleccionada] = useState(1);
    const [tarjetas, setTarjetas] = useState([]);
    const [programados, setProgramados] = useState([]);
    const [nombreZona, setNombreZona] = useState("");
    const [openEquipoId, setOpenEquipoId] = useState(null);

    const [partidoSeleccionado, setPartidoSeleccionado] = useState(null);
    const [modalCerrar, setModalCerrar] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);

    const userEmail = "m@gmail.com";

    // 2. FUNCIÓN PARA TRAER EL NOMBRE DE LA ZONA (Usando el zonaId del parámetro)
    const obtenerNombreZona = async () => {
        try {
            const data = await apiFetch(`/api/torneos/zonas/${zonaId}`);
            if (data && data.nombre) {
                setNombreZona(data.nombre);
            }
        } catch (error) {
            console.error("Error al traer el nombre:", error);
            setNombreZona("ZONA");
        }
    };

    const cargarTodo = async () => {
        const opciones = await getOpcionesProgramacion(zonaId, fechaSeleccionada);
        const prog = await getProgramacionFecha(zonaId, fechaSeleccionada);
        setTarjetas(opciones || []);
        setProgramados(prog || []);
    };

    useEffect(() => {
        if (zonaId) {
            cargarTodo();
            obtenerNombreZona(); // Traemos el nombre al cargar la página
        }
    }, [fechaSeleccionada, zonaId]);

    const agregarFecha = () => {
        const nuevaCantidad = totalFechas + 1;
        setTotalFechas(nuevaCantidad);
        setFechaSeleccionada(nuevaCantidad);
        localStorage.setItem(`totalFechas_${zonaId}`, nuevaCantidad);
    };

    const handleSeleccionDirecta = async (partidoId) => {
        try {
            await programarPartido(zonaId, fechaSeleccionada, partidoId);
            await cargarTodo();
        } catch (error) {
            alert("Error al programar");
        }
    };

    // Lógica de equipos duplicados
    const equiposDuplicados = useMemo(() => {
        const conteo = {};
        programados.forEach((p) => {
            const l = p.local || p.equipoLocalNombre;
            const v = p.visitante || p.equipoVisitanteNombre;
            if (l) conteo[l] = (conteo[l] || 0) + 1;
            if (v) conteo[v] = (conteo[v] || 0) + 1;
        });
        return new Set(Object.keys(conteo).filter(n => conteo[n] > 1));
    }, [programados]);

    const equiposOcupadosSet = useMemo(() => {
        const set = new Set();
        programados.forEach((p) => {
            set.add(p.local || p.equipoLocalNombre);
            set.add(p.visitante || p.equipoVisitanteNombre);
        });
        return set;
    }, [programados]);

    return (
        <div className="min-h-screen bg-[#0b1023] text-white font-sans">
            <Navbar />
            <div className="p-6 max-w-[1600px] mx-auto w-full">
                <div className="flex justify-between items-center mb-8">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white transition group">
                        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium uppercase text-xs tracking-widest">Volver al panel del torneo</span>
                    </button>
                    <div className="bg-[#1c213b] px-4 py-2 rounded-full border border-gray-700 flex items-center gap-3 text-sm font-bold text-gray-200">
                        <FaUserCircle className="text-gray-400 text-xl" /> {userEmail}
                    </div>
                </div>

                {/* TÍTULO DINÁMICO ARREGLADO */}
                <h1 className="text-4xl font-bold uppercase tracking-tighter mb-10 text-center xl:text-left">
                    PROGRAMACIÓN DE FIXTURE <span className="text-blue-500">"{nombreZona || 'CARGANDO...'}"</span>
                </h1>

                {/* SELECTOR DE FECHAS CON BOTÓN AGREGAR */}
                <div className="flex items-center gap-4 mb-10 overflow-x-auto pb-2 scrollbar-hide">
                    <div className="flex gap-3">
                        {Array.from({ length: totalFechas }, (_, i) => i + 1).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFechaSeleccionada(f)}
                                className={`px-8 py-2.5 rounded-lg font-bold text-xs uppercase transition-all shadow-md ${
                                    fechaSeleccionada === f ? "bg-white text-black scale-105" : "bg-[#1c213b] text-gray-400 border border-gray-800"
                                }`}
                            > Fecha {f} </button>
                        ))}
                    </div>
                    <button onClick={agregarFecha} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-lg">
                        <FaPlus className="text-xs" /> <span className="text-xs font-bold uppercase">Agregar Fecha</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-5 gap-10">
                    {/* PANEL IZQUIERDO */}
                    <div className="xl:col-span-3 space-y-6">
                        <div className="bg-[#121735]/50 border border-[#1f2547] rounded-2xl p-8 shadow-2xl">
                            <h2 className="text-gray-500 font-bold text-xs uppercase tracking-[0.2em] mb-8">Selección de enfrentamientos</h2>
                            <div className="space-y-5">
                                {tarjetas.map((t) => (
                                    <FilaProgramacion
                                        key={t.equipoId}
                                        tarjeta={t}
                                        opciones={t.opciones.filter(op => !op.jugado && !new Set(programados.map(p => p.partidoId)).has(op.partidoId))}
                                        equipoYaProgramado={equiposOcupadosSet.has(t.equipoNombre)}
                                        open={openEquipoId === t.equipoId}
                                        onOpen={() => setOpenEquipoId(t.equipoId)}
                                        onClose={() => setOpenEquipoId(null)}
                                        onSelect={(op) => handleSeleccionDirecta(op.partidoId)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* PANEL DERECHO */}
                    <div className="xl:col-span-2">
                        <div className="bg-[#121735] border border-[#1f2547] rounded-2xl p-6 shadow-xl sticky top-6">
                            <div className="flex justify-between items-start mb-8">
                                <h2 className="text-gray-500 font-bold text-xs uppercase tracking-[0.2em]">PROGRAMACIÓN</h2>
                                {equiposDuplicados.size > 0 && (
                                    <div className="bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-xl flex items-center gap-2">
                                        <FaExclamationTriangle className="text-red-500 text-xs" />
                                        <p className="text-[10px] font-bold text-red-400 leading-tight uppercase">Juegan +1 partido</p>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-4">
                                {programados.map((p) => (
                                    <PartidoCardAdmin key={p.partidoId} partido={p} equiposDuplicados={equiposDuplicados}
                                                      onCerrar={() => {setPartidoSeleccionado(p); setModalCerrar(true);}}
                                                      onEditar={() => {setPartidoSeleccionado(p); setModalEditar(true);}}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <CerrarPartidoModal open={modalCerrar} partido={partidoSeleccionado} onClose={() => setModalCerrar(false)} onSuccess={cargarTodo} />
            <EditarResultadoModal open={modalEditar} partido={partidoSeleccionado} onClose={() => setModalEditar(false)} onSuccess={cargarTodo} />
        </div>
    );
}