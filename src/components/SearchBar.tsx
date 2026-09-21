import { Colors, Fonts } from '@/constants/theme';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import Animated from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function SearchBar() {
    const [pressed, setPressed] = useState(false);
    const { width } = useWindowDimensions();
    const isSmallScreen = width < 576;

    return (
        <View style={[styles.row, isSmallScreen ? styles.mobileRow : styles.desktopRow]}>
            <View style={[styles.container, !isSmallScreen && styles.desktopInput]}>
                <Image
                    contentFit="contain"
                    source={require('@/assets/images/icon-search.svg')}
                    style={styles.magnify}
                    accessible={false}
                />
                <TextInput
                    style={styles.text}
                    placeholder="Search for a place..."
                    placeholderTextColor={Colors.textMuted}
                    accessibilityLabel="Città da cercare"
                    returnKeyType="search"
                />
            </View>
            <AnimatedPressable
                accessibilityRole="button"
                accessibilityLabel="Cerca"
                onPressIn={() => setPressed(true)}
                    onPressOut={() => setPressed(false)}
                    style={[styles.button, pressed && styles.buttonPressed]}
            >
                <Text style={styles.textBtn}>Search</Text>
            </AnimatedPressable>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        marginTop: 32,
        alignSelf: 'center',
        gap: 12,
    },
    mobileRow: {
        width: '100%',
        flexDirection: 'column',
    },
    desktopRow: {
        width: '50%',
        minWidth: 480,
        flexDirection: 'row',
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 10,
        backgroundColor: Colors.surface,
        borderRadius: 8,
    },
    desktopInput: {
        flex: 1,
        minWidth: 0,
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary,
        borderRadius: 8,
        padding: 10,
        paddingHorizontal: 16,
    },
    buttonPressed: {
        backgroundColor: Colors.primaryDark,
        transform: [{ scale: 0.97 }],
    },
    text: {
        flex: 1,
        minWidth: 0,
        fontSize: 15,
        color: Colors.text,
        fontFamily: Fonts.body,
    },
    textBtn: {
        fontSize: 15,
        fontFamily: Fonts.body,
        color: Colors.text,
    },
    magnify: {
        width: 15,
        height: 15,
        flexShrink: 0,
    },
});
