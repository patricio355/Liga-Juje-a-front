import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import TablaPosiciones from "../components/torneo/TablaPosiciones";
import FixtureTorneo from "../components/torneo/FixtureTorneo";
import TabsTorneo from "../components/torneo/TabsTorneo";
import Navbar from "../components/Navbar"; // ajustá si cambia la ruta

export default function TorneoPublico() {
    const { id } = useParams();

    const [torneo, setTorneo] = useState(null);
    const [zonas, setZonas] = useState([]);
    const [zonaActiva, setZonaActiva] = useState(null);
    const [posiciones, setPosiciones] = useState([]);
    const [loading, setLoading] = useState(true);

    // 🔹 TAB ACTIVO
    const [activeTab, setActiveTab] = useState("Tabla de posiciones");

    // 1️⃣ Traer torneo + zonas
    useEffect(() => {
        const cargar = async () => {
            try {
                const res = await fetch(
                    `http://localhost:8080/api/torneos/activos`
                );
                const data = await res.json();

                const t = data.find(t => t.id === Number(id));
                setTorneo(t);

                setZonas(t.zonas);
                setZonaActiva(t.zonas[0]);
            } catch (e) {
                console.error(e);
            }
        };

        cargar();
    }, [id]);

    // 2️⃣ Traer posiciones de la zona
    useEffect(() => {
        if (!zonaActiva) return;

        const cargarPosiciones = async () => {
            setLoading(true);
            const res = await fetch(
                `http://localhost:8080/api/equipos/posiciones/zona/${zonaActiva.id}`
            );
            const data = await res.json();
            setPosiciones(data);
            setLoading(false);
        };

        cargarPosiciones();
    }, [zonaActiva]);

    if (!torneo) return null;

    return (
        <div className="min-h-screen bg-[#1F2333] text-white">
            <Navbar />

            {/* TITULO */}
            <h1 className="text-center text-3xl font-bold mt-10">
                {torneo.nombre.toUpperCase()} DIVISIONAL "{torneo.division}"
            </h1>

            {/* TABS */}
            <TabsTorneo
                activeTab={activeTab}
                onChange={setActiveTab}
            />

            {/* ZONAS */}
            <div className="flex justify-center gap-3 mt-6 flex-wrap">
                {zonas.map(z => (
                    <button
                        key={z.id}
                        onClick={() => setZonaActiva(z)}
                        className={`px-4 py-2 rounded-full border transition
                            ${
                            zonaActiva?.id === z.id
                                ? "bg-white text-black"
                                : "border-white/40 hover:border-white"
                        }`}
                    >
                        {z.nombre}
                    </button>
                ))}
            </div>

            {/* CONTENIDO SEGÚN TAB */}
            <div className="mt-8 px-6">
                {activeTab === "Tabla de posiciones" && (
                    loading ? (
                        <p className="text-center text-gray-400">
                            Cargando posiciones...
                        </p>
                    ) : (
                        <TablaPosiciones posiciones={posiciones} />
                    )
                )}

                {activeTab === "Fixture" && zonaActiva && (
                    <FixtureTorneo zonaId={zonaActiva.id} />
                )}

                {activeTab === "Equipos" && (
                    <p className="text-center opacity-70">
                        Equipos (pendiente)
                    </p>
                )}

                {activeTab === "Eliminatorias" && (
                    <p className="text-center opacity-70">
                        Eliminatorias (pendiente)
                    </p>
                )}

                {activeTab === "Estadísticas" && (
                    <p className="text-center opacity-70">
                        Estadísticas (pendiente)
                    </p>
                )}
            </div>
        </div>
    );
}
