// API gratuita di BigDataCloud per ottenere il nome della località dalle coordinate
// Necessaria al primo avvio per ricavare il nome della città dalla posizione iniziale

export async function fetchLocationName(latitude: number, longitude: number): Promise<string | null> {

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);

    try {
        const query = new URLSearchParams({ latitude: String(latitude), longitude: String(longitude), localityLanguage: 'en' });
        const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?${query}`, { signal: controller.signal });

        if (!response.ok) return null;

        const data = await response.json();
        const city = [data.city, data.locality, data.localityName].find(value => typeof value === 'string' && value.trim());

        if (!city) return null;

        const country = typeof data.countryName === 'string' ? data.countryName.trim() : '';

        return [city.trim(), country].filter(Boolean).join(', ');

    } catch {
        
        return null;

    } finally {
        clearTimeout(timer);
    }
}
