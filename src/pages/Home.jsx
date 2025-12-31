import { useState, useEffect, useMemo } from "react";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import TorneoCard from "../components/torneo/TorneoCard.jsx";
import { apiFetch } from "../api/api";
import { FaTrophy, FaFutbol } from "react-icons/fa";

export default function Home() {
    const [search, setSearch] = useState("");
    const [torneos, setTorneos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargar = async () => {
            setLoading(true);
            try {
                const data = await apiFetch("/api/torneos/activos");
                setTorneos(data || []);
            } catch (err) {
                console.error("Error cargando torneos:", err);
            } finally {
                setLoading(false);
            }
        };
        cargar();
    }, []);

    const filtrados = useMemo(() => {
        return torneos.filter(t => t.nombre?.toLowerCase().includes(search.toLowerCase()));
    }, [torneos, search]);

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-emerald-500/30">
            <Navbar />

            <main className="px-4 py-8 max-w-4xl mx-auto w-full">

                {/* ENCABEZADO TIPO LOGIN */}
                <div className="flex flex-col items-center mt-12 mb-10">
                    <div className="bg-[#1e293b] p-4 rounded-2xl mb-4 border border-slate-700/50 shadow-xl">
                        <FaTrophy className="text-4xl text-emerald-500" />
                    </div>

                    <h1 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-white text-center leading-none">
                        Torneos <span className="text-emerald-500">Activos</span>
                    </h1>

                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-3">
                        Ligas Jujeñas • Temporada 2025
                    </p>
                </div>

                {/* BUSCADOR */}
                <div className="mb-10">
                    <SearchBar
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar competencia o liga..."
                    />
                </div>

                {/* CONTENIDO PRINCIPAL */}
                {loading ? (
                    <div className="flex flex-col items-center py-20 gap-3">
                        <FaFutbol className="text-3xl text-emerald-600 animate-spin" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sincronizando...</span>
                    </div>
                ) : (
                    /* ELIMINAMOS fondos y bordes de aquí para que TorneoCard luzca solo */
                    <div className="grid gap-5">
                        {filtrados.length > 0 ? (
                            filtrados.map(t => (
                                <div key={t.id} className="transition-transform hover:scale-[1.01] active:scale-100">
                                    <TorneoCard torneo={t} />
                                </div>
                            ))
                        ) : (
                            <div className="py-16 text-center bg-[#1e293b]/50 rounded-2xl border border-dashed border-slate-700/50">
                                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">
                                    Sin resultados para "{search}"
                                </p>
                            </div>
                        )}
                    </div>
                )}

                <footer className="mt-20 mb-10 text-center border-t border-slate-700/30 pt-6">
                    <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em] italic">
                        Sistema de Gestión Deportiva • v2.0
                    </p>
                </footer>
            </main>
        </div>
    );
}