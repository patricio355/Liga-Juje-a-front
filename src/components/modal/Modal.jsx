export default function Modal({ open, onClose, children }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl p-6 min-w-[350px]">
                {children}

                <div className="mt-4 text-right">
                    <button
                        onClick={onClose}
                        className="px-4 py-1 text-sm rounded bg-gray-300 hover:bg-gray-400"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}
