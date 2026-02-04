import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import TorneosList from "../components/dashboard/TorneosList";
import EquiposList from "../components/equipos/EquiposList";
import UsuariosList from "../components/usuarios/UsuariosList";
import { FaTrophy, FaUsers, FaUserShield, FaTimes, FaBars, FaLayerGroup } from "react-icons/fa";

/* --- 1. COMPONENTES AUXILIARES --- */

function SidebarMenu({ selected, setSelected, user }) {
    const userRole = user?.role?.toUpperCase().trim();
    const tieneAccesoTotal = userRole === "ROLE_ADMIN" || userRole === "ROLE_ENCARGADOTORNEO" || userRole === "ADMIN";

    const items = [
        { id: "torneos", icon: <FaLayerGroup />, label: "Torneos" },
        { id: "equipos", icon: <FaTrophy />, label: "Equipos", restricted: true },
        { id: "usuarios", icon: <FaUsers />, label: "Usuarios", restricted: true },
    ];

    return (
        <ul className="space-y-3">
            {items
                .filter(item => !item.restricted || tieneAccesoTotal)
                .map(item => (
                    <li
                        key={item.id}
                        onClick={() => setSelected(item.id)}
                        className={`group cursor-pointer flex items-center gap-4 p-4 rounded-2xl font-bold uppercase text-[11px] tracking-widest transition-all border
                            ${selected === item.id
                            ? "bg-gradient-to-r from-slate-700 to-slate-800 text-white border-slate-600 shadow-lg shadow-black/50"
                            : "bg-transparent text-slate-500 border-transparent hover:bg-white/5 hover:text-slate-200"
                        }`}
                    >
                        <span className={`text-base ${selected === item.id ? "text-slate-200" : "text-slate-600 group-hover:text-slate-400"}`}>
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
        <div className="bg-white/5 p-5 rounded-[1.5rem] border border-slate-800/50 flex items-center gap-3 mt-auto">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center font-bold text-black text-sm shadow-inner">
                {user?.sub?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">{user?.sub || "Usuario"}</p>
                <p className="text-[10px] font-bold bg-gradient-to-r from-slate-400 to-slate-200 bg-clip-text text-transparent uppercase tracking-wider">
                    {user?.role?.replace("ROLE_", "") || "USUARIO"}
                </p>
            </div>
        </div>
    );
}

function Content({ selected, user }) {
    const userRole = user?.role?.toUpperCase().trim();
    const tieneAccesoTotal = userRole === "ROLE_ADMIN" || userRole === "ROLE_ENCARGADOTORNEO" || userRole === "ADMIN";

    if (selected === "torneos") return <TorneosList />;
    if (selected === "equipos" && tieneAccesoTotal) return <EquiposList />;
    if (selected === "usuarios" && tieneAccesoTotal) return <UsuariosList />;

    return null;
}

/* --- 2. COMPONENTE PRINCIPAL --- */

export default function Dashboard() {
    const { user } = useContext(AuthContext);
    const [selected, setSelected] = useState("torneos");
    const [mobileSidebar, setMobileSidebar] = useState(false);

    const panelTitle = user?.role?.includes("ADMIN") ? "Administración" : "Gestión de Liga";

    return (
        <div className="min-h-screen bg-[#05070a] text-slate-300 font-sans">

            {/* Fondo con profundidad metálica */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,_#1e293b_0%,_transparent_50%)] opacity-30"></div>
            </div>

            {/* Navbar con Z-INDEX controlado para no quedar "huérfano" detrás del modal */}
            <div className="fixed top-0 left-0 right-0 z-[100]">
                <Navbar onMenuClick={() => setMobileSidebar(true)} />
            </div>

            {/* --- SIDEBAR MOBILE --- */}
            <div className="lg:hidden">
                {mobileSidebar && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[110]" onClick={() => setMobileSidebar(false)} />
                )}

                <aside
                    className={`fixed top-0 left-0 h-full w-72 bg-[#0a0c10] border-r border-slate-800 z-[120] transform transition-transform duration-300 ease-in-out flex flex-col p-6
                    ${mobileSidebar ? "translate-x-0" : "-translate-x-full"}`}
                >
                    <div
                        onClick={() => setMobileSidebar(!mobileSidebar)}
                        className="absolute top-1/2 -translate-y-1/2 -right-[36px] w-[38px] h-[180px] bg-[#0a0c10] border border-l-0 border-slate-800 rounded-r-2xl flex flex-col items-center justify-center cursor-pointer shadow-[10px_0_15px_rgba(0,0,0,0.5)] active:scale-95 transition-all"
                    >
                        <div className="flex flex-col items-center gap-3">
                            {mobileSidebar ? (
                                <FaTimes className="text-slate-200 mb-2" size={14} />
                            ) : (
                                <FaBars className="text-slate-400 mb-2" size={14} />
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mb-10 px-2">
                        <h2 className="text-xs font-bold uppercase text-white tracking-widest italic border-b border-slate-800 pb-2 w-full">Panel de Control</h2>
                    </div>

                    <SidebarMenu
                        selected={selected}
                        setSelected={(val) => { setSelected(val); setMobileSidebar(false); }}
                        user={user}
                    />

                    <div className="mt-auto">
                        <UserSection user={user} />
                    </div>
                </aside>
            </div>

            <div className="relative z-10 flex pt-[64px] min-h-screen">

                {/* SIDEBAR PC */}
                <aside className="w-72 bg-[#0a0c10] border-r border-slate-800/50 hidden lg:flex flex-col p-6 fixed h-[calc(100vh-64px)] z-40">
                    <div className="flex items-center gap-3 mb-10 px-2 pt-2">
                        <div className="bg-white/5 p-2 rounded-xl border border-white/10 text-slate-400">
                            <FaUserShield size={20} />
                        </div>
                        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">{panelTitle}</h2>
                    </div>

                    <nav className="flex-1">
                        <SidebarMenu selected={selected} setSelected={setSelected} user={user} />
                    </nav>

                    <UserSection user={user} />
                </aside>

                <main className="flex-1 lg:ml-72 p-6 md:p-10 lg:p-12 transition-all mt-10 md:mt-14">
                    <div className="w-full max-w-[1500px]">
                        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between border-b border-slate-800/60 pb-8 gap-4">
                            <div>
                                <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
                                    {selected}
                                </h1>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-4 flex items-center gap-2">
                                    <span className="w-8 h-[1px] bg-slate-800"></span>
                                    Sistema de Gestión
                                </p>
                            </div>
                        </header>

                        <div className="min-h-[60vh]">
                            <Content selected={selected} user={user} />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}