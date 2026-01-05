export async function apiFetch(url, options = {}) {
    const token = localStorage.getItem("token");

    // 1. Usar 127.0.0.1 ayuda a saltar la demora de resolución de "localhost"
    const baseUrl = import.meta.env.VITE_API_URL;

    // 2. Solo enviamos Content-Type si hay un body (POST, PUT, PATCH)
    // Esto evita el Preflight de 13s en los GET de torneos
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

    // --- INTERCEPTOR DE SESIÓN ---
    if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        if (!window.location.pathname.includes("/login")) {
            window.location.href = "/login?session=expired";
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