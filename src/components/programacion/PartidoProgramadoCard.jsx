export default function PartidoProgramadoCard({ partido }) {
    return (
        <div className="bg-green-200  rounded p-2 ">
            {partido.local} vs {partido.visitante}
        </div>
    );
}
