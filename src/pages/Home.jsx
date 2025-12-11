import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import TorneoCard from "../components/TorneoCard";

export default function Home() {

    const [search, setSearch] = useState("");
    const [torneos, setTorneos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:8080/api/torneos/activos")
            .then(res => res.json())
            .then(data => {
                setTorneos(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error cargando torneos:", err);
                setLoading(false);
            });
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
                <p className="text-center mt-10 text-gray-400">Cargando torneos...</p>
            )}

            {/* Lista de torneos */}
            <div className="mt-6">
                {filtrados.map((t) => (
                    <TorneoCard key={t.id} nombre={t.nombre} />
                ))}
            </div>

            {/* Si no se encontraron */}
            {!loading && filtrados.length === 0 && (
                <p className="text-center mt-10 text-gray-400">
                    No se encontraron torneos.
                </p>
            )}

        </div>
    );
}
