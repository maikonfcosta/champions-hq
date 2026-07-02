const BASE_URL = 'https://marvelcdb.com/api/public';

/**
 * Fetches all official packs/expansions.
 */
export async function getPacks() {
  const response = await fetch(`${BASE_URL}/packs/`);
  if (!response.ok) throw new Error('Failed to fetch packs');
  return response.json();
}

/**
 * Fetches all cards. Warning: This can be a large response.
 */
export async function getCards() {
  const response = await fetch(`${BASE_URL}/cards/`);
  if (!response.ok) throw new Error('Failed to fetch cards');
  return response.json();
}

/**
 * Fetches popular decklists.
 */
export async function getPopularDecks() {
  const response = await fetch(`${BASE_URL}/decklists/popular/`);
  if (!response.ok) throw new Error('Failed to fetch popular decks');
  return response.json();
}

/**
 * Fetches a specific deck by ID.
 */
export async function getDeck(deckId) {
  const response = await fetch(`${BASE_URL}/deck/${deckId}`);
  if (!response.ok) throw new Error('Failed to fetch deck');
  return response.json();
}

/**
 * Fetches FAQ/Rules for a specific card code.
 */
export async function getCardFaq(cardCode) {
  const response = await fetch(`${BASE_URL}/faq/${cardCode}`);
  if (!response.ok) throw new Error('Failed to fetch card FAQ');
  return response.json();
}
