import Navbar from "../components/Navbar";
import EquiposList from "../components/equipos/EquiposList";

export default function Equipos() {
    return (
        <div className="min-h-screen bg-[#1F2333] text-white">
            <Navbar />

            <div className="max-w-5xl mx-auto mt-10 px-4">
                <h1 className="text-3xl font-bold mb-6">
                    Equipos
                </h1>

                <EquiposList />
            </div>
        </div>
    );
}
