import { useState, useEffect, useMemo } from "react";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import TorneoCard from "../components/torneo/TorneoCard.jsx";
import { apiFetch } from "../api/api";
import { FaTrophy } from "react-icons/fa";

// Componente Interno para el Skeleton (Tema Champions)
const TorneoSkeleton = () => (
    <div className="w-full h-32 bg-[#0e1630]/40 backdrop-blur-sm rounded-[2rem] border border-blue-500/10 animate-pulse flex items-center p-6 gap-4">
        <div className="w-16 h-16 bg-blue-600/20 rounded-2xl"></div>
        <div className="flex-1 space-y-3">
            <div className="h-4 bg-blue-600/20 rounded w-1/3"></div>
            <div className="h-3 bg-blue-600/10 rounded w-1/4"></div>
        </div>
        <div className="w-10 h-10 bg-blue-600/20 rounded-xl"></div>
    </div>
);

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
        /* FONDO DINÁMICO: Combina un azul profundo con un resplandor central brillante (estilo imagen trofeo) */
        <div className="min-h-screen bg-[#02040a] relative overflow-hidden text-slate-200 font-sans selection:bg-blue-500/30">

            {/* Capa de resplandor central (imita el spot de luz detrás del trofeo) */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[radial-gradient(circle,_rgba(29,78,216,0.15)_0%,_rgba(30,58,138,0.05)_40%,_transparent_70%)] opacity-70 animate-pulse"></div>
                <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(ellipse_at_top,_rgba(37,99,235,0.15)_0%,_transparent_70%)]"></div>
            </div>

            <div className="relative z-10">
                <Navbar />

                <main className="px-4 py-8 max-w-4xl mx-auto w-full">
                    <div className="flex flex-col items-center mt-12 mb-10">
                        {/* Icono con resplandor azul potente */}
                        <div className="bg-[#0e1630]/60 backdrop-blur-md p-4 rounded-2xl mb-4 border border-blue-500/30 shadow-[0_0_40px_rgba(37,99,235,0.3)]">
                            <FaTrophy className="text-4xl text-blue-400 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-white text-center leading-none">
                            Torneos <span className="text-blue-500 bg-gradient-to-r from-blue-400 via-blue-200 to-indigo-300 bg-clip-text text-transparent">Activos</span>
                        </h1>
                        <p className="text-blue-400/80 text-[10px] font-black uppercase tracking-[0.3em] mt-3 drop-shadow-sm">
                            Ligas Jujeñas • Temporada 2026
                        </p>
                    </div>

                    <div className="mb-10">
                        <SearchBar
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar competencia o liga..."
                        />
                    </div>

                    <div className="grid gap-5">
                        {loading ? (
                            <>
                                <TorneoSkeleton />
                                <TorneoSkeleton />
                                <TorneoSkeleton />
                            </>
                        ) : (
                            <>
                                {filtrados.length > 0 ? (
                                    filtrados.map(t => (
                                        <div key={t.id} className="transition-transform hover:scale-[1.01] active:scale-100">
                                            <TorneoCard torneo={t} />
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-16 text-center bg-[#0e1630]/30 backdrop-blur-sm rounded-2xl border border-dashed border-blue-500/20">
                                        <p className="text-blue-400 font-bold uppercase text-[10px] tracking-widest">
                                            Sin resultados para "{search}"
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    <footer className="mt-20 mb-10 text-center border-t border-blue-900/30 pt-6">
                        <p className="text-[9px] font-bold text-blue-800 uppercase tracking-[0.2em] italic opacity-60">
                            PÁGINA OFICIAL • v1.0
                        </p>
                    </footer>
                </main>
            </div>
        </div>
    );
}