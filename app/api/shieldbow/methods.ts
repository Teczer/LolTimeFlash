export async function getChampion() {
  const url = '/api/shieldbow'
  const res = await fetch(url)
  const champion = await res.json()

  return champion
}
