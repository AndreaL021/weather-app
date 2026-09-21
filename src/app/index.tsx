import Header from '@/components/Header';
import { Colors, Fonts } from '@/constants/theme';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <View style={styles.screen}>
            <SafeAreaView style={styles.container}>
                <Text style={styles.title}>
                    How’s the sky looking today?
                </Text>
            </SafeAreaView>
            {menuOpen && (
                <Pressable
                    style={[StyleSheet.absoluteFill, styles.backdrop]}
                    onPress={() => setMenuOpen(false)}
                    accessibilityRole="button"
                    accessibilityLabel="Chiudi menu unità"
                />
            )}
            <SafeAreaView style={[StyleSheet.absoluteFill, styles.headerLayer]}>
                <Header
                    menuOpen={menuOpen}
                    onToggleMenu={() => setMenuOpen(open => !open)}
                />
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
        marginTop: 92,
        fontFamily: Fonts.heading,
        fontSize: 48,
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
