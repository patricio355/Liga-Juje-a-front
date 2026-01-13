import { useState, useEffect } from "react";

// Escaneo automático de la carpeta publicidades
const imagenesGlob = import.meta.glob("../publicidades/*.{png,jpg,jpeg,webp}", { eager: true });
const ads = Object.values(imagenesGlob).map((mod) => mod.default);

export default function AdsCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (ads.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % ads.length);
        }, 10000); // Cambia cada 4 segundos

        return () => clearInterval(interval);
    }, []);

    if (ads.length === 0) return null;

    return (
        <div className="w-full bg-transparent overflow-hidden relative">
            <div className="max-w-4xl mx-auto h-24 md:h-32 relative">
                {ads.map((ad, index) => {
                    // LÓGICA DE POSICIONAMIENTO INFINITO
                    let positionClass = "translate-x-full opacity-0"; // Por defecto: a la derecha (fuera)

                    if (index === currentIndex) {
                        // IMAGEN ACTUAL: En el centro
                        positionClass = "translate-x-0 opacity-100";
                    } else if (
                        index === (currentIndex - 1 + ads.length) % ads.length
                    ) {
                        // IMAGEN ANTERIOR: Se va por la izquierda
                        positionClass = "-translate-x-full opacity-0";
                    }

                    return (
                        <div
                            key={index}
                            className={`absolute inset-0 w-full h-full flex items-center justify-center transition-all duration-1000 ease-in-out transform ${positionClass}`}
                        >
                            <div className="w-full h-full flex items-center justify-center">
                                <img
                                    src={ad}
                                    alt={`Publicidad ${index}`}
                                    className="h-full w-auto object-contain p-2 opacity-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]"
                                />
                            </div>
                        </div>
                    );
                })}

                {/* Indicadores (Opcionales, muy sutiles) */}
                {ads.length > 1 && (
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-20">
                        {ads.map((_, i) => (
                            <div
                                key={i}
                                className={`h-0.5 rounded-full transition-all duration-500 ${
                                    i === currentIndex ? "w-4 bg-blue-500" : "w-1 bg-slate-600"
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}