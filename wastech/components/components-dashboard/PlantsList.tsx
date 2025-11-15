import React from 'react';

interface Plant {
  id: string;
  name: string;
  type: string;
  plantingDate: string;
  formattedDate: string;
  progress: number;
  notes?: string;
}

interface PlantsListProps {
  plants: Plant[];
  onEditPlant: (plant: Plant) => void;
  onRemovePlant: (id: string) => void;
}

export const PlantsList: React.FC<PlantsListProps> = ({
  plants,
  onEditPlant,
  onRemovePlant
}) => {
  if (plants.length === 0) {
    return (
      <div className="text-center py-8">
        <i className="fas fa-seedling text-4xl text-gray-300 mb-4"></i>
        <p className="text-gray-500 font-semibold">Você ainda não tem plantas cadastradas</p>
        <p className="text-gray-400 text-sm">Adicione sua primeira planta para começar a economizar!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {plants.map((plant) => (
        <div key={plant.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          {/* Header */}
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-semibold text-gray-800 text-lg">{plant.name}</h4>
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
              {plant.type}
            </span>
          </div>

          {/* Body */}
          <div className="space-y-3">
            <p className="flex items-center text-gray-600 text-sm">
              <i className="fas fa-calendar mr-2 text-green-500"></i>
              Plantado em: {plant.formattedDate}
            </p>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progresso: {plant.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${plant.progress}%` }}
                ></div>
              </div>
            </div>

            {plant.notes && (
              <p className="text-gray-600 text-sm flex items-start">
                <i className="fas fa-sticky-note mr-2 text-yellow-500 mt-0.5"></i>
                {plant.notes}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex space-x-2 mt-4">
            <button 
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded text-sm font-medium transition flex items-center justify-center"
              onClick={() => onEditPlant(plant)}
            >
              <i className="fas fa-edit mr-1"></i>
              Editar
            </button>
            <button 
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded text-sm font-medium transition flex items-center justify-center"
              onClick={() => onRemovePlant(plant.id)}
            >
              <i className="fas fa-trash mr-1"></i>
              Remover
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};