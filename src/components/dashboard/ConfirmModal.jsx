export default function ConfirmModal({ mensaje, onConfirm, onCancel }) {
    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={onCancel}
        >
            <div
                className="bg-[#1c213b] p-6 rounded-xl w-96 shadow-xl text-white"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold mb-4">Confirmar acción</h2>

                <p className="mb-6 text-gray-300">{mensaje}</p>

                <div className="flex justify-end gap-3">
                    <button
                        className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
                        onClick={onCancel}
                    >
                        Cancelar
                    </button>

                    <button
                        className="px-4 py-2 bg-red-600 rounded hover:bg-red-500"
                        onClick={onConfirm}
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
}
