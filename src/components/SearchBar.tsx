import { Colors, Fonts } from '@/constants/theme';
import { Image } from 'expo-image';
import { useState } from 'react';
import type { TextStyle } from 'react-native';
import { Platform, Pressable, StyleSheet, TextInput, View, useWindowDimensions } from 'react-native';
import Animated from 'react-native-reanimated';
import AppText from './ui/AppText';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Proprietà CSS applicate solo all'input web, senza modificare global.css.
// I tipi nativi non includono outlineStyle: 'none' e caretColor del browser.
const webInputStyle = {
    outlineStyle: 'none' as const,
    caretColor: Colors.text,
} as unknown as TextStyle;

export default function SearchBar() {
    const [pressed, setPressed] = useState(false);
    const [inputFocused, setInputFocused] = useState(false);
    const { width } = useWindowDimensions();
    const isSmallScreen = width < 375;

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
                    underlineColorAndroid='transparent'
                    style={[styles.text, Platform.OS === 'web' && webInputStyle]}
                    placeholder={inputFocused ? '' : 'Search for a place...'}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    placeholderTextColor={Colors.textMuted}
                    accessibilityLabel="Città da cercare"
                    returnKeyType="search"
                />
            </View>
            <AnimatedPressable
                accessibilityRole="button"
                accessibilityLabel="search"
                onPressIn={() => setPressed(true)}
                onPressOut={() => setPressed(false)}
                style={[styles.button, pressed && styles.buttonPressed]}
            >
                <AppText style={styles.textBtn}>Search</AppText>
            </AnimatedPressable>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        marginTop: 20,
        alignSelf: 'center',
        gap: 12,
    },
    mobileRow: {
        width: '100%',
        flexDirection: 'column',
    },
    desktopRow: {
        width: '50%',
        minWidth: 350,
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
        color: Colors.text,
        fontFamily: Fonts.body
    },
    textBtn: {
    },
    magnify: {
        width: 15,
        height: 15,
        flexShrink: 0,
    },
});
