export default function SearchBar({ value, onChange }) {
    return (
        <div className="flex justify-center mt-6">
            <div className="relative w-[80%] max-w-xl">
                <input
                    type="text"
                    placeholder="Buscar torneo..."
                    value={value}
                    onChange={onChange}
                    className="w-full py-2 px-4 rounded-full bg-[#E9E9E9] text-gray-700 outline-none"
                />
                <div className="absolute right-4 top-2.5 text-gray-500 text-lg">
                    🔍
                </div>
            </div>
        </div>
    );
}
