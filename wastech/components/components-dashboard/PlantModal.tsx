import React, { useState, useEffect } from 'react';
import { GeminiAIService } from '../../api/geminiAI';
import type { PlantAnalysis } from '../../api/geminiAI';
interface Plant {
  id: string;
  name: string;
  type: string;
  plantingDate: string;
  formattedDate: string;
  progress: number;
  notes?: string;
}

interface PlantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (plant: Omit<Plant, 'id' | 'formattedDate'>, editingId?: string) => void;
  editingPlant?: Plant | null;
}

export const PlantModal: React.FC<PlantModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingPlant
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [date, setDate] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<PlantAnalysis | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const plantTypes = [
    { value: 'Hortaliça', label: '🥬 Hortaliça' },
    { value: 'Fruta', label: '🍓 Fruta' },
    { value: 'Erva Aromática', label: '🌿 Erva Aromática' },
    { value: 'Legume', label: '🥕 Legume' },
    { value: 'Flor', label: '🌺 Flor' },
    { value: 'Outro', label: '🌱 Outro' }
  ];

  useEffect(() => {
    if (editingPlant) {
      setName(editingPlant.name);
      setType(editingPlant.type);
      setDate(editingPlant.plantingDate);
      setAnalysis(null);
      setShowAnalysis(false);
      setAnalysisError(null);
    } else {
      resetForm();
    }
  }, [editingPlant, isOpen]);

  const resetForm = () => {
    setName('');
    setType('');
    setDate(new Date().toISOString().split('T')[0]);
    setAnalysis(null);
    setShowAnalysis(false);
    setAnalysisError(null);
  };

  const handleAnalyzePlant = async () => {
    if (!name || !type || !date) {
      alert('Por favor, preencha nome, tipo e data para análise!');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);
    setShowAnalysis(false);
    
    try {
      console.log('🔄 Iniciando análise com Gemini...');
      const plantAnalysis = await GeminiAIService.analyzePlant(name, type, date);
      setAnalysis(plantAnalysis);
      setShowAnalysis(true);
      console.log('✅ Análise concluída com sucesso!');
    } catch (error) {
      console.error('❌ Erro na análise:', error);
      setAnalysisError('Erro ao consultar a IA. Usando análise local.');
      // Força o fallback
      const plantAnalysis = await GeminiAIService.analyzePlant(name, type, date);
      setAnalysis(plantAnalysis);
      setShowAnalysis(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = () => {
    if (!name || !type || !date) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    const plantData = {
      name,
      type,
      plantingDate: date,
      progress: 0,
      notes: analysis ? 
        `🤖 IA: Colheita em ${analysis.harvestTime}. ${analysis.careTips.slice(0, 2).join(' ')}` : 
        'Planta adicionada - análise pendente'
    };

    onSave(plantData, editingPlant?.id);
    onClose();
    resetForm();
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold flex items-center">
              <span className="text-3xl mr-3">🤖</span>
              {editingPlant ? 'Editar Planta' : 'Nova Planta - Análise com IA'}
            </h3>
            <button 
              onClick={handleClose}
              className="text-white hover:text-green-100 text-3xl transition-colors"
            >
              &times;
            </button>
          </div>
          <p className="text-green-100 mt-2">
            Google Gemini vai analisar sua planta e dar dicas específicas para o cultivo!
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Formulário Básico */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🌿 Nome da Planta *
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="Ex: Tomate Cereja, Alface Crespa, Manjericão..."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Digite o nome específico da planta</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🏷️ Tipo de Planta *
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="">Selecione o tipo...</option>
                {plantTypes.map(plantType => (
                  <option key={plantType.value} value={plantType.value}>
                    {plantType.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Escolha a categoria da planta</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📅 Data de Plantio *
            </label>
            <input
              type="date"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">Quando você plantou ou vai plantar</p>
          </div>

          {/* Botão de Análise */}
          <div className="flex space-x-4">
            <button
              onClick={handleAnalyzePlant}
              disabled={isAnalyzing || !name || !type || !date}
              className="flex-1 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white py-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
            >
              {isAnalyzing ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Consultando Google Gemini AI...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <span className="text-xl mr-2">🤖</span>
                  CONSULTAR IA - PREVISÃO DE COLHEITA
                </span>
              )}
            </button>
          </div>

          {/* Mensagem de Erro */}
          {analysisError && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-center">
                <span className="text-yellow-500 text-xl mr-2">⚠️</span>
                <p className="text-yellow-800">{analysisError}</p>
              </div>
            </div>
          )}

          {/* Resultado da Análise */}
          {showAnalysis && analysis && (
            <div className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 rounded-2xl p-6 space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <h4 className="text-xl font-bold text-gray-800 flex items-center">
                  <span className="text-2xl mr-2">📊</span>
                  Análise da IA - {name}
                </h4>
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  ✅ Análise Concluída
                </span>
              </div>

              {/* Tempo de Colheita - Destaque */}
              <div className="bg-white rounded-xl p-5 border-2 border-green-300 shadow-lg">
                <div className="text-center">
                  <div className="text-3xl mb-2">⏰</div>
                  <h5 className="font-semibold text-green-700 mb-1">Tempo até Colheita</h5>
                  <p className="text-3xl font-bold text-green-600">{analysis.harvestTime}</p>
                  <p className="text-sm text-gray-600 mt-1">Estimativa baseada nas condições ideais</p>
                </div>
              </div>

              {/* Estágios de Crescimento */}
              <div>
                <h5 className="font-semibold text-gray-700 mb-4 flex items-center">
                  <span className="text-xl mr-2">🌱</span>
                  Estágios de Crescimento
                </h5>
                <div className="space-y-4">
                  {analysis.growthStages.map((stage, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 border border-green-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <span className="font-semibold text-gray-800 text-lg">{stage.stage}</span>
                          <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            {stage.duration}
                          </span>
                        </div>
                        <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                      </div>
                      <div className="space-y-2">
                        {stage.tips.map((tip, tipIndex) => (
                          <div key={tipIndex} className="flex items-start">
                            <span className="text-green-500 mr-2 mt-1">•</span>
                            <p className="text-sm text-gray-700 flex-1">{tip}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dicas de Cuidado */}
              <div>
                <h5 className="font-semibold text-gray-700 mb-4 flex items-center">
                  <span className="text-xl mr-2">💡</span>
                  Dicas Essenciais de Cuidado
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {analysis.careTips.map((tip, index) => (
                    <div key={index} className="bg-white rounded-lg p-3 border border-blue-100 hover:border-blue-200 transition-colors">
                      <p className="text-sm text-gray-700">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Problemas Comuns */}
              <div>
                <h5 className="font-semibold text-gray-700 mb-3 flex items-center">
                  <span className="text-xl mr-2">⚠️</span>
                  Problemas Comuns e Soluções
                </h5>
                <div className="space-y-2">
                  {analysis.commonIssues.map((issue, index) => (
                    <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-800 flex items-start">
                        <span className="text-red-500 mr-2 mt-0.5">•</span>
                        {issue}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Estimativa de Produção */}
              <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4">
                <h5 className="font-semibold text-yellow-700 mb-2 flex items-center">
                  <span className="text-xl mr-2">📈</span>
                  Estimativa de Produção
                </h5>
                <p className="text-yellow-800 font-medium">{analysis.estimatedYield}</p>
              </div>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="flex space-x-4 pt-6 border-t border-gray-200">
            <button 
              onClick={handleClose}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-4 px-6 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              ❌ Cancelar
            </button>
            <button 
              onClick={handleSubmit}
              disabled={!name || !type || !date}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {editingPlant ? (
                <span className="flex items-center justify-center">
                  💾 Salvar Alterações
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  🌱 Adicionar Planta
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};