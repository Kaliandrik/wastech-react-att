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

export interface Level {
  level: number;
  xpRequired: number;
  title: string;
}

// ✅ VERIFICA SE TEM ESTA LINHA:
export const LEVELS: Level[] = [
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