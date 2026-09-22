import '@/global.css';

import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { Colors, FontAssets } from '@/constants/theme';

import UnitsProvider from '@/contexts/UnitsContext';
import WeatherProvider from '@/contexts/WeatherContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [fontsLoaded, fontError] = useFonts(FontAssets);

    useEffect(() => {
        if (fontsLoaded || fontError) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError]);

    if (fontError) {
        throw fontError;
    }

    if (!fontsLoaded) {
        return null;
    }

    return (
        <UnitsProvider>
        <WeatherProvider>
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: {
                    backgroundColor: Colors.background,
                },
            }}
        />
        </WeatherProvider>
        </UnitsProvider>
    );
}
