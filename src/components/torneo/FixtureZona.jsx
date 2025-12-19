import FixtureTorneo from "./FixtureTorneo";
import ProgramacionComoFixture from "./ProgramacionComoFixture";

export default function FixtureZona({ zonaId, tipoTorneo }) {
    if (tipoTorneo === "CERRADO") {
        return <FixtureTorneo zonaId={zonaId} />;
    }

    // ABIERTO
    return <ProgramacionComoFixture zonaId={zonaId} />;
}
