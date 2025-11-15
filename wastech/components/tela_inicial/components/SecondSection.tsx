// dashboard/components/tela_inicial/components/SecondSection.tsx
import React from 'react';

const SecondSection: React.FC = () => {
  return (
    <section className="flex items-center bg-white rounded-[20px] mx-[5%] mb-10 py-10 shadow-sm">
      <div className="flex-1 pl-10">
        <h2 className="text-[2.5rem] font-bold text-gray-800 mb-0 leading-tight">
          Sua Horta na<br />palma da sua<br />mão!!
        </h2>
      </div>
      <div className="flex-1 flex justify-end items-center relative pr-10 min-h-[260px]">
        <div className="bg-green-300 w-56 h-64 rounded-[60px] absolute right-2.5 top-2.5 z-10"></div>
        <img 
  src="/Imagens/homem_olhando_planta.png" 
  alt="Homem segurando plantas" 
  className="max-w-[340px] rounded-[18px] relative z-20 shadow-lg"
/>
      </div>
    </section>
  );
};

export default SecondSection;