import { Colors, Fonts } from '@/constants/theme';
import { Image } from 'expo-image';
import { useState } from 'react';
import type { TextStyle } from 'react-native';
import { Platform, StyleSheet, TextInput, View, useWindowDimensions } from 'react-native';
import AppText from './ui/AppText';
import InteractivePressable, { focusStyle } from './ui/InteractivePressable';


// Proprietà CSS applicate solo all'input web, senza modificare global.css.
// I tipi nativi non includono outlineStyle: 'none' e caretColor del browser.
const webInputStyle = {
    outlineStyle: 'none' as const,
    caretColor: Colors.text,
} as unknown as TextStyle;

export default function SearchBar() {

    const [inputHovered, setInputHovered] = useState(false);
    const [inputFocused, setInputFocused] = useState(false);
    const { width } = useWindowDimensions();
    const isSmallScreen = width < 400;

    return (
        <View style={[styles.row, isSmallScreen ? styles.mobileRow : styles.desktopRow]}>

            <View
                onPointerEnter={() => setInputHovered(true)}
                onPointerLeave={() => setInputHovered(false)}
                style={[styles.container, !isSmallScreen && styles.desktopInput, inputHovered && styles.inputHover, inputFocused && focusStyle]}
            >

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
                    accessibilityLabel="City to search for"
                    returnKeyType="search"
                />

            </View>

            <InteractivePressable
                showFocusOutline={false}
                accessibilityRole="button"
                accessibilityLabel="Search"
                hoverStyle={styles.buttonHover}
                style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            >

                <AppText>Search</AppText>

            </InteractivePressable>

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
        paddingHorizontal: 10,
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
        transform: [{
            scale: 0.97
        }],
    },
    buttonHover: {
        backgroundColor: 'hsl(233, 67%, 62%)'
    },
    inputHover: {
        backgroundColor: Colors.surfaceRaised
    },
    text: {
        flex: 1,
        minWidth: 0,
        color: Colors.text,
        fontFamily: Fonts.body,
        fontSize: 12
    },
    magnify: {
        width: 15,
        height: 15,
        flexShrink: 0,
    },
});
