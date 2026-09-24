import InteractivePressable from '@/components/ui/InteractivePressable';
import { Colors } from '@/constants/theme';
import { Image } from 'expo-image';
import type { ErrorBoundaryProps } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AppErrorBoundary({ retry }: ErrorBoundaryProps) {


    useEffect(() => {

        // Rende visibile l'errore anche se si verifica prima della fine del caricamento iniziale.
        SplashScreen.hideAsync();

    }, []);


    return (

        <SafeAreaView style={styles.screen}>

            <ScrollView contentContainerStyle={styles.content}>

                <Image source={require('../../assets/images/icon-error.svg')} style={styles.errorIcon} contentFit="contain" accessible={false} />

                <Text accessibilityRole="header" style={styles.title}>Something went wrong</Text>

                <Text style={styles.description} accessibilityLiveRegion="polite">
                    An unexpected error occurred. Please try again.
                </Text>

                {/* Retry chiede a Expo Router di riprovare a mostrare la pagina. */}
                <InteractivePressable
                    onPress={retry}
                    accessibilityRole="button"
                    accessibilityLabel="Retry opening the page"
                    style={styles.button}
                >

                    <Image source={require('../../assets/images/icon-retry.svg')} style={styles.retryIcon} contentFit="contain" accessible={false} />
                    <Text style={styles.buttonText}>Retry</Text>

                </InteractivePressable>

            </ScrollView>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        gap: 24,
    },
    title: {
        color: Colors.text,
        fontSize: 40,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    description: {
        color: Colors.textSecondary,
        fontSize: 18
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: Colors.surface,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    buttonText: {
        color: Colors.text,
        fontSize: 18,
    },
    errorIcon: {
        width: 60,
        height: 60,
    },
    retryIcon: {
        width: 20,
        height: 20,
    },
});
