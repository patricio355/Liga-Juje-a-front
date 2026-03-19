import { FaSearch } from "react-icons/fa";

export default function SearchBar({ value, onChange, placeholder = "Buscar torneo..." }) {
    return (
        <div className="flex justify-center mt-6 w-full">
            <div className="relative w-full max-w-xl group">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-600/30 via-slate-500/30 to-slate-600/30 rounded-2xl blur-md opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none"></div>
                <div className="relative flex items-center bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md transition-all duration-300 group-hover:border-white/20 shadow-xl focus-within:border-white/30 focus-within:shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                    <div className="pl-5 text-slate-400">
                        <FaSearch size={16} />
                    </div>
                    <input
                        type="text"
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        className="w-full py-4 px-4 bg-transparent text-slate-200 placeholder-slate-500 outline-none font-bold uppercase tracking-widest text-xs"
                    />
                </div>
            </div>
        </div>
    );
}
