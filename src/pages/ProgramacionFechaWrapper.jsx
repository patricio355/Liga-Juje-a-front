import { useParams } from "react-router-dom";
import ProgramacionZona from "./ProgramacionZona";

export default function ProgramacionFechaWrapper() {
    const { zonaId } = useParams();
    return <ProgramacionZona zonaId={Number(zonaId)} />;
}