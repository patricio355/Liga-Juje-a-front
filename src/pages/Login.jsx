import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar.jsx";

export default function Login() {

    const { login } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleLogin(e) {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                setError("Email o contraseña incorrectos");
                return;
            }

            const data = await response.json();
            login(data.token);

            window.location.href = "/dashboard";
        } catch (err) {
            setError("No se pudo conectar al servidor");
        }
    }

    return (
        <>
            <Navbar />

            <div className="min-h-screen flex items-center justify-center bg-[#1B2033] px-4">

                <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md border">

                    <h1 className="text-3xl font-bold text-center mb-6">
                        Iniciar Sesión ⚽
                    </h1>

                    {/* MENSAJE DE ERROR ROJO */}
                    {error && (
                        <p className="text-red-600 text-center mb-3 font-semibold">
                            {error}
                        </p>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">

                        <input
                            type="email"
                            name="email"
                            autoComplete="email"
                            placeholder="Correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <button
                            type="submit"
                            className="w-full bg-[#1B2033] text-white p-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition"
                        >
                            Ingresar
                        </button>

                    </form>
                </div>
            </div>
        </>
    );
}
