import React, { useState, useEffect } from 'react';
import { Header } from '../components/components-dashboard/Header';
import { Navbar } from '../components/components-dashboard/Navbar';
import { useAuth } from '../hooks/useAuth';
import { usePlants } from '../hooks/usePlants';
import { updateProfile } from 'firebase/auth';
import { auth } from '../firebase/config';

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const { plants, userXP, userLevel, totalSavings } = usePlants();
  
  const [userData, setUserData] = useState({
    name: user?.displayName || 'Usuário',
    level: userLevel || 1,
    xp: userXP || 0,
    plants: plants.length || 0,
    waterSaved: totalSavings || 0,
    completedMissions: 8,
    joinDate: 'Nov 2024',
    dailyStreak: 7
  });

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [profilePhoto, setProfilePhoto] = useState(user?.photoURL || '');
  const [loading, setLoading] = useState(false);

  const levels = [
    { level: 1, xpRequired: 0, title: "Iniciante", color: "from-green-400 to-green-500" },
    { level: 2, xpRequired: 100, title: "Aprendiz Verde", color: "from-green-500 to-emerald-500" },
    { level: 3, xpRequired: 300, title: "Jardinheiro", color: "from-emerald-500 to-teal-500" },
    { level: 4, xpRequired: 600, title: "Cultivador", color: "from-teal-500 to-cyan-500" },
    { level: 5, xpRequired: 1000, title: "Agricultor", color: "from-cyan-500 to-blue-500" },
    { level: 6, xpRequired: 1500, title: "Mestre Verde", color: "from-blue-500 to-indigo-500" },
    { level: 7, xpRequired: 2100, title: "Especialista", color: "from-indigo-500 to-purple-500" },
    { level: 8, xpRequired: 2800, title: "Mestre Jardineiro", color: "from-purple-500 to-pink-500" },
    { level: 9, xpRequired: 3600, title: "Lenda Verde", color: "from-pink-500 to-red-500" },
    { level: 10, xpRequired: 4500, title: "Mestre Supremo", color: "from-red-500 to-yellow-500" }
  ];

  const achievements = [
    { id: 1, name: "Primeiros Passos", icon: "🌱", unlocked: plants.length >= 1, description: "Primeira planta cultivada", xp: 25 },
    { id: 2, name: "Horta em Expansão", icon: "🌿", unlocked: plants.length >= 5, description: "5 plantas cultivadas", xp: 50 },
    { id: 3, name: "Economia Verde", icon: "💰", unlocked: totalSavings >= 100, description: "Economizou R$ 100", xp: 75 },
    { id: 4, name: "Jardinheiro Experiente", icon: "👨‍🌾", unlocked: userLevel >= 3, description: "Nível 3 alcançado", xp: 100 },
    { id: 5, name: "Mestre da Agricultura", icon: "🏆", unlocked: userLevel >= 5, description: "Nível 5 alcançado", xp: 150 },
    { id: 6, name: "Lenda Verde", icon: "🦸", unlocked: userLevel >= 8, description: "Nível 8 alcançado", xp: 200 }
  ];

  const missions = [
    { id: 1, name: "Complete 5 regas esta semana", progress: 3, total: 5, xp: 10, icon: "💦" },
    { id: 2, name: "Economize 10L de água", progress: Math.min(10, Math.floor(totalSavings)), total: 10, xp: 15, icon: "💧" },
    { id: 3, name: "Adicione 2 novas plantas", progress: Math.min(2, plants.length), total: 2, xp: 20, icon: "🌿" }
  ];

  const ranking = [
    { position: 1, name: user?.displayName || "Você", points: userXP, avatar: "👑", level: userLevel },
    { position: 2, name: "Ana Oliveira", points: 1280, avatar: "👩", level: 8 },
    { position: 3, name: "Lucas Mendes", points: 1165, avatar: "👨", level: 7 },
    { position: 4, name: "Mariana Costa", points: 1090, avatar: "👩", level: 7 },
    { position: 5, name: "Carlos Lima", points: 975, avatar: "👨", level: 6 }
  ];

  useEffect(() => {
    setUserData({
      name: user?.displayName || 'Usuário',
      level: userLevel || 1,
      xp: userXP || 0,
      plants: plants.length || 0,
      waterSaved: totalSavings || 0,
      completedMissions: 8,
      joinDate: 'Nov 2024',
      dailyStreak: 7
    });
  }, [user, userLevel, userXP, plants.length, totalSavings]);

  const currentLevel = levels.find(l => l.level === userData.level) || levels[0];
  const nextLevel = levels.find(l => l.level === userData.level + 1);
  const progressPercentage = nextLevel 
    ? Math.min(100, ((userData.xp - currentLevel.xpRequired) / (nextLevel.xpRequired - currentLevel.xpRequired)) * 100)
    : 100;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePhoto(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) {
      console.error('❌ Usuário não está autenticado');
      return;
    }

    setLoading(true);

    try {
      if (userData.name.trim() !== user.displayName) {
        await updateProfile(user, {
          displayName: userData.name.trim(),
          photoURL: profilePhoto || user.photoURL
        });
        console.log('✅ Perfil atualizado no Firebase Auth');
        
        await user.reload();
        console.log('✅ Dados do usuário recarregados');
      }

      setEditModalOpen(false);
      setSelectedFile(null);
      
      console.log('🎉 Perfil atualizado com sucesso!');
      
    } catch (error) {
      console.error('❌ Erro ao atualizar perfil:', error);
      alert('Erro ao atualizar perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Header />
      <Navbar />
      
      {/* Banner Hero do Perfil */}
      <div className={`bg-gradient-to-r ${currentLevel.color} text-white py-12 shadow-lg`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-white/30">
                  {profilePhoto ? (
                    <img src={profilePhoto} alt="Perfil" className="w-20 h-20 rounded-full object-cover" />
                  ) : user?.photoURL ? (
                    <img src={user.photoURL} alt="Perfil" className="w-20 h-20 rounded-full object-cover" />
                  ) : (
                    <span className="text-3xl">👤</span>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-900 rounded-full px-3 py-1 text-xs font-bold shadow-lg">
                  🔥 {userData.dailyStreak} dias
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold">{userData.name}</h1>
                <p className="text-white/90 text-lg">Nível {userData.level} - {currentLevel.title}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                    🌿 {userData.plants} plantas
                  </span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                    💰 R$ {userData.waterSaved} economizados
                  </span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setEditModalOpen(true)}
              className="bg-white text-green-600 px-6 py-3 rounded-xl font-semibold hover:bg-green-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              ✏️ Editar Perfil
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 space-y-6 -mt-6">
        {/* Progresso do Nível */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-green-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-2 rounded-lg mr-3">📈</span>
              Progresso do Nível
            </h2>
            <div className="text-right">
              <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {userData.xp} XP
              </span>
              <p className="text-sm text-gray-500">Total acumulado</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-green-600">Nível {userData.level}</span>
              <span className="text-emerald-600">{nextLevel ? `Nível ${nextLevel.level}` : 'Nível Máximo'}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
              <div 
                className={`bg-gradient-to-r ${currentLevel.color} h-4 rounded-full transition-all duration-1000 shadow-lg`}
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{userData.xp} XP</span>
              <span>{nextLevel ? `${nextLevel.xpRequired} XP para o próximo` : 'Nível máximo alcançado!'}</span>
            </div>
          </div>
        </div>

        {/* Estatísticas em Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100 hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-600 mb-2">🌿 Plantas</h3>
                <p className="text-3xl font-bold text-green-600">{userData.plants}</p>
              </div>
              <div className="text-green-400 text-2xl">🌱</div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Cultivadas com sucesso</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100 hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-600 mb-2">💰 Economia</h3>
                <p className="text-3xl font-bold text-blue-600">R$ {userData.waterSaved}</p>
              </div>
              <div className="text-blue-400 text-2xl">💵</div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Total economizado</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-yellow-100 hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-600 mb-2">🎯 Missões</h3>
                <p className="text-3xl font-bold text-yellow-600">{userData.completedMissions}</p>
              </div>
              <div className="text-yellow-400 text-2xl">⭐</div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Completadas</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100 hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-600 mb-2">🔥 Sequência</h3>
                <p className="text-3xl font-bold text-purple-600">{userData.dailyStreak} dias</p>
              </div>
              <div className="text-purple-400 text-2xl">🔥</div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Ativo consecutivamente</p>
          </div>
        </div>

        {/* Missões Diárias */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-2 rounded-lg mr-3">🎯</span>
            Missões Diárias
          </h2>
          <div className="space-y-4">
            {missions.map(mission => (
              <div key={mission.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-md transition-all">
                <div className="flex items-center space-x-4 flex-1">
                  <span className="text-2xl">{mission.icon}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{mission.name}</p>
                    <div className="flex items-center space-x-3 mt-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(mission.progress / mission.total) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 font-medium">{mission.progress}/{mission.total}</span>
                    </div>
                  </div>
                </div>
                <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  +{mission.xp}XP
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Conquistas */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white p-2 rounded-lg mr-3">🏆</span>
              Conquistas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map(achievement => (
                <div 
                  key={achievement.id}
                  className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
                    achievement.unlocked 
                      ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg' 
                      : 'border-gray-300 bg-gray-50 opacity-60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={`text-2xl ${achievement.unlocked ? 'animate-bounce' : 'grayscale'}`}>
                      {achievement.icon}
                    </span>
                    <div className="flex-1">
                      <p className={`font-bold ${
                        achievement.unlocked ? 'text-green-700' : 'text-gray-500'
                      }`}>
                        {achievement.name}
                      </p>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className={`text-xs font-semibold ${
                          achievement.unlocked ? 'text-green-600' : 'text-gray-400'
                        }`}>
                          +{achievement.xp} XP
                        </span>
                        {achievement.unlocked && (
                          <span className="text-green-500 text-xs">✅ Concluída</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ranking Comunitário */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 rounded-lg mr-3">🥇</span>
              Ranking Comunitário
            </h2>
            <div className="space-y-3">
              {ranking.map((player, index) => (
                <div key={player.position} className={`flex items-center justify-between p-3 rounded-xl transition-all group ${
                  index === 0 ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-200' : 'hover:bg-green-50'
                }`}>
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-bold w-6">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                    </span>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-gradient-to-r from-yellow-400 to-amber-500' : 'bg-gradient-to-r from-green-400 to-emerald-500'
                    }`}>
                      {player.avatar}
                    </div>
                    <div>
                      <span className={`font-semibold group-hover:text-green-600 transition-colors ${
                        index === 0 ? 'text-yellow-700' : 'text-gray-800'
                      }`}>
                        {player.name}
                      </span>
                      <p className="text-xs text-gray-500">Nível {player.level}</p>
                    </div>
                  </div>
                  <span className={`font-bold px-3 py-1 rounded-full ${
                    index === 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-50 text-green-600'
                  }`}>
                    {player.points} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Edição */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform animate-scale-in">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Editar Perfil</h3>
                <button 
                  onClick={() => setEditModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl transition-colors"
                  disabled={loading}
                >
                  &times;
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                    {profilePhoto ? (
                      <img src={profilePhoto} alt="Perfil" className="w-28 h-28 rounded-full object-cover border-4 border-white" />
                    ) : user?.photoURL ? (
                      <img src={user.photoURL} alt="Perfil" className="w-28 h-28 rounded-full object-cover border-4 border-white" />
                    ) : (
                      <span className="text-4xl text-white">👤</span>
                    )}
                  </div>
                  <label className={`bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl cursor-pointer hover:shadow-lg transition-all font-semibold ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}>
                    📷 Alterar Foto
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleFileSelect}
                      disabled={loading}
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    👤 Nome
                  </label>
                  <input 
                    type="text"
                    value={userData.name}
                    onChange={(e) => setUserData({...userData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="Digite seu nome"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="flex space-x-4 mt-8">
                <button 
                  onClick={() => setEditModalOpen(false)}
                  disabled={loading}
                  className={`flex-1 bg-gray-500 text-white py-3 rounded-xl font-semibold transition-all shadow-lg ${
                    loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600'
                  }`}
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className={`flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-semibold transition-all transform ${
                    loading 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:shadow-xl hover:scale-105'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Salvando...
                    </div>
                  ) : (
                    '💾 Salvar'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};