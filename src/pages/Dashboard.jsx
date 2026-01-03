import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import TorneosList from "../components/dashboard/TorneosList";
import EquiposList from "../components/equipos/EquiposList";
import UsuariosList from "../components/usuarios/UsuariosList";
import { FaFutbol, FaTrophy, FaUsers, FaUserShield, FaTimes, FaBars } from "react-icons/fa";

/* --- 1. DEFINICIÓN DE COMPONENTES AUXILIARES (ARRIBA PARA EVITAR ERRORES) --- */

function SidebarMenu({ selected, setSelected, user }) {
    const items = [
        { id: "torneos", icon: <FaFutbol />, label: "Torneos" },
        { id: "equipos", icon: <FaTrophy />, label: "Equipos", adminOnly: true  },
        { id: "usuarios", icon: <FaUsers />, label: "Usuarios", adminOnly: true },
    ];

    return (
        <ul className="space-y-2">
            {items
                .filter(item => !item.adminOnly || user?.role === "ROLE_ADMIN")
                .map(item => (
                    <li
                        key={item.id}
                        onClick={() => setSelected(item.id)}
                        className={`group cursor-pointer flex items-center gap-4 p-4 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all border
                            ${selected === item.id
                            ? "bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-900/20"
                            : "bg-transparent text-slate-400 border-transparent hover:bg-[#0f172a] hover:text-slate-200"
                        }`}
                    >
                        <span className={`${selected === item.id ? "text-white" : "text-emerald-500 transition-transform"}`}>
                            {item.icon}
                        </span>
                        {item.label}
                    </li>
                ))}
        </ul>
    );
}

function UserSection({ user }) {
    return (
        <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-700/50 flex items-center gap-3 mt-auto">
            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-black text-white text-xs">
                {user?.sub?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="overflow-hidden">
                <p className="text-[10px] font-black text-white truncate uppercase italic">{user?.sub || "Admin"}</p>
                <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-tighter opacity-70">
                    {user?.role?.replace("ROLE_", "") || "ADMIN"}
                </p>
            </div>
        </div>
    );
}

function Content({ selected, user }) {
    const sectionClass = "bg-[#1e293b] p-4 md:p-8 rounded-3xl border border-slate-700/50 shadow-2xl";
    if (selected === "torneos") return <div className={sectionClass}><TorneosList /></div>;
    if (selected === "equipos" && user?.role === "ROLE_ADMIN") return <div className={sectionClass}><EquiposList /></div>;
    if (selected === "usuarios" && user?.role === "ROLE_ADMIN") return <div className={sectionClass}><UsuariosList /></div>;
    return null;
}

/* --- 2. COMPONENTE PRINCIPAL --- */

export default function Dashboard() {
    const { user } = useContext(AuthContext);
    const [selected, setSelected] = useState("torneos");
    const [mobileSidebar, setMobileSidebar] = useState(false);

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200">
            {/* Navbar fijo: z-index alto para quedar arriba de todo */}
            <div className="fixed top-0 left-0 right-0 z-[100]">
                <Navbar onMenuClick={() => setMobileSidebar(true)} />
            </div>

            <div className="flex pt-[64px] min-h-screen relative">

                {/* SIDEBAR PC: Fijo a la izquierda */}
                <aside className="w-72 bg-[#1e293b] border-r border-slate-700/50 hidden lg:flex flex-col p-6 fixed h-[calc(100vh-64px)]">
                    <div className="flex items-center gap-3 mb-10 px-2">
                        <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20 text-emerald-500">
                            <FaUserShield size={18} />
                        </div>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white italic">Panel Admin</h2>
                    </div>
                    <SidebarMenu selected={selected} setSelected={setSelected} user={user} />
                    <UserSection user={user} />
                </aside>

                {/* SIDEBAR MOBILE: Aparece sobre el contenido */}
                {mobileSidebar && (
                    <div className="fixed inset-0 z-[110] lg:hidden">
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileSidebar(false)} />
                        <aside className="absolute left-0 top-0 h-full w-72 bg-[#1e293b] p-6 shadow-2xl border-r border-slate-700/50 flex flex-col">
                            <div className="flex justify-between items-center mb-10">
                                <h2 className="text-[10px] font-black uppercase text-white">Administración</h2>
                                <button onClick={() => setMobileSidebar(false)} className="text-slate-500"><FaTimes size={20} /></button>
                            </div>
                            <SidebarMenu
                                selected={selected}
                                setSelected={(val) => { setSelected(val); setMobileSidebar(false); }}
                                user={user}
                            />
                            <div className="mt-auto"><UserSection user={user} /></div>
                        </aside>
                    </div>
                )}

                {/* CONTENIDO: ml-72 en PC para no tapar el sidebar */}
                <main className="flex-1 lg:ml-72 p-4 md:p-10 transition-all">
                    <div className="max-w-5xl mx-auto">

                        {/* Botón flotante para móvil si el Navbar no tiene el trigger */}
                        <button
                            onClick={() => setMobileSidebar(true)}
                            className="lg:hidden mb-6 flex items-center gap-2 bg-emerald-600/10 text-emerald-500 px-4 py-2 rounded-xl border border-emerald-500/20 font-black text-[10px] uppercase italic"
                        >
                            <FaBars /> Menú de Gestión
                        </button>

                        <header className="mb-8 flex items-center justify-between border-b border-slate-700/30 pb-6">
                            <div>
                                <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white">{selected}</h1>
                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Control General de la Liga</p>
                            </div>
                        </header>

                        <Content selected={selected} user={user} />
                    </div>
                </main>
            </div>
        </div>
    );
}