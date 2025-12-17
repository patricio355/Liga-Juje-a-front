import { useNavigate } from "react-router-dom";

export default function TorneoCard({ torneo }) {

    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/torneo/${torneo.id}`)}
            className="
                mx-auto
                max-w-2xl
                bg-[#2a314d]
                p-6
                rounded-2xl
                cursor-pointer
                transition
                hover:bg-[#36406b]
                hover:scale-[1.01]
                border border-transparent
                hover:border-blue-400
            "
        >
            <h2 className="text-xl font-bold text-white">
                {torneo.nombre}
            </h2>

            <p className="text-sm text-gray-300 mt-1">
                División {torneo.division}
            </p>

            <p className="text-sm text-gray-200 mt-3">
                <span className="text-gray-400">Zonas:</span>{" "}
                {torneo.zonas?.map(z => z.nombre).join(", ")}
            </p>
        </div>
    );
}
