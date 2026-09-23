export type Weather = {
    current: {
        time: string;
        temperature_2m: number;
        apparent_temperature: number;
        relative_humidity_2m: number;
        wind_speed_10m: number;
        precipitation: number;
        weather_code: number
    };
    daily: {
        time: string[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
        weather_code: number[]
    };
    hourly: {
        time: string[];
        temperature_2m: number[];
        weather_code: number[]
    };
};

export async function fetchWeather(latitude: number, longitude: number): Promise<Weather> {

    const query = new URLSearchParams({

        latitude: String(latitude), 
        longitude: String(longitude), 
        timezone: 'auto', 
        forecast_days: '7',
        temperature_unit: 'celsius', 
        wind_speed_unit: 'kmh', 
        precipitation_unit: 'mm',
        current: 'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,precipitation,weather_code',
        daily: 'temperature_2m_max,temperature_2m_min,weather_code', 
        hourly: 'temperature_2m,weather_code',

    });

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);

    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?${query}`, { signal: controller.signal });

        if (!response.ok) throw new Error('Weather request failed');

        const data: Weather = await response.json();

        if (!data.current || !Number.isFinite(data.current.temperature_2m) || !data.daily?.time?.length || !data.hourly?.time?.length) {

            throw new Error('Invalid weather response');

        }

        return data;

    } finally {
        clearTimeout(timer);
    }
}

// Converte la data nel nome del giorno della settimana
export function dayLabel(date: string, long = false) {

    return new Date(`${date}T12:00:00Z`).toLocaleDateString('en-US', { weekday: long ? 'long' : 'short', timeZone: 'UTC' });

}

export function weatherIcon(code: number) {

    if (code === 0) return { condition: 'Clear sky', icon: require('../../assets/images/icon-sunny.webp') };

    if (code <= 2) return { condition: 'Partly cloudy', icon: require('../../assets/images/icon-partly-cloudy.webp') };

    if (code === 3) return { condition: 'Overcast', icon: require('../../assets/images/icon-overcast.webp') };

    if (code === 45 || code === 48) return { condition: 'Fog', icon: require('../../assets/images/icon-fog.webp') };

    if (code >= 95) return { condition: 'Thunderstorm', icon: require('../../assets/images/icon-storm.webp') };

    if ([71, 73, 75, 77, 85, 86].includes(code)) return { condition: 'Snow', icon: require('../../assets/images/icon-snow.webp') };

    if (code >= 51 && code <= 57) return { condition: 'Drizzle', icon: require('../../assets/images/icon-drizzle.webp') };
    
    return { condition: 'Rain', icon: require('../../assets/images/icon-rain.webp') };
}
