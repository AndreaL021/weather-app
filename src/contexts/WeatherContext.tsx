import { fetchLocationName } from '@/services/locationName';
import { fetchWeather, type Weather } from '@/services/weather';
import * as Location from 'expo-location';
import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';

type Result = { weather: Weather; place: string; notice: string | null };
type State = { data: Result | null; loading: boolean; error: boolean; retry: () => void };
const WeatherContext = createContext<State | null>(null);

// Conserva la richiesta iniziale in memoria per non ripeterla a ogni montaggio.
// Retry la azzera; non è un salvataggio permanente sul dispositivo.
let initialRequest: Promise<Result> | null = null;

async function loadLocalWeather(): Promise<Result> {
    // Località di riserva se la posizione non è accessibile.
    let latitude = 41.9028;
    let longitude = 12.4964;
    let place = 'Rome, Italy';
    let notice: string | null = null;
    let locationName: Promise<string | null> = Promise.resolve(null);
    try {
        if (Platform.OS === 'web' && typeof window !== 'undefined' && !window.isSecureContext) {
            throw new Error('Location requires HTTPS. Showing weather for Rome.');
        }
        // Controlla il permesso già presente e lo richiede solo quando possibile.
        let permission = await Location.getForegroundPermissionsAsync();
        if (!permission.granted && (permission.status === 'undetermined' || (Platform.OS !== 'web' && permission.canAskAgain))) {
            permission = await Location.requestForegroundPermissionsAsync();
        }
        if (!permission.granted) throw new Error('Location permission denied. Showing weather for Rome.');
        if (!(await Location.hasServicesEnabledAsync())) throw new Error('Location services are disabled. Showing weather for Rome.');
        let timer: ReturnType<typeof setTimeout> | undefined;
        try {
            // Vince la prima Promise che termina: posizione ottenuta oppure timeout.
            // Il timeout limita l'attesa, non annulla la richiesta GPS sottostante.
            const position = await Promise.race([
                Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
                new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error('Location timed out. Showing weather for Rome.')), 30000); }),
            ]);
            // Una precisione di circa un chilometro è sufficiente per le previsioni.
            latitude = Number(position.coords.latitude.toFixed(2));
            longitude = Number(position.coords.longitude.toFixed(2));
            locationName = fetchLocationName(latitude, longitude);
            place = 'Current location';
        } finally {
            if (timer) clearTimeout(timer);
        }
    } catch (error) {
        notice = error instanceof Error && error.message.endsWith('Showing weather for Rome.')
            ? error.message : 'Location unavailable. Showing weather for Rome.';
    }
    // Attende sia il meteo sia il nome della località; se il nome manca usa place.
    const [weather, detectedName] = await Promise.all([fetchWeather(latitude, longitude), locationName]);
    return { weather, place: detectedName ?? place, notice };
}

export default function WeatherProvider({ children }: { children: ReactNode }) {
    // attempt cambia con Retry e fa ripartire l'effetto di caricamento.
    const [attempt, setAttempt] = useState(0);
    const [state, setState] = useState<Omit<State, 'retry'>>({ data: null, loading: true, error: false });
    useEffect(() => {
        // Ignora risposte arrivate dopo la pulizia dell'effetto, senza aggiornare lo stato.
        let active = true;
        // Condivide la richiesta iniziale anche durante il doppio montaggio di sviluppo.
        const request = initialRequest ?? (initialRequest = loadLocalWeather());
        request.then(data => {
            if (active) setState({ data, loading: false, error: false });
        }).catch(() => {
            if (active) setState({ data: null, loading: false, error: true });
        });
        return () => { active = false; };
    }, [attempt]);
    // Nasconde soltanto l'avviso dopo 2 secondi: i dati meteo restano disponibili.
    useEffect(() => {
        if (!state.data?.notice) return;
        const timer = setTimeout(() => {
            setState(current => current.data ? { ...current, data: { ...current.data, notice: null } } : current);
        }, 2000);
        return () => clearTimeout(timer);
    }, [state.data]);
    const retry = () => {
        initialRequest = null;
        setState({ data: null, loading: true, error: false });
        setAttempt(value => value + 1);
    };
    return <WeatherContext.Provider value={{ ...state, retry }}>{children}</WeatherContext.Provider>;
}

// Come useUnits: legge i dati condivisi, non avvia una richiesta meteo per ogni card.
export function useWeather() {
    const context = useContext(WeatherContext);
    if (!context) throw new Error('useWeather deve essere dentro WeatherProvider.');
    return context;
}
