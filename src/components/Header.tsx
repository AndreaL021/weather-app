import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { Colors, Fonts } from '@/constants/theme';

type HeaderProps = {
    menuOpen: boolean;
    onToggleMenu: () => void;
};

export default function Header({ menuOpen, onToggleMenu }: HeaderProps) {
    const { width } = useWindowDimensions();
    const isSmallScreen = width < 600;

    return (
        <View
            style={[styles.container, { paddingHorizontal: isSmallScreen ? 0 : 100 }]}
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

                <Pressable
                    onPress={onToggleMenu}
                    accessibilityRole="button"
                    accessibilityLabel="Unità di misura"
                    accessibilityState={{ expanded: menuOpen }}
                    style={({ pressed }) => [styles.unitsButton, pressed && styles.buttonPressed]}
                >
                    <Image
                        source={require('@/assets/images/icon-units.svg')}
                        style={styles.icon}
                        contentFit="contain"
                    />
                    <Text style={styles.buttonText}>Units</Text>
                    <Image
                        source={require('@/assets/images/icon-dropdown.svg')}
                        style={styles.arrow}
                        contentFit="contain"
                    />
                </Pressable>
            </View>

            {menuOpen && (
                <View style={styles.menu}>
                    <Text style={styles.menuText}>
                        Qui aggiungeremo le unità di misura
                    </Text>
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
        width: 200,
        flexShrink: 1,
    },
    logo: {
        width: '100%',
        height: 40,
    },
    unitsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: Colors.surface,
        paddingHorizontal: 12,
        minHeight: 44,
        borderRadius: 8,
    },
    buttonPressed: {
        backgroundColor: Colors.surfaceRaised,
    },
    buttonText: {
        fontFamily: Fonts.body,
        fontSize: 16,
        color: Colors.text,
    },
    icon: {
        width: 18,
        height: 18,
    },
    arrow: {
        width: 12,
        height: 12,
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
        fontFamily: Fonts.body,
        fontSize: 16,
        color: Colors.text,
    },
});
