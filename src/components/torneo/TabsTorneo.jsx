export default function TabsTorneo({ activeTab, onChange }) {
    const tabs = [
        "Tabla de posiciones",
        "Fixture",
        "Eliminatorias",
        "Equipos",
        "Estadísticas",
        "Canchas",
    ];

    return (
        <div className="flex justify-center mt-6">
            <div className="bg-white text-black rounded-full flex gap-4 px-6 py-2 overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => onChange(tab)}
                        className={`px-3 py-1 rounded-full transition whitespace-nowrap
                            ${
                            activeTab === tab
                                ? "bg-black text-white font-semibold"
                                : "opacity-60 hover:opacity-100"
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
        </div>
    );
}
