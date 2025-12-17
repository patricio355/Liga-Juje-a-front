import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import TorneoCard from "../components/torneo/TorneoCard.jsx";
import { apiFetch } from "../api/api";

export default function Home() {

    const [search, setSearch] = useState("");
    const [torneos, setTorneos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargar = async () => {
            setLoading(true);
            try {
                const data = await apiFetch("/api/torneos/activos");
                setTorneos(data);
            } catch (err) {
                console.error("Error cargando torneos:", err);
            } finally {
                setLoading(false);
            }
        };

        cargar();
    }, []);

    const filtrados = torneos.filter(t =>
        t.nombre.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#1F2333] text-white">

            <Navbar />

            <h1 className="text-center text-3xl font-bold mt-10 tracking-widest">
                TORNEOS
            </h1>

            <SearchBar
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* Loading */}
            {loading && (
                <p className="text-center mt-10 text-gray-400">
                    Cargando torneos...
                </p>
            )}

            {/* Lista */}
            <div className="mt-6 space-y-4">
                {filtrados.map(t => (
                    <TorneoCard key={t.id} torneo={t} />
                ))}
            </div>

            {!loading && filtrados.length === 0 && (
                <p className="text-center mt-10 text-gray-400">
                    No se encontraron torneos.
                </p>
            )}

        </div>
    );
}
