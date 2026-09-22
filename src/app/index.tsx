import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import WeatherOverview from '@/components/WeatherOverview/WeatherOverview';
import SelectProvider, { useSelectMenu } from '@/components/ui/SelectProvider';
import { Colors, Fonts } from '@/constants/theme';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
    return <SelectProvider><HomeContent /></SelectProvider>;
}

function HomeContent() {
    const { closeMenu } = useSelectMenu();

    return (
        <View style={styles.screen}>

            {/* Navbar */}
            <SafeAreaView edges={['top', 'left', 'right']} style={styles.headerLayer}>
                <Header />
            </SafeAreaView>


            {/* Home */}
            <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.container}>
                <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled"
                    onScrollBeginDrag={closeMenu} onScroll={closeMenu} scrollEventThrottle={16}>

                    <Text style={styles.title}>
                        How’s the sky looking today?
                    </Text>

                    <SearchBar />

                    <WeatherOverview />
                </ScrollView>
            </SafeAreaView>

        </View>
    );
}

const styles = StyleSheet.create({
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
        fontSize: 40,
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
