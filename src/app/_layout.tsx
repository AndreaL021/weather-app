import '@/global.css';

import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, FontAssets } from '@/constants/theme';

import AppErrorBoundary from '@/components/AppErrorBoundary';
import UnitsProvider from '@/contexts/UnitsContext';
import WeatherProvider, { useWeather } from '@/contexts/WeatherContext';
import Toast from '@/components/ui/Toast';

// Expo Router usa questa schermata se il layout o i componenti figli generano un errore imprevisto.
export const ErrorBoundary = AppErrorBoundary;
// Mantiene visibile la schermata iniziale mentre vengono caricati i font.
SplashScreen.preventAutoHideAsync();



export default function RootLayout() {

    // Carica i font definiti nel tema e controlla se il caricamento termina o fallisce.
    const [fontsLoaded, fontError] = useFonts(FontAssets);


    useEffect(() => {

        // Nasconde la schermata iniziale anche in caso di errore, per non lasciarla bloccata.
        if (fontsLoaded || fontError) {
            SplashScreen.hideAsync();
        }

    }, [fontsLoaded, fontError]);
    
    // Aspetta i font, ma permette di aprire la pagina anche se il caricamento fallisce.
    if (!fontsLoaded && !fontError) {

        return null;

    }

    return (
        // I provider condividono unità di misura e dati meteo con tutte le pagine dello Stack.
        <UnitsProvider>
            <WeatherProvider>

                <View style={styles.container}>

                    {/* Gestisce la navigazione tra le pagine della cartella app. */}
                    <Stack
                        screenOptions={{
                            headerShown: false,
                            contentStyle: {
                                backgroundColor: Colors.background,
                            },
                        }}
                    />
                    <ToastMessages fontError={!!fontError} />
                </View>

            </WeatherProvider>
        </UnitsProvider>
    );
}

// Raggruppa gli avvisi per evitare che si sovrappongano, senza spostare la pagina.
function ToastMessages({ fontError }: { fontError: boolean }) {
    const { data } = useWeather();
    return (
        <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.notifications}>
            {fontError && <Toast message="Failed to load fonts" variant="error" />}
            {data?.notice && <Toast key={data.notice} message={data.notice} variant="warning" />}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    notifications: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        gap: 12,
        zIndex: 10,
        pointerEvents: 'box-none',
    },
});
