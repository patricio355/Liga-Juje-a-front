import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import TorneosList from "../components/dashboard/TorneosList";
import EquiposList from "../components/equipos/EquiposList";
import UsuariosList from "../components/usuarios/UsuariosList";
import { FaTrophy, FaUsers, FaUserShield, FaTimes, FaBars, FaFutbol, FaLayerGroup } from "react-icons/fa";

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
                            ? "bg-cyan-600 text-white border-cyan-500 shadow-lg shadow-cyan-900/20"
                            : "bg-transparent text-slate-400 border-transparent hover:bg-[#0a0f2c] hover:text-slate-200"
                        }`}
                    >
                        <span className={`text-base ${selected === item.id ? "text-white" : "text-cyan-500"}`}>
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
        <div className="bg-[#0a0f2c] p-5 rounded-[1.5rem] border border-slate-800 flex items-center gap-3 mt-auto shadow-inner">
            <div className="w-10 h-10 rounded-xl bg-cyan-600 flex items-center justify-center font-bold text-white text-sm shadow-lg">
                {user?.sub?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">{user?.sub || "Usuario"}</p>
                <p className="text-[10px] font-bold text-cyan-500 uppercase tracking-wider opacity-80">
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
        <div className="min-h-screen bg-[#05081c] text-slate-200">
            <div className="fixed top-0 left-0 right-0 z-[100]">
                <Navbar onMenuClick={() => setMobileSidebar(true)} />
            </div>

            <div className="flex pt-[64px] min-h-screen">

                {/* SIDEBAR PC - Azul noche profundo */}
                <aside className="w-72 bg-[#0a0f2c] border-r border-slate-800/50 hidden lg:flex flex-col p-6 fixed h-[calc(100vh-64px)] z-40">
                    <div className="flex items-center gap-3 mb-10 px-2 pt-2">
                        <div className="bg-cyan-500/10 p-2 rounded-xl border border-cyan-500/20 text-cyan-500">
                            <FaUserShield size={20} />
                        </div>
                        <h2 className="text-xs font-bold uppercase tracking-widest text-white">{panelTitle}</h2>
                    </div>

                    <nav className="flex-1">
                        <SidebarMenu selected={selected} setSelected={setSelected} user={user} />
                    </nav>

                    <UserSection user={user} />
                </aside>

                {/* SIDEBAR MOBILE */}
                {mobileSidebar && (
                    <div className="fixed inset-0 z-[110] lg:hidden">
                        <div className="absolute inset-0 bg-[#05081c]/95 backdrop-blur-sm" onClick={() => setMobileSidebar(false)} />
                        <aside className="absolute left-0 top-0 h-full w-72 bg-[#0a0f2c] p-6 shadow-2xl border-r border-slate-800 flex flex-col">
                            <div className="flex justify-between items-center mb-10">
                                <h2 className="text-xs font-bold uppercase text-white tracking-widest">Menú</h2>
                                <button onClick={() => setMobileSidebar(false)} className="text-slate-500 hover:text-white transition-colors">
                                    <FaTimes size={24} />
                                </button>
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

                {/* CONTENIDO PRINCIPAL - Expandido y alineado a la izquierda */}
                <main className="flex-1 lg:ml-72 p-6 md:p-10 lg:p-12 transition-all">
                    {/* Botón menú mobile */}
                    <button
                        onClick={() => setMobileSidebar(true)}
                        className="lg:hidden mb-8 flex items-center gap-3 bg-cyan-600/10 text-cyan-400 px-5 py-3 rounded-xl border border-cyan-500/20 font-bold text-xs uppercase tracking-widest"
                    >
                        <FaBars /> Panel de Control
                    </button>

                    <div className="w-full max-w-[1500px]"> {/* Aumenté el max-w para aprovechar el ancho */}
                        <header className="mb-12 flex items-center justify-between border-b border-slate-800 pb-8">
                            <div>
                                <h1 className="text-4xl font-bold text-white tracking-tight capitalize">
                                    {selected}
                                </h1>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-[0.2em] mt-2">
                                    Sistema de Gestión Profesional <span className="text-cyan-500 mx-2">•</span> Liga de Fútbol
                                </p>
                            </div>
                        </header>

                        {/* Contenedor de las listas sin el padding excesivo de Content para que use el ancho real */}
                        <div className="min-h-[60vh]">
                            <Content selected={selected} user={user} />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}