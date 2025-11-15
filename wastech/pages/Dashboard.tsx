import { useState } from 'react';
import { Header } from '../components/components-dashboard/Header';
import { Navbar } from '../components/components-dashboard/Navbar';
import { PlantModal } from '../components/components-dashboard/PlantModal';
import { PlantsList } from '../components/components-dashboard/PlantsList';
import { usePlants } from '../hooks/usePlants';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from "react-router-dom";

// ✅ ADICIONE O LEVELS AQUI (ANTES DO INTERFACE PLANT)
const LEVELS = [
  { level: 1, xpRequired: 0, title: "Iniciante" },
  { level: 2, xpRequired: 100, title: "Aprendiz Verde" },
  { level: 3, xpRequired: 300, title: "Jardinheiro" },
  { level: 4, xpRequired: 600, title: "Cultivador" },
  { level: 5, xpRequired: 1000, title: "Agricultor" },
  { level: 6, xpRequired: 1500, title: "Mestre Verde" },
  { level: 7, xpRequired: 2100, title: "Especialista" },
  { level: 8, xpRequired: 2800, title: "Mestre Jardineiro" },
  { level: 9, xpRequired: 3600, title: "Lenda Verde" },
  { level: 10, xpRequired: 4500, title: "Mestre Supremo" }
];

interface Plant {
  id: string;
  name: string;
  type: string;
  plantingDate: string;
  formattedDate: string;
  progress: number;
  notes?: string;
}

