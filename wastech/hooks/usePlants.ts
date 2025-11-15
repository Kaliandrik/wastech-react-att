// hooks/usePlants.ts
import { useState, useEffect } from 'react';
import { 
  doc, 
  getDoc, 
  updateDoc,
  setDoc,
  arrayUnion,
  arrayRemove 
} from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import type { Plant } from '../types';

// ✅ SISTEMA DE NÍVEIS DO CÓDIGO ANTIGO
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

const SAVINGS_PER_PLANT = 25;

export const usePlants = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [totalSavings, setTotalSavings] = useState(0);
  const [userXP, setUserXP] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isSavingPlant, setIsSavingPlant] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  // =================== CRIAR USUÁRIO NO FIRESTORE ===================
  const createUserDocument = async (user: any) => {
    try {
      const userRef = doc(db, "usuarios", user.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        console.log("👤 Criando documento do usuário no Firestore...");
        await setDoc(userRef, {
          nome: user.displayName || "Usuário",
          email: user.email,
          plants: [],
          totalSavings: 0,
          xp: 0,
          nivel: 1,
          createdAt: new Date()
        });
        console.log("✅ Documento do usuário criado!");
        return { plants: [], totalSavings: 0, xp: 0, nivel: 1 };
      } else {
        console.log("✅ Documento do usuário já existe!");
        return userDoc.data();
      }
    } catch (error) {
      console.error("❌ Erro ao criar documento do usuário:", error);
      return { plants: [], totalSavings: 0, xp: 0, nivel: 1 };
    }
  };

  // =================== FUNÇÕES DE NÍVEL & XP CORRIGIDAS ===================
  const calculateLevel = (xp: number): number => {
    console.log(`🔢 Calculando nível para ${xp} XP`);
    
    let calculatedLevel = 1;
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (xp >= LEVELS[i].xpRequired) {
        calculatedLevel = LEVELS[i].level;
        console.log(`✅ XP ${xp} >= ${LEVELS[i].xpRequired} -> Nível ${calculatedLevel}`);
        break;
      }
    }
    
    console.log(`🎯 Nível calculado: ${calculatedLevel}`);
    return calculatedLevel;
  };

  const checkLevelUp = (oldLevel: number, newXP: number) => {
    const newLevel = calculateLevel(newXP);
    console.log(`🔄 Verificando level up: ${oldLevel} -> ${newLevel}`);
    
    if (newLevel > oldLevel) {
      setUserLevel(newLevel);
      console.log(`🎉 Level Up! Agora você é Nível ${newLevel}`);
      return newLevel;
    }
    return oldLevel;
  };

  const addXP = async (amount: number, reason: string) => {
    console.log(`➕ Adicionando ${amount} XP...`);
    const oldLevel = userLevel;
    const newXP = userXP + amount;
    
    console.log(`📊 XP atual: ${userXP} -> Novo XP: ${newXP}`);
    
    setUserXP(newXP);
    const updatedLevel = checkLevelUp(oldLevel, newXP);

    const user = auth.currentUser;
    if (user) {
      try {
        await updateDoc(doc(db, "usuarios", user.uid), {
          xp: newXP,
          nivel: updatedLevel
        });
        console.log(`✅ ${amount} XP adicionados no Firestore! Nível: ${updatedLevel}`);
      } catch (error) {
        console.error("❌ Erro ao atualizar XP:", error);
      }
    }

    console.log(`+${amount} XP (${reason})`);
  };

  // =================== SISTEMA DE PLANTAS COMPLETO ===================
  const loadPlants = async () => {
    console.log("📥 ========== CARREGANDO PLANTAS ==========");
    setLoading(true);
    setHasLoaded(false);
    
    try {
      const user = auth.currentUser;
      console.log("👤 Usuário no loadPlants:", user?.email, "UID:", user?.uid);
      
      if (!user) {
        console.log("❌ Nenhum usuário logado no loadPlants");
        setPlants([]);
        setTotalSavings(0);
        setUserXP(0);
        setUserLevel(1);
        setHasLoaded(true);
        return;
      }

      console.log("🔍 Buscando documento do usuário:", user.uid);
      const userRef = doc(db, "usuarios", user.uid);
      const userDoc = await getDoc(userRef);
      
      console.log("📄 Documento do usuário existe?", userDoc.exists());
      
      let userData;
      
      if (userDoc.exists()) {
        userData = userDoc.data();
        console.log("📊 Dados COMPLETOS do usuário:", userData);
        
        // ✅ CORREÇÃO: CALCULAR O NÍVEL CORRETO BASEADO NO XP DO FIRESTORE
        const firestoreXP = userData?.xp || 0;
        const firestoreLevel = calculateLevel(firestoreXP);
        
        console.log(`🎯 XP do Firestore: ${firestoreXP} -> Nível calculado: ${firestoreLevel}`);
        
        setPlants(userData?.plants || []);
        setTotalSavings(userData?.totalSavings || 0);
        setUserXP(firestoreXP);
        setUserLevel(firestoreLevel); // ✅ USA O NÍVEL CALCULADO, NÃO O DO FIRESTORE
        
        console.log(`✅ ${userData?.plants?.length || 0} plantas carregadas do Firestore!`);
        console.log(`✅ Nível definido como: ${firestoreLevel} (baseado em ${firestoreXP} XP)`);
      } else {
        console.log("📄 Documento do usuário não existe - criando...");
        userData = await createUserDocument(user);
        // ✅ Para novo usuário, nível 1 está correto
        setPlants(userData?.plants || []);
        setTotalSavings(userData?.totalSavings || 0);
        setUserXP(userData?.xp || 0);
        setUserLevel(userData?.nivel || 1);
      }
      
    } catch (error) {
      console.error('❌ Erro ao carregar plantas:', error);
    } finally {
      setLoading(false);
      setHasLoaded(true);
      console.log("✅ usePlants: Carregamento finalizado - hasLoaded: true");
    }
  };

  const savePlant = async (plantData: Omit<Plant, 'id' | 'formattedDate'>, editingId?: string) => {
    console.log("🔄 ========== INICIANDO savePlant ==========");
    console.log("📦 Dados da planta:", plantData);
    console.log("✏️ Editing ID:", editingId);
    
    if (isSavingPlant) {
      console.log("❌ Já está salvando outra planta...");
      return;
    }
    
    setIsSavingPlant(true);

    try {
      const user = auth.currentUser;
      console.log("👤 Usuário atual:", user?.email, "UID:", user?.uid);
      
      if (!user) {
        console.log("❌ Nenhum usuário logado!");
        setIsSavingPlant(false);
        return;
      }

      const formattedDate = new Date(plantData.plantingDate).toLocaleDateString('pt-BR');
      const plant: Plant = {
        ...plantData,
        id: editingId || Date.now().toString(),
        formattedDate
      };

      console.log("🌱 Planta formatada para salvar:", plant);

      const userRef = doc(db, "usuarios", user.uid);
      console.log("📝 Referência do Firestore:", userRef.path);

      // ✅ VERIFICA SE O DOCUMENTO EXISTE ANTES
      console.log("🔍 Verificando se documento existe...");
      const userDocBefore = await getDoc(userRef);
      console.log("📄 Documento existe?", userDocBefore.exists());
      
      let currentData;
      if (userDocBefore.exists()) {
        currentData = userDocBefore.data();
        console.log("📊 Dados atuais no Firestore:", currentData);
        console.log("🌱 Plantas atuais no Firestore:", currentData.plants);
        console.log("💰 Total Savings atual:", currentData.totalSavings);
      } else {
        console.log("❌ Documento não existe - criando...");
        currentData = await createUserDocument(user);
      }

      if (editingId) {
        console.log("✏️ Modo EDIÇÃO - ID:", editingId);
        const plantIndex = plants.findIndex(p => p.id === editingId);
        if (plantIndex !== -1) {
          const updatedPlant = {
            ...plants[plantIndex],
            ...plantData,
            formattedDate
          };

          console.log("🔄 Atualizando planta existente:", updatedPlant);
          
          await updateDoc(userRef, {
            plants: arrayRemove(plants[plantIndex])
          });
          
          await updateDoc(userRef, {
            plants: arrayUnion(updatedPlant)
          });

          setPlants(prev => prev.map(p => p.id === editingId ? updatedPlant : p));
          console.log("✅ Planta atualizada com sucesso!");
        }
      } else {
        console.log("➕ Modo NOVA PLANTA");
        console.log("💰 Total Savings atual (estado):", totalSavings);
        console.log("💰 Novo Total Savings:", totalSavings + SAVINGS_PER_PLANT);
        
        // ✅ SALVA NO FIRESTORE
        console.log("💾 Salvando no Firestore...");
        await updateDoc(userRef, {
          plants: arrayUnion(plant),
          totalSavings: totalSavings + SAVINGS_PER_PLANT
        });

        console.log("✅ Dados salvos no Firestore!");
        
        // ✅ ATUALIZA ESTADO LOCAL
        console.log("🔄 Atualizando estado local...");
        setPlants(prev => {
          const newPlants = [...prev, plant];
          console.log("🌱 Novas plantas no estado:", newPlants);
          return newPlants;
        });
        
        setTotalSavings(prev => {
          const newSavings = prev + SAVINGS_PER_PLANT;
          console.log("💰 Novo total savings no estado:", newSavings);
          return newSavings;
        });
        
        // ✅ ADICIONA XP
        console.log("⭐ Adicionando XP...");
        await addXP(60, "Plantou uma nova planta");
        console.log("🌱 Planta adicionada com sucesso! +60 XP");

        // ✅ VERIFICA SE REALMENTE SALVOU
        console.log("🔍 Verificando se salvou no Firestore...");
        const userDocAfter = await getDoc(userRef);
        if (userDocAfter.exists()) {
          const updatedData = userDocAfter.data();
          console.log("📊 Dados após salvar:", updatedData);
          console.log("🌱 Plantas após salvar:", updatedData.plants);
          console.log("💰 Total Savings após salvar:", updatedData.totalSavings);
          console.log("✅ CONFIRMADO: Planta salva no Firestore!");
        } else {
          console.log("❌ ERRO: Documento não existe após salvar!");
        }
      }

    } catch (error) {
      console.error('❌ ERRO ao salvar planta:', error);
      if (error instanceof Error) {
        console.error('❌ Detalhes do erro:', error.message);
      }
    } finally {
      setIsSavingPlant(false);
      console.log("🎯 ========== FIM savePlant ==========");
    }
  };

  const removePlant = async (id: string) => {
    console.log("🗑️ Removendo planta:", id);
    
    if (isSavingPlant) return;
    setIsSavingPlant(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        setIsSavingPlant(false);
        return;
      }

      const plantToRemove = plants.find(p => p.id === id);
      if (!plantToRemove) {
        setIsSavingPlant(false);
        return;
      }

      const userRef = doc(db, "usuarios", user.uid);
      await updateDoc(userRef, {
        plants: arrayRemove(plantToRemove),
        totalSavings: totalSavings - SAVINGS_PER_PLANT
      });

      setPlants(prev => prev.filter(p => p.id !== id));
      setTotalSavings(prev => prev - SAVINGS_PER_PLANT);
      console.log("✅ Planta removida!");

    } catch (error) {
      console.error('❌ Erro ao remover planta:', error);
    } finally {
      setIsSavingPlant(false);
    }
  };

  // =================== CARREGAR DADOS QUANDO USUÁRIO MUDAR ===================
  useEffect(() => {
    console.log("🎯 usePlants: Iniciando listener de autenticação...");
    
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log("🔥 usePlants: onAuthStateChanged", user?.email, user?.uid);
      if (user) {
        console.log("✅ Usuário autenticado, carregando plantas...");
        loadPlants();
      } else {
        console.log("❌ Usuário não autenticado, limpando dados...");
        setPlants([]);
        setTotalSavings(0);
        setUserXP(0);
        setUserLevel(1);
        setHasLoaded(true);
        setLoading(false);
      }
    });

    return () => {
      console.log("🧹 usePlants: Limpando listener de autenticação");
      unsubscribe();
    };
  }, []);

  // =================== RETORNAR TUDO ===================
  return {
    plants,
    totalSavings,
    userXP,
    userLevel,
    loading,
    hasLoaded,
    isSavingPlant,
    savePlant,
    removePlant,
    loadPlants,
    addXP
  };
};