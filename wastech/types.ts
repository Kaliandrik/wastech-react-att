// Definições de tipos em um arquivo único
export interface Plant {
  id: string;
  name: string;
  type: string;
  plantingDate: string;
  formattedDate: string;
  progress: number;
  notes?: string;
}

export interface UserData {
  nome: string;
  plants: Plant[];
  totalSavings: number;
  xp: number;
  nivel: number;
}