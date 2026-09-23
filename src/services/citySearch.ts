// admin1 = regione
export type City = {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    country?: string;
    admin1?: string;
};

export function cityLabel(city: City) {
    // Elimina i valori mancanti e i duplicati, poi unisce città, regione e paese con una virgola.
    return [...new Set([city.name, city.admin1, city.country].filter(Boolean))].join(', ');

}

export async function searchCities(name: string, signal: AbortSignal): Promise<City[]> {

    // Ignora gli spazi iniziali e finali e richiede almeno due caratteri per cercare.
    if (name.trim().length < 2) return [];

    const query = new URLSearchParams({ name: name.trim(), count: '10', language: 'en' });


    // Il segnale permette al componente di annullare una ricerca superata o scaduta.
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${query}`, { signal });

    if (!response.ok) throw new Error('City search failed');

    const data = await response.json();

    // Controlla gli errori dell'API e verifica che i risultati, se presenti, siano una lista.
    if (data.error || (data.results !== undefined && !Array.isArray(data.results))) {

        throw new Error('Invalid city search response');

    }

    return (data.results ? data.results : []).filter((city: City) =>

        city != null && typeof city.name === 'string' && Number.isFinite(city.id)

        && Number.isFinite(city.latitude) && Number.isFinite(city.longitude));
}
