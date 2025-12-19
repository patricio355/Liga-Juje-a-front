// src/pages/ProgramacionZona.jsx
import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import {
    getOpcionesProgramacion,
    getProgramacionFecha,
    programarPartido,
} from "../api/programacion.api";
import FilaProgramacion from "../components/programacion/FilaProgramacion";
import PartidoCardAdmin from "../components/torneo/PartidoCardAdmin.jsx";
import CerrarPartidoModal from "../components/modal/CerrarPartidoModal.jsx";
import EditarResultadoModal from "../components/modal/EditarResultadoModal.jsx";

export default function ProgramacionZona({ zonaId }) {
    const [fecha, setFecha] = useState(1);
    const [tarjetas, setTarjetas] = useState([]);
    const [programados, setProgramados] = useState([]);
    const [openEquipoId, setOpenEquipoId] = useState(null);
    const [selecciones, setSelecciones] = useState({});

    const [partidoSeleccionado, setPartidoSeleccionado] = useState(null);
    const [modalCerrar, setModalCerrar] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);

    const abrirModalCerrar = (partido) => {
        setPartidoSeleccionado(partido);
        setModalCerrar(true);
    };

    const abrirModalEditar = (partido) => {
        setPartidoSeleccionado(partido);
        setModalEditar(true);
    };

    const cerrarModales = () => {
        setPartidoSeleccionado(null);
        setModalCerrar(false);
        setModalEditar(false);
    };

    const cargarTodo = async () => {
        const opciones = await getOpcionesProgramacion(zonaId, fecha);
        const prog = await getProgramacionFecha(zonaId, fecha);

        setTarjetas(opciones || []);
        setProgramados(prog || []);
        setSelecciones({});
        setOpenEquipoId(null);
    };

    useEffect(() => {
        cargarTodo();
    }, [fecha, zonaId]);

    const programadosSet = useMemo(
        () => new Set(programados.map((p) => p.partidoId)),
        [programados]
    );

    const equiposOcupadosSet = useMemo(() => {
        const set = new Set();
        programados.forEach((p) => {
            if (p.local) set.add(p.local);
            if (p.visitante) set.add(p.visitante);
        });
        return set;
    }, [programados]);

    return (
        <div className="min-h-screen bg-[#0b1023]">
            <Navbar />

            <div className="p-6">
                {/* SELECTOR FECHA */}
                <div className="flex gap-2 mb-4 overflow-x-auto">
                    {Array.from({ length: 9 }, (_, i) => i + 1).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFecha(f)}
                            className={`px-3 py-1 rounded border ${
                                fecha === f
                                    ? "bg-black text-white"
                                    : "bg-[#1c213b] text-gray-300"
                            }`}
                        >
                            Fecha {f}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* PANEL IZQUIERDO */}
                    <div className="lg:col-span-2 bg-[#121735] border border-[#1f2547] rounded-xl p-4">
                        <h2 className="text-white font-bold text-lg mb-3">
                            Armar partidos
                        </h2>

                        <div className="space-y-3">
                            {tarjetas.map((t) => {
                                const opcionesDisponibles = t.opciones.filter(
                                    (op) =>
                                        !op.jugado &&
                                        !programadosSet.has(op.partidoId)
                                );

                                const equipoYaProgramado =
                                    equiposOcupadosSet.has(t.equipoNombre);

                                return (
                                    <FilaProgramacion
                                        key={t.equipoId}
                                        tarjeta={t}
                                        opciones={opcionesDisponibles}
                                        equipoYaProgramado={equipoYaProgramado}
                                        open={openEquipoId === t.equipoId}
                                        onOpen={() =>
                                            setOpenEquipoId(t.equipoId)
                                        }
                                        onClose={() => setOpenEquipoId(null)}
                                        seleccion={selecciones[t.equipoId]}
                                        onSelect={(op) =>
                                            setSelecciones((prev) => ({
                                                ...prev,
                                                [t.equipoId]: {
                                                    partidoId: op.partidoId,
                                                    vs: op.vs,
                                                },
                                            }))
                                        }
                                        onConfirm={async () => {
                                            const sel =
                                                selecciones[t.equipoId];
                                            if (!sel) return;
                                            await programarPartido(
                                                zonaId,
                                                fecha,
                                                sel.partidoId
                                            );
                                            await cargarTodo();
                                        }}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    {/* PANEL DERECHO */}
                    <div className="bg-[#121735] border border-[#1f2547] rounded-xl p-4">
                        <h2 className="text-white font-bold text-lg mb-3">
                            PROGRAMACIÓN
                        </h2>

                        {programados.length === 0 ? (
                            <p className="text-gray-400 text-sm">
                                Todavía no hay partidos programados.
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {programados.map((p) => (
                                    <PartidoCardAdmin
                                        key={p.partidoId}
                                        partido={p}
                                        onCerrar={abrirModalCerrar}
                                        onEditar={abrirModalEditar}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* MODALES */}
            <CerrarPartidoModal
                open={modalCerrar}
                partido={partidoSeleccionado}
                onClose={cerrarModales}
                onSuccess={cargarTodo}
            />

            <EditarResultadoModal
                open={modalEditar}
                partido={partidoSeleccionado}
                onClose={cerrarModales}
                onSuccess={cargarTodo}
            />
        </div>
    );
}
