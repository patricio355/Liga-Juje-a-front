import { useState } from "react";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import TorneoCard from "../components/TorneoCard";

export default function Home() {
    const [search, setSearch] = useState("");

    const torneos = [
        "LIGA BULÓN",
        "LIGA ZAPATÓN",
        "LIGA ZAPATÓN",
        "LIGA BULÓN",
        "LIGA ZAPATÓN",
        "LIGA ZAPATÓN",
    ];

    const filtrados = torneos.filter(t =>
        t.toLowerCase().includes(search.toLowerCase())
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

            {/* Lista de torneos */}
            <div className="mt-6">
                {filtrados.map((t, i) => (
                    <TorneoCard key={i} nombre={t} />
                ))}
            </div>

        </div>
    );
}
