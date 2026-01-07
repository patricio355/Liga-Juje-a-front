import Swal from "sweetalert2";

export async function apiFetch(url, options = {}) {
    const token = localStorage.getItem("token");
    const baseUrl = import.meta.env.VITE_API_URL;

    const defaultHeaders = {
        ...(token && { Authorization: `Bearer ${token}` }),
    };

    if (options.body) {
        defaultHeaders["Content-Type"] = "application/json";
    }

    const res = await fetch(baseUrl + url, {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    });

    // --- INTERCEPTOR DE SESIÓN OPTIMIZADO PARA MÓVIL ---
    if (res.status === 401 || res.status === 403) {
        if (!window.location.pathname.includes("/login")) {

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            await Swal.fire({
                title: 'SESIÓN EXPIRADA',
                text: 'Por seguridad, ingresa nuevamente.',
                icon: 'warning',
                iconColor: '#10b981', // Verde esmeralda para el icono
                background: '#0f172a',
                color: '#f1f5f9',
                confirmButtonText: 'INGRESAR',
                allowOutsideClick: false,
                allowEscapeKey: false,
                // Ajustes de tamaño y estética
                width: '320px', // Más compacto, ideal para móviles
                padding: '1.5rem',
                buttonsStyling: false, // Desactivamos estilos por defecto para usar los tuyos
                customClass: {
                    popup: 'border border-slate-700 rounded-[2rem] shadow-2xl',
                    title: 'text-lg font-black italic uppercase tracking-tighter mb-2',
                    htmlContainer: 'text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed',
                    confirmButton: 'bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-[10px] py-3 px-8 rounded-xl transition-all active:scale-95 shadow-lg shadow-emerald-900/20'
                }
            });

            window.location.href = "/login";
        }
        throw new Error("Sesión expirada o inválida");
    }

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Error en la API");
    }

    if (res.status === 204) return null;

    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return res.json();
    }

    return null;
}