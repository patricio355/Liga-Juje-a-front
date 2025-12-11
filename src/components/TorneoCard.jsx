export default function TorneoCard({ nombre }) {
    return (
        <div className="flex items-center bg-[#E9E9E9] rounded-lg w-[80%] max-w-3xl mx-auto mt-4 py-3 px-4 border border-[#A9C8FF]">

            {/* Icono F */}
            <div className="w-8 h-8 bg-black text-white rounded-md flex items-center justify-center font-bold mr-4">
                F
            </div>

            {/* Nombre del torneo */}
            <span className="text-gray-800 font-semibold">{nombre}</span>
        </div>
    );
}
