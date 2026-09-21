import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated from 'react-native-reanimated';

import { Colors } from '@/constants/theme';
import AppText from './ui/AppText';

type HeaderProps = {
    menuOpen: boolean;
    onToggleMenu: () => void;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Header({ menuOpen, onToggleMenu }: HeaderProps) {
    const [pressed, setPressed] = useState(false);
    const { width } = useWindowDimensions();
    const isSmallScreen = width < 600;

    return (
        <View
            style={[styles.container, { paddingHorizontal: isSmallScreen ? 0 : 70 }]}
        >
            <View style={styles.row}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('@/assets/images/logo.svg')}
                        style={styles.logo}
                        contentFit="contain"
                        accessibilityLabel="Weather Now"
                    />
                </View>

                <AnimatedPressable
                    onPress={onToggleMenu}
                    accessibilityRole="button"
                    accessibilityLabel="Unità di misura"
                    accessibilityState={{ expanded: menuOpen }}
                    onPressIn={() => setPressed(true)}
                    onPressOut={() => setPressed(false)}
                    style={[styles.unitsButton, pressed && styles.buttonPressed]}
                >
                    <Image
                        source={require('@/assets/images/icon-units.svg')}
                        style={styles.icon}
                        contentFit="contain"
                    />
                    <AppText style={styles.buttonText}>Units</AppText>
                    <Image
                        source={require('@/assets/images/icon-dropdown.svg')}
                        style={styles.arrow}
                        contentFit="contain"
                    />
                </AnimatedPressable>
            </View>
            {/* Dropdown menu */}
            {menuOpen && (
                <View style={styles.menu}>
                    <AppText style={styles.menuText}>
                        Qui aggiungeremo le unità di misura
                    </AppText>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        pointerEvents: 'box-none',
    },
    row: {
        pointerEvents: 'box-none',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 16,
    },
    logoContainer: {
        pointerEvents: 'none',
        width: 150,
        flexShrink: 1,
    },
    logo: {
        width: '100%',
        height: 40,
    },
    unitsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: Colors.surface,
        padding: 8,
        borderRadius: 8,
    },
    buttonPressed: {
        backgroundColor: Colors.surfaceRaised,
    },
    buttonText: {
        fontSize: 12,
    },
    icon: {
        width: 12,
        height: 12,
    },
    arrow: {
        width: 10,
        height: 10,
    },
    menu: {
        alignSelf: 'flex-end',
        width: 240,
        marginTop: 8,
        padding: 16,
        borderRadius: 12,
        backgroundColor: Colors.surface,
    },
    menuText: {
        fontSize: 16,
    },
});
