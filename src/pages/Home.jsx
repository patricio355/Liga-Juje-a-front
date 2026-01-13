import { useState, useEffect, useMemo } from "react";
import Navbar from "../components/Navbar";
// import AdsCarousel from "../components/AdsCarousel"; // Publicidad comentada
import SearchBar from "../components/SearchBar";
import TorneoCard from "../components/torneo/TorneoCard.jsx";
import { apiFetch } from "../api/api";
import { FaTrophy } from "react-icons/fa";

// Importamos la imagen para los laterales (Comentado)
// import cartelLateral from "../publicidades/cartelera/cartelera.jpg";

export default function Home() {
    const [search, setSearch] = useState("");
    const [torneos, setTorneos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let montado = true;
        const cargar = async () => {
            const data = await apiFetch("/api/torneos/activos");
            if (montado) {
                setTorneos(data || []);
                setLoading(false);
            }
        };
        cargar();
        return () => { montado = false; };
    }, []);

    const filtrados = useMemo(() => {
        return torneos.filter(t => t.nombre?.toLowerCase().includes(search.toLowerCase()));
    }, [torneos, search]);

    return (
        <div className="min-h-screen bg-[#02040a] relative overflow-hidden text-slate-200 font-sans">

            {/* --- PUBLICIDADES LATERALES COMENTADAS --- */}
            {/* <aside className="hidden 2xl:flex fixed left-2 top-1/2 -translate-y-1/2 w-[400px] h-[90vh] z-50 pointer-events-none">
                <div className="w-full h-full relative group pointer-events-auto">
                    <img
                        src={cartelLateral}
                        alt="Publicidad Izquierda"
                        className="w-full h-full object-contain opacity-100 transition-transform duration-1000 group-hover:scale-105"
                    />
                </div>
            </aside>

            <aside className="hidden 2xl:flex fixed right-2 top-1/2 -translate-y-1/2 w-[400px] h-[90vh] z-50 pointer-events-none">
                <div className="w-full h-full relative group pointer-events-auto">
                    <img
                        src={cartelLateral}
                        alt="Publicidad Derecha"
                        className="w-full h-full object-contain opacity-100 transition-transform duration-1000 group-hover:scale-105"
                    />
                </div>
            </aside>
            */}

            <div className="relative z-10">
                <Navbar />

                {/* Carrusel superior comentado */}
                {/* <AdsCarousel /> */}

                <main className="px-4 py-8 max-w-4xl mx-auto w-full">
                    <div className="flex flex-col items-center mt-6 mb-10">
                        <div className="bg-[#0e1630]/60 backdrop-blur-md p-4 rounded-2xl mb-4 border border-blue-500/30 shadow-[0_0_40px_rgba(37,99,235,0.3)]">
                            <FaTrophy className="text-4xl text-blue-400" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-white text-center leading-none">
                            Torneos <span className="text-blue-500 bg-gradient-to-r from-blue-400 via-blue-200 to-indigo-300 bg-clip-text text-transparent">Activos</span>
                        </h1>
                    </div>

                    <div className="mb-10">
                        <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar competencia..." />
                    </div>

                    <div className="grid gap-5">
                        {loading ? (
                            <div className="h-40 bg-white/5 animate-pulse rounded-3xl" />
                        ) : (
                            filtrados.map(t => (
                                <div key={t.id} className="transition-transform hover:scale-[1.01]">
                                    <TorneoCard torneo={t} />
                                </div>
                            ))
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}