import Header from '@/components/Header/Header';
import SearchBar from '@/components/SearchBar';
import AppText from '@/components/ui/AppText';
import WeatherError from '@/components/WeatherError';
import WeatherOverview from '@/components/WeatherOverview/WeatherOverview';
import { Colors, Fonts } from '@/constants/theme';
import { useWeather } from '@/contexts/WeatherContext';
import { Link } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function HomeScreen() {
    return <HomeContent />;
}

function HomeContent() {

    const { data, loading, error, retry } = useWeather();
    
    return (

        <View style={styles.screen}>

            {/* header */}
            <SafeAreaView edges={['top', 'left', 'right']} style={styles.headerLayer}>

                <Header />

            </SafeAreaView>


            {/* home */}
            <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.container}>
                <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                    {
                        error
                            ?   // messaggio errore + riprova
                                <WeatherError onRetry={retry} /> 
                            : <>

                                {/* titolo */}
                                <Text style={styles.title}>
                                    How’s the sky looking today?
                                </Text>

                                {/* barra ricerca */}
                                <SearchBar />

                                {/* caricamento */}
                                {
                                    loading && <AppText style={styles.status} accessibilityLiveRegion="polite">Finding your location and loading weather…</AppText>
                                }

                                {
                                    data && <>

                                        {/* body */}
                                        <WeatherOverview />

                                        {/* Collegamento a Open-Meteo */}
                                        <Link href="https://open-meteo.com/" style={styles.attribution}>Weather data by Open-Meteo</Link>
                                    </>
                                }
                            </>
                    }
                </ScrollView>
            </SafeAreaView>

        </View>
    );
}

const styles = StyleSheet.create({
    status: { 
        marginTop: 20, 
        alignSelf: 'center', 
        gap: 12 
    },
    attribution: { 
        fontFamily: Fonts.body, 
        color: Colors.textMuted, 
        fontSize: 12, 
        textAlign: 'center', 
        marginVertical: 12 
    },
    screen: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 24,
    },
    title: {
        fontFamily: Fonts.heading,
        fontSize: 30,
        color: Colors.text,
        textAlign: 'center',
    },
    headerLayer: {
        flexShrink: 0,
        pointerEvents: 'box-none',
        zIndex: 2,
        paddingHorizontal: 24,
        paddingVertical: 5,
        backgroundColor: 'transparent',

    },
});
