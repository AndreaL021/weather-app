import Header from '@/components/Header/Header';
import SearchBar from '@/components/SearchBar';
import AppText from '@/components/ui/AppText';
import WeatherError from '@/components/WeatherError';
import WeatherOverview from '@/components/WeatherOverview/WeatherOverview';
import { Colors, Fonts } from '@/constants/theme';
import { useWeather } from '@/contexts/WeatherContext';
import useBreakpoints from '@/hooks/useBreakpoints';
import { Link } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function HomeContent() {

    const { isSmallScreen, isMediumScreen } = useBreakpoints();
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
                                <Text style={[
                                    styles.title,
                                    { fontSize: isSmallScreen ? 30 : isMediumScreen ? 40 : 50 }
                                ]}>
                                    How’s the sky looking today?
                                </Text>

                                {/* barra ricerca */}
                                <SearchBar />

                                {/* Mostra le card segnaposto durante il caricamento, anche quando cambia la città. */}
                                {(loading || data) && <WeatherOverview loading={loading} />}

                                {
                                    data && <>

                                        {/* Collegamento a Open-Meteo */}
                                        <Link href="https://open-meteo.com/" style={styles.attribution}>
                                            <AppText color='textMuted'>
                                                Weather data by Open-Meteo
                                            </AppText>
                                        </Link>
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
    attribution: {
        fontFamily: Fonts.body,
        textAlign: 'center',
        marginVertical: 20,
    },
    screen: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    content: {
        // Riempie lo spazio disponibile e centra il contenuto, senza limitarne l'altezza.
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    title: {
        fontFamily: Fonts.heading,
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
