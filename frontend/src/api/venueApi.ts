export async function getVenues() {
    const res = await fetch('/api/venues');
    if (!res.ok) throw new Error('API error');
    return await res.json();
}
