import { db } from './firebase';
import { collection, query, where, getDocs, doc, setDoc, orderBy, limit } from 'firebase/firestore';

// Função para buscar o desafio ativo global
export async function getActiveChallenge() {
  try {
    const q = query(collection(db, 'challenges'), where('isActive', '==', true), limit(1));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return { id: snap.docs[0].id, ...snap.docs[0].data() };
    }
  } catch (error) {
    console.error("Erro ao buscar desafio ativo no Firebase", error);
  }
  
  // MOCK de fallback para quando não houver internet ou banco não configurado
  return {
    id: "marvel_weekly_01",
    title: "Invasão Silenciosa",
    description: "Derrote o Ultron usando o aspecto Liderança e prove que a Shield ainda respira.",
    isActive: true,
    game: "marvel_champions",
    seedData: {
      villain: "Ultron",
      hero: "Black Widow",
      aspect: "Liderança",
      difficulty: "Expert",
      modulars: ["Under Attack"]
    }
  };
}

// Buscar Leaderboard
export async function getChallengeLeaderboard(challengeId) {
  try {
    const q = query(collection(db, 'leaderboards', challengeId, 'entries'), orderBy('xpGained', 'desc'), limit(50));
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data());
  } catch (error) {
    console.error("Erro ao buscar leaderboard", error);
    return [];
  }
}

// Submeter o resultado
export async function submitChallengeLog(challengeId, user, matchData) {
  if (!user) return;
  try {
    const ref = doc(db, 'leaderboards', challengeId, 'entries', user.uid);
    await setDoc(ref, {
      userId: user.uid,
      userName: user.displayName || 'Jogador Anônimo',
      photoURL: user.photoURL || null,
      date: new Date().toISOString(),
      ...matchData
    }, { merge: true });
  } catch (error) {
    console.error("Erro ao salvar log do desafio", error);
  }
}
