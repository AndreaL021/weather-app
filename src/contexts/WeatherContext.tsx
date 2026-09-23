import { fetchLocationName } from '@/services/locationName';
import { fetchWeather, type Weather } from '@/services/weather';
import * as Location from 'expo-location';
import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';

type Result = { weather: Weather; place: string; notice: string | null };
type State = { data: Result | null; loading: boolean; error: boolean; retry: () => void };
const WeatherContext = createContext<State | null>(null);


let initialRequest: Promise<Result> | null = null;


export default function WeatherProvider({ children }: { children: ReactNode }) {
    // tentativi
    const [attempt, setAttempt] = useState(0);
    // stato, senza la proprieta retry
    const [state, setState] = useState<Omit<State, 'retry'>>({
        data: null,
        loading: true,
        error: false
    });

    useEffect(() => {

        let active = true;

        const request = initialRequest ? initialRequest : (initialRequest = loadLocalWeather());

        request.then(data => {

            if (active) setState({
                data,
                loading: false,
                error: false
            });

        }).catch(() => {

            if (active) setState({ data: null, loading: false, error: true });

        });

        return () => {
            active = false;
        };

    }, [attempt]);

    // azzera la richiesta precedente, cancella dati e errore, incrementa attempt
    const retry = () => {
        initialRequest = null;
        setState({ data: null, loading: true, error: false });
        setAttempt(value => value + 1);
    };

    return <WeatherContext.Provider value={{ ...state, retry }}>{children}</WeatherContext.Provider>;
}


async function loadLocalWeather(): Promise<Result> {

    // Località di riserva se la posizione non è accessibile.
    let latitude = 41.9028;
    let longitude = 12.4964;
    let place = 'Rome, Italy';
    let notice: string | null = null;
    let permissionDenied = false;
    let locationName: Promise<string | null> = Promise.resolve(null);

    try {

        if (Platform.OS === 'web' && typeof window !== 'undefined' && !window.isSecureContext) {
            throw new Error('Location requires HTTPS.');
        }

        // Controlla se l’app ha il permesso di usare la posizione e lo richiede se necessario/possibile.
        let permission = await Location.getForegroundPermissionsAsync();

        if (!permission.granted && (permission.status === 'undetermined' || (Platform.OS !== 'web' && permission.canAskAgain))) {

            permission = await Location.requestForegroundPermissionsAsync();

        }

        if (!permission.granted) {
            permissionDenied = permission.status === 'denied';
            throw new Error('Location unavailable.');
        }

        if (!(await Location.hasServicesEnabledAsync())) throw new Error('Location services are disabled.');

        let timer: ReturnType<typeof setTimeout> | undefined;

        try {
            // Vince la prima Promise che termina
            const position = await Promise.race([
                // posizione
                Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
                // timeout
                new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error('Location timed out.')), 10000); }),
            ]);

            latitude = position.coords.latitude;
            longitude = position.coords.longitude;

            locationName = fetchLocationName(latitude, longitude);
            place = 'Current location';

        } finally {
            if (timer) clearTimeout(timer);
        }

    } catch {
        
        notice = permissionDenied
            ? 'Location permission denied. Showing weather for Rome.'
            : 'Location unavailable or timed out. Showing weather for Rome.';
    }

    // Attende sia il meteo sia il nome della località; se il nome manca usa place.
    const [weather, detectedName] = await Promise.all([fetchWeather(latitude, longitude), locationName]);

    return {
        weather,
        place: detectedName ? detectedName : place,
        notice,
    };
}



export function useWeather() {
    const context = useContext(WeatherContext);
    if (!context) throw new Error('useWeather deve essere dentro WeatherProvider.');
    return context;
}
