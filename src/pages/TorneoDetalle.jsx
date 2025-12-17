import { useState } from "react";
import TabsTorneo from "../components/torneo/TabsTorneo";
import FixtureTorneo from "../components/torneo/FixtureTorneo";
import TablaPosiciones from "../components/torneo/TablaPosiciones";
import EquiposTorneo from "../components/torneo/EquiposTorneo";
import Eliminatorias from "../components/torneo/Eliminatorias";
import EstadisticasTorneo from "../components/torneo/EstadisticasTorneo";

export default function TorneoDetalle() {

    const [activeTab, setActiveTab] = useState("Tabla de posiciones");

    // después lo vas a sacar de la URL
    const zonaId = 1;

    return (
        <div className="pb-10">

            {/* Tabs */}
            <TabsTorneo
                activeTab={activeTab}
                onChange={setActiveTab}
            />

            {/* Contenido */}
            <div className="mt-6">
                {activeTab === "Tabla de posiciones" && (
                    <TablaPosiciones zonaId={zonaId} />
                )}

                {activeTab === "Fixture" && (
                    <FixtureTorneo zonaId={zonaId} />
                )}

                {activeTab === "Eliminatorias" && (
                    <Eliminatorias />
                )}

                {activeTab === "Equipos" && (
                    <EquiposTorneo zonaId={zonaId} />
                )}

                {activeTab === "Estadísticas" && (
                    <EstadisticasTorneo zonaId={zonaId} />
                )}

                {activeTab === "Canchas" && (
                    <p className="text-center opacity-70">
                        Próximamente
                    </p>
                )}
            </div>
        </div>
    );
}
