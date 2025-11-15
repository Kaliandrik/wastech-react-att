// dashboard/components/tela_inicial/components/HeroBanner.tsx
import React, { useState, useEffect } from 'react';

export interface CarouselSlide {
  id: number;
  image: string;
  alt: string;
}

const HeroBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

const slides: CarouselSlide[] = [
  { id: 1, image: '/Imagens/mulher_regando.png', alt: 'Mulher regando plantas' },
  { id: 2, image: '/Imagens/horta_urbana.png', alt: 'Horta urbana' },
  { id: 3, image: '/Imagens/regador_plantação.jpg', alt: 'Regador em plantação' }
];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative min-h-[540px] flex items-center rounded-b-[20px] mb-10 pl-[5%] overflow-hidden">
      {/* Carousel */}
      <div className="absolute inset-0 z-10">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 bg-cover bg-left transition-opacity duration-600 rounded-b-[20px] ${
              index === currentSlide ? 'opacity-100 z-20' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url('${slide.image}')` }}
          />
        ))}
        <button 
          className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/85 text-green-800 border-none rounded-full w-11 h-11 text-2xl font-bold cursor-pointer shadow-md hover:bg-green-800 hover:text-white hover:shadow-lg transition-all z-30 flex items-center justify-center"
          onClick={prevSlide}
        >
          &#10094;
        </button>
        <button 
          className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/85 text-green-800 border-none rounded-full w-11 h-11 text-2xl font-bold cursor-pointer shadow-md hover:bg-green-800 hover:text-white hover:shadow-lg transition-all z-30 flex items-center justify-center"
          onClick={nextSlide}
        >
          &#10095;
        </button>
      </div>

      {/* Content */}
      <div className="text-white max-w-[480px] z-20 relative">
        <h1 className="text-[2.6rem] font-bold leading-tight mb-4 text-shadow-lg">
          Transforme<br />Seu espaço em<br />uma Horta<br />inteligente
        </h1>
        <p className="text-lg mb-7 text-shadow-md">
          Plante, aprenda, conheça<br />e salve o planeta.
        </p>
        <div className="flex gap-5">
          <a href="/cadastro">
            <button className="bg-green-800 text-white border-none rounded-lg px-8 py-3 text-lg font-semibold cursor-pointer hover:bg-green-700 transition-colors">
              Comece Agora
            </button>
          </a>
          <a href="/sobre">
            <button className="bg-white text-green-800 border-none rounded-lg px-8 py-3 text-lg font-semibold cursor-pointer hover:bg-gray-100 transition-colors">
              Saiba mais
            </button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;