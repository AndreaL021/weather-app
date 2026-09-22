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

            {/* Header */}
            <SafeAreaView edges={['top', 'left', 'right']} style={styles.headerLayer}>
                <Header />
            </SafeAreaView>


            {/* Home */}
            <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.container}>
                <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled"
                    >

                    {/* error */}
                    {error ? <WeatherError onRetry={retry} /> : <>

                    {/* title */}
                    <Text style={styles.title}>
                        How’s the sky looking today?
                    </Text>

                    {/* search */}
                    <SearchBar />

                    {/* loading message */}
                    {loading && <AppText style={styles.status} accessibilityLiveRegion="polite">Finding your location and loading weather…</AppText>}

                    {data && <>
                        {data.notice && <AppText style={styles.status}>{data.notice}</AppText>}

                        {/* body */}
                        <WeatherOverview />

                        {/* Open meteo link */}
                        <Link href="https://open-meteo.com/" style={styles.attribution}>Weather data by Open-Meteo</Link>
                    </>}
                    </>}
                </ScrollView>
            </SafeAreaView>

        </View>
    );
}

const styles = StyleSheet.create({
    status: { marginTop: 20, alignSelf: 'center', gap: 12 },
    attribution: { fontFamily: Fonts.body, color: Colors.textMuted, fontSize: 12, textAlign: 'center', marginVertical: 12 },
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
