import { useEffect, useState } from "react";
import PartidoCard from "./PartidoCard";

export default function FixtureTorneo({ zonaId }) {
    const [fixture, setFixture] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fechaSeleccionada, setFechaSeleccionada] = useState(null);

    // 🔹 Cargar fixture
    useEffect(() => {
        const cargarFixture = async () => {
            try {
                const res = await fetch(
                    `http://localhost:8080/api/partidos/zona/${zonaId}/fixture`
                );
                const data = await res.json();
                setFixture(Array.isArray(data) ? data : []);
            } catch (e) {
                console.error(e);
                setFixture([]);
            } finally {
                setLoading(false);
            }
        };

        cargarFixture();
    }, [zonaId]);

    // 🔹 Setear primera fecha automáticamente
    useEffect(() => {
        if (fixture.length > 0) {
            setFechaSeleccionada(fixture[0].numeroFecha);
        }
    }, [fixture]);

    if (loading) {
        return (
            <p className="text-center mt-6 text-gray-400">
                Cargando fixture...
            </p>
        );
    }

    if (fixture.length === 0) {
        return (
            <p className="text-center mt-6 text-gray-400">
                No hay partidos cargados
            </p>
        );
    }

    return (
        <div className="mt-6 px-4">

            {/* SELECTOR DE FECHA */}
            <div className="flex items-center justify-center gap-2 mb-6 text-white">
                <span className="text-sm opacity-70">FECHA:</span>

                <button
                    onClick={() =>
                        setFechaSeleccionada(f =>
                            Math.max(1, f - 1)
                        )
                    }
                    className="px-2 py-1 bg-white/10 rounded"
                >
                    ◀
                </button>

                {fixture.map(f => (
                    <button
                        key={f.numeroFecha}
                        onClick={() => setFechaSeleccionada(f.numeroFecha)}
                        className={`px-3 py-1 rounded text-sm font-semibold transition
                            ${
                            fechaSeleccionada === f.numeroFecha
                                ? "bg-white text-black"
                                : "bg-white/10 text-white hover:bg-white/20"
                        }
                        `}
                    >
                        {f.numeroFecha}
                    </button>
                ))}

                <button
                    onClick={() =>
                        setFechaSeleccionada(f =>
                            Math.min(fixture.length, f + 1)
                        )
                    }
                    className="px-2 py-1 bg-white/10 rounded"
                >
                    ▶
                </button>
            </div>

            {/* PARTIDOS DE LA FECHA */}
            {fixture
                .filter(f => f.numeroFecha === fechaSeleccionada)
                .map(fecha => (
                    <div key={fecha.numeroFecha} className="space-y-3">
                        {fecha.partidos.map(partido => (
                            <PartidoCard
                                key={partido.id}
                                partido={partido}
                            />
                        ))}
                    </div>
                ))}
        </div>
    );
}
