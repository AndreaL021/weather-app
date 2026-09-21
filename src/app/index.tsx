import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import WeatherOverview from '@/components/WeatherOverview/WeatherOverview';
import { Colors, Fonts } from '@/constants/theme';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <View style={styles.screen}>

            {/* Navbar */}
            <SafeAreaView style={[StyleSheet.absoluteFill, styles.headerLayer]}>
                <Header
                    menuOpen={menuOpen}
                    onToggleMenu={() => setMenuOpen(open => !open)}
                />
            </SafeAreaView>

            {/* chiusura Dropdown */}
            {menuOpen && (
                <Pressable
                    style={[StyleSheet.absoluteFill, styles.backdrop]}
                    onPress={() => setMenuOpen(false)}
                    accessibilityRole="button"
                    accessibilityLabel="Chiudi menu unità"
                />
            )}

            {/* Home */}
            <SafeAreaView style={styles.container}>

                <Text style={styles.title}>
                    How’s the sky looking today?
                </Text>

                <SearchBar />

                <WeatherOverview />

            </SafeAreaView>

        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingVertical: 32,
    },
    title: {
        marginTop: 80,
        fontFamily: Fonts.heading,
        fontSize: 40,
        color: Colors.text,
        textAlign: 'center',
    },
    headerLayer: {
        pointerEvents: 'box-none',
        zIndex: 2,
        paddingHorizontal: 24,
        paddingVertical: 32,
    },
    backdrop: {
        zIndex: 1,
        cursor: 'auto' as const,
    },
});
