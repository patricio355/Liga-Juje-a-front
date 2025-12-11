import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";

import TorneosList from "../components/dashboard/TorneosList";
export default function Dashboard() {
    const { user } = useContext(AuthContext);

    const [selected, setSelected] = useState("torneos");
    const [mobileSidebar, setMobileSidebar] = useState(false);

    return (
        <>
            <Navbar onMenuClick={() => setMobileSidebar(true)} />

            <div className="flex min-h-screen bg-[#0f1325] text-white">

                {/* SIDEBAR PC */}
                <aside className="w-64 bg-[#1a1f36] p-6 border-r border-gray-700 hidden md:block">

                    <h2 className="text-xl font-bold mb-6">Administración</h2>

                    <SidebarMenu selected={selected} setSelected={setSelected} />

                    <UserSection user={user} />
                </aside>

                {/* SIDEBAR MOBILE (slide-in) */}
                {mobileSidebar && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        onClick={() => setMobileSidebar(false)}
                    >
                        <aside
                            className="absolute left-0 top-0 h-full w-64 bg-[#1a1f36] p-6 shadow-xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-xl font-bold mb-6">Administración</h2>

                            <SidebarMenu
                                selected={selected}
                                setSelected={(val) => {
                                    setSelected(val);
                                    setMobileSidebar(false);
                                }}
                            />

                            <UserSection user={user} />
                        </aside>
                    </div>
                )}

                {/* CONTENIDO */}
                <main className="flex-1 p-6 md:p-10">

                    <h1 className="text-3xl font-bold mb-6 capitalize">
                        {selected}
                    </h1>

                    {/* CONTENIDO DINÁMICO */}
                    <Content selected={selected} />
                </main>
            </div>
        </>
    );
}


// ---------------- COMPONENTES PEQUEÑOS -----------------

function SidebarMenu({ selected, setSelected }) {
    const items = [
        { id: "torneos", icon: "⚽", label: "Torneos" },
        { id: "equipos", icon: "🏆", label: "Equipos" },
        { id: "arbitros", icon: "🧑‍⚖️", label: "Árbitros" },
        { id: "canchas", icon: "🏟️", label: "Canchas" },
        { id: "usuarios", icon: "👤", label: "Usuarios" },
    ];

    return (
        <ul className="space-y-3">
            {items.map((item) => (
                <li
                    key={item.id}
                    className={`cursor-pointer p-3 rounded-lg transition
                        ${selected === item.id ? "bg-blue-600" : "hover:bg-[#2a314d]"}`}
                    onClick={() => setSelected(item.id)}
                >
                    {item.icon} {item.label}
                </li>
            ))}
        </ul>
    );
}

function UserSection({ user }) {
    return (
        <div className="mt-10 text-gray-300 text-sm">
            <p>{user?.sub}</p>
            <p className="text-xs">{user?.role}</p>
        </div>
    );
}


function Content({ selected }) {

    if (selected === "torneos") {
        return (
            <div className="bg-[#1c213b] p-6 rounded-xl shadow text-gray-300">
                <TorneosList />
            </div>
        );
    }

    return (
        <div className="bg-[#1c213b] p-6 rounded-xl shadow text-gray-300">
            <p>
                Aquí irán los <strong>{selected}</strong>...
            </p>
        </div>
    );
}