export const Dashboard: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null);
  const [showAllPlants, setShowAllPlants] = useState(false);
  const { 
    plants, 
    savePlant, 
    removePlant, 
    userXP,
    userLevel,
    totalSavings,
    loading,
    hasLoaded  // ✅ NOVO: controle se já carregou do Firestore
  } = usePlants();
  const { user } = useAuth();
  const navigate = useNavigate();

  // ✅ DEBUG COMPLETO DO USUÁRIO
  console.log("🔥 DEBUG Dashboard - User object:", {
    user: user,
    displayName: user?.displayName,
    email: user?.email,
    uid: user?.uid,
    providerData: user?.providerData,
    isAnonymous: user?.isAnonymous,
    metadata: user?.metadata
  });

  console.log("🎯 Dashboard: Componente renderizado", { 
    modalOpen, 
    plantsCount: plants.length,
    user: user?.email,
    loading,
    hasLoaded, // ✅ NOVO: debug do hasLoaded
    userLevel,
    userXP
  });

  const handleAddPlant = () => {
    console.log("🎯 Dashboard: handleAddPlant CLICADO!");
    setEditingPlant(null);
    setModalOpen(true);
  };

  const handleEditPlant = (plant: Plant) => {
    console.log("🎯 Dashboard: handleEditPlant CLICADO!", plant);
    setEditingPlant(plant);
    setModalOpen(true);
  };

  const handleSavePlant = (plantData: Omit<Plant, 'id' | 'formattedDate'>, editingId?: string) => {
    console.log("🎯 Dashboard: handleSavePlant CHAMADO!", plantData, editingId);
    savePlant(plantData, editingId);
    setModalOpen(false);
    setEditingPlant(null);
  };

  const handleCloseModal = () => {
    console.log("🎯 Dashboard: handleCloseModal CHAMADO!");
    setModalOpen(false);
    setEditingPlant(null);
  };

  // ✅ NOVA FUNÇÃO PARA MOSTRAR TODAS AS PLANTAS
  const handleShowAllPlants = () => {
    setShowAllPlants(true);
  };

  // ✅ NOVA FUNÇÃO PARA FECHAR TODAS AS PLANTAS
  const handleCloseAllPlants = () => {
    setShowAllPlants(false);
  };

  // Calcular progresso do nível
  const calculateLevelProgress = () => {
    const currentLevel = LEVELS.find(l => l.level === userLevel);
    const nextLevel = LEVELS.find(l => l.level === userLevel + 1);
    
    if (!currentLevel || !nextLevel) return 100;
    
    const xpForNextLevel = nextLevel.xpRequired - currentLevel.xpRequired;
    const xpProgress = userXP - currentLevel.xpRequired;
    const percentage = (xpProgress / xpForNextLevel) * 100;
    
    return Math.min(100, Math.max(0, percentage));
  };

  const levelProgress = calculateLevelProgress();
  const nextLevel = LEVELS.find(l => l.level === userLevel + 1);
  const xpNeeded = nextLevel ? nextLevel.xpRequired - userXP : 0;

  // ✅ LOADING STATE - MOSTRAR LOADING ENQUANTO OS DADOS NÃO CARREGARAM
  if (loading || !hasLoaded) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Navbar />
        
        {/* Loading State */}
        <section className="bg-gradient-to-r from-green-500 to-green-600 text-white p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6 text-center md:text-left">
              <h2 className="text-3xl font-bold mb-2 drop-shadow-md">
                Carregando sua horta...
              </h2>
              <p className="text-green-100 text-lg">Aguarde um momento 🌱</p>
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto p-6">
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 text-center">
            <div className="animate-pulse">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
              </div>
            </div>
            <p className="text-gray-600 mt-4">Carregando seus dados do Firestore...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navbar />
      
      {/* Welcome Banner */}
      <section className="bg-gradient-to-r from-green-500 to-green-600 text-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 text-center md:text-left">
            <h2 className="text-3xl font-bold mb-2 drop-shadow-md">
              Seja bem-vindo, {user?.displayName || user?.email?.split('@')[0] || 'Usuário'}!
            </h2>
            <p className="text-green-100 text-lg">Veja como está sua horta hoje 🌱</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Plantas Ativas */}
            <div className="rounded-2xl p-5 backdrop-blur-md bg-white/10 hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-2xl">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-bold">{plants.length}</div>
                  <div className="text-green-100 text-sm">Plantas ativas</div>
                </div>
              </div>
            </div>

            {/* Tarefas Hoje */}
            <div className="rounded-2xl p-5 backdrop-blur-md bg-white/10 hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-2xl">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-green-100 text-sm">Tarefas hoje</div>
                </div>
              </div>
            </div>

            {/* Nível */}
            <div className="rounded-2xl p-5 backdrop-blur-md bg-white/10 hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-2xl">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-bold">Nv. {userLevel}</div>
                  <div className="text-green-100 text-sm">Nível</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid - Layout 2 colunas */}
      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Coluna da Esquerda */}
        <div className="space-y-6">
          
          {/* Ferramentas Agrícolas */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-3 flex items-center">
                <div className="bg-green-100 p-3 rounded-xl mr-4">
                  <svg className="w-7 h-7 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 8a2 2 0 114 0 2 2 0 01-4 0zm2 6a6 6 0 010-12 6 6 0 010 12z"/>
                  </svg>
                </div>
                Ferramentas Agrícolas
              </h2>
              <p className="text-gray-600 text-lg">Tudo o que você precisa para planejar sua plantação</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Calendário */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 cursor-pointer border border-green-200 hover:border-green-300 group">
                <div className="bg-green-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-md group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="font-bold text-gray-800 mb-3 text-xl">Calendário</h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">Épocas ideais de plantio para cada cultura</p>
                <div className="bg-green-500/10 rounded-lg py-2 px-3 inline-flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-green-600 font-semibold text-sm">Plantio sazonal</span>
                </div>
              </div>

              {/* Clima */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 cursor-pointer border border-blue-200 hover:border-blue-300 group">
                <div className="bg-blue-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-md group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a1 1 0 000 2c5.523 0 10 4.477 10 10a1 1 0 102 0C17 8.373 11.627 3 5 3z"/>
                    <path d="M5 7a1 1 0 000 2 5 5 0 015 5 1 1 0 102 0 7 7 0 00-7-7z"/>
                    <path d="M5 11a1 1 0 100 2 1 1 0 000-2z"/>
                  </svg>
                </div>
                <h3 className="font-bold text-gray-800 mb-3 text-xl">Clima</h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">Previsão do tempo para sua região</p>
                <div className="flex justify-center">
                  <div className="bg-blue-500/10 rounded-lg py-2 px-3 inline-flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-blue-600 font-semibold text-sm">Atualizado</span>
                  </div>
                </div>
              </div>

              {/* Calculadora */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 cursor-pointer border border-orange-200 hover:border-orange-300 group">
                <div className="bg-orange-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-md group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 00-1 1v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1v-1a1 1 0 00-1-1zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 1a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm4-4a1 1 0 100 2h.01a1 1 0 100-2H13z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="font-bold text-gray-800 mb-3 text-xl">Calculadora</h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">Necessidades de irrigação e nutrientes</p>
                <div className="bg-orange-500/10 rounded-lg py-2 px-3 inline-flex items-center justify-center">
                  <svg className="w-4 h-4 text-orange-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-orange-600 font-semibold text-sm">Cálculo preciso</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("/ferramentas")}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Acessar Todas as Ferramentas
            </button>
          </div>

          {/* Conquistas */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <div className="bg-green-100 p-2 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                </div>
                Conquistas
              </h3>
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
                </svg>
              </button>
            </div>

            <div className="flex items-center space-x-6 mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-700">{userLevel}</div>
                    <div className="text-xs text-gray-500">Nível</div>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <h5 className="font-semibold text-gray-800">Nível {userLevel} - {LEVELS.find(l => l.level === userLevel)?.title}</h5>
                <p className="text-gray-600 text-sm mb-2">
                  {nextLevel ? `${xpNeeded} XP para o próximo nível` : "Nível máximo alcançado!"}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${levelProgress}%` }}
                  ></div>
                </div>
                <p className="text-gray-500 text-xs mt-1">
                  {userXP} XP / {nextLevel?.xpRequired || 'Max'} XP
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className={`flex items-center space-x-4 p-3 rounded-lg border ${
                plants.length >= 1 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  plants.length >= 1 ? 'bg-green-100 text-green-500' : 'bg-gray-100 text-gray-400'
                }`}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <h6 className="font-semibold text-gray-800">Primeiros Passos</h6>
                  <span className="text-gray-600 text-sm">
                    {plants.length >= 1 ? '✅ Concluída' : 'Plante sua primeira muda'}
                  </span>
                </div>
              </div>

              <div className={`flex items-center space-x-4 p-3 rounded-lg border ${
                plants.length >= 5 ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  plants.length >= 5 ? 'bg-blue-100 text-blue-500' : 'bg-gray-100 text-gray-400'
                }`}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <h6 className="font-semibold text-gray-800">Horta em Expansão</h6>
                  <span className="text-gray-600 text-sm">
                    {plants.length >= 5 ? '✅ Concluída' : `Plante 5 plantas (${plants.length}/5)`}
                  </span>
                </div>
              </div>

              <div className={`flex items-center space-x-4 p-3 rounded-lg border ${
                userLevel >= 3 ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  userLevel >= 3 ? 'bg-orange-100 text-orange-500' : 'bg-gray-100 text-gray-400'
                }`}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <h6 className="font-semibold text-gray-800">Jardinheiro Experiente</h6>
                  <span className="text-gray-600 text-sm">
                    {userLevel >= 3 ? '✅ Concluída' : `Alcance o nível 3 (${userLevel}/3)`}
                  </span>
                </div>
              </div>

              <div className={`flex items-center space-x-4 p-3 rounded-lg border ${
                totalSavings >= 100 ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  totalSavings >= 100 ? 'bg-purple-100 text-purple-500' : 'bg-gray-100 text-gray-400'
                }`}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <h6 className="font-semibold text-gray-800">Economia Verde</h6>
                  <span className="text-gray-600 text-sm">
                    {totalSavings >= 100 ? '✅ Concluída' : `Economize R$ 100 (R$ ${totalSavings}/100)`}
                  </span>
                </div>
              </div>
            </div>

           <button 
  onClick={() => navigate("/Profile")}
  className="w-full border border-green-500 text-green-500 hover:bg-green-50 py-3 rounded-lg font-semibold transition flex items-center justify-center"
>
  Ver todas as conquistas 
  <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
  </svg>
</button>
          </div>
        </div>

        {/* Coluna da Direita - Minhas Plantas */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <div className="bg-green-100 p-2 rounded-lg mr-3">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd"/>
                </svg>
              </div>
              Minhas plantas
            </h3>
            <button className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
              </svg>
            </button>
          </div>

          <div className="mb-4">
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition">
              Suas plantas
            </button>
          </div>

          {/* Mostrar apenas as 3 primeiras plantas */}
          <PlantsList
            plants={plants.slice(0, 3)}
            onEditPlant={handleEditPlant}
            onRemovePlant={removePlant}
          />

          {/* Botão Ver Todas as Plantas - aparece apenas se tiver mais de 3 plantas */}
          {plants.length > 3 && (
            <button 
              onClick={handleShowAllPlants}
              className="w-full border border-green-500 text-green-500 hover:bg-green-50 py-3 rounded-lg font-semibold transition flex items-center justify-center mt-4"
            >
              Ver Todas as Plantas
              <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </button>
          )}

          {/* Contador de plantas */}
          <div className="mt-3 text-center text-sm text-gray-500">
            {plants.length > 3 ? (
              <span>Mostrando 3 de {plants.length} plantas</span>
            ) : (
              <span>{plants.length} planta{plants.length !== 1 ? 's' : ''} no total</span>
            )}
          </div>

          <button 
            onClick={handleAddPlant}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition flex items-center justify-center mt-4"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"/>
            </svg>
            Adicionar Planta
          </button>
        </div>
      </div>

      {/* Modal para mostrar todas as plantas */}
      {showAllPlants && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Header do Modal */}
            <div className="bg-green-500 text-white p-6 flex justify-between items-center">
              <h3 className="text-2xl font-bold flex items-center">
                <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd"/>
                </svg>
                Todas as Minhas Plantas ({plants.length})
              </h3>
              <button 
                onClick={handleCloseAllPlants}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
              <PlantsList
                plants={plants}
                onEditPlant={(plant) => {
                  handleEditPlant(plant);
                  handleCloseAllPlants();
                }}
                onRemovePlant={removePlant}
              />
            </div>

            {/* Footer do Modal */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">
                  Total de {plants.length} planta{plants.length !== 1 ? 's' : ''}
                </span>
                <button 
                  onClick={handleCloseAllPlants}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <PlantModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSavePlant}
        editingPlant={editingPlant}
      />
    </div>
  );
};