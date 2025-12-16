import { apiFetch } from "./api";

export const getCanchas = () =>
    apiFetch("/api/canchas");