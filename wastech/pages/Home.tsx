// Home.tsx ATUALIZADO:
import React from 'react';
import { Header } from '../components/tela_inicial/components/Header';
// REMOVA esta linha: import HomeNavbar from '../components/HomeNavbar';
import HeroBanner from '../components/tela_inicial/components/HeroBanner';
import SecondSection from '../components/tela_inicial/components/SecondSection';
import ImpactSection from '../components/tela_inicial/components/ImpactSection';
import Footer from '../components/tela_inicial/components/Footer';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white font-['Segoe_UI',_sans-serif]">
      <Header/> {/* AGORA TEM BOTÕES LOGIN/CADASTRO */}
      {/* REMOVA esta linha: <HomeNavbar /> */}
      <main>
        <HeroBanner />
        <SecondSection />
        <ImpactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;