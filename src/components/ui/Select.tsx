import { Colors } from '@/constants/theme';
import { Image, type ImageSource } from 'expo-image';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { Animated, Modal, Platform, Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import AppText from './AppText';
import InteractivePressable, { focusStyle } from './InteractivePressable';


type Option = { label: string; value: string };

type SelectProps = {
    label: string;
    accessibilityLabel: string;
    icon?: ImageSource;
    variant?: 'surface' | 'raised';
    menuWidth?: number;
    options?: readonly Option[];
    value?: string;
    onChange?: (value: string) => void;
    children?: ReactNode;
};

export default function Select({ label, accessibilityLabel, icon, variant = 'surface', menuWidth = 180, options, value, onChange, children }: SelectProps) {

    const [isOpen, setIsOpen] = useState(false);

    const [rotation] = useState(() => new Animated.Value(0));

    // animazione freccia
    useEffect(() => {
        const animation = Animated.timing(rotation, {
            toValue: isOpen ? 1 : 0,
            duration: 100,
            useNativeDriver: Platform.OS !== 'web',
        });
        animation.start();

        return () => animation.stop();

    }, [isOpen, rotation]);

    // Salva posizione e dimensioni del pulsante per posizionare il menu
    const [button, setButton] = useState({ x: 0, y: 0, width: 0, height: 0 });
    // Si collega al pulsante tramite ref={buttonRef} dentro return (riga 69)
    const buttonRef = useRef<View>(null);


    const { width, height } = useWindowDimensions();

    const closeMenu = () => setIsOpen(false);
    const openMenu = () => {

        // misura il pulsante nella finestra e rende visibile il menu
        buttonRef.current?.measureInWindow((x, y, width, height) => {
            setButton({ x, y, width, height });
            setIsOpen(true);
        });
    };

    // Allinea il menu al pulsante, mantenendolo dentro lo schermo.
    const actualWidth = Math.min(menuWidth, width - 24);
    const below = height - button.y - button.height - 20;

    // Se sotto c'è poco spazio e sopra ce n'è di più, apre verso l'alto.
    const above = below < 260 && button.y > below;

    return (
        <>
            <InteractivePressable
                ref={buttonRef}
                showFocusOutline={false}
                onPress={openMenu}
                accessibilityRole="button"
                accessibilityLabel={accessibilityLabel}
                accessibilityState={{ expanded: isOpen }}
                style={({ pressed }) => [styles.button, variant === 'raised' && styles.raised, pressed && styles.pressed, isOpen && focusStyle]}
            >
                {icon && <Image source={icon} style={styles.icon} contentFit="contain" accessible={false} />}
                <AppText>{label}</AppText>

                <Animated.View style={{ transform: [{ rotate: rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] }) }] }}>
                    <Image source={require('@/assets/images/icon-dropdown.svg')} style={styles.arrow} contentFit="contain" accessible={false} />
                </Animated.View>

            </InteractivePressable>

            <Modal visible={isOpen} transparent animationType="none" onRequestClose={closeMenu} statusBarTranslucent>
                <View style={styles.modal}>

                    {/* Chiusura menu con tocco esterno */}
                    <Pressable style={styles.backdrop} onPress={closeMenu} accessibilityRole="button" accessibilityLabel="Chiudi menu" />

                    <View style={[styles.menu, {
                        width: actualWidth,
                        left: button.x + button.width - actualWidth,

                        // Usa bottom oppure top per lasciare 8 di distanza dal pulsante.
                        ...(above ? { bottom: height - button.y + 8 } : { top: button.y + button.height + 8 }),
                    }]}>
                        <ScrollView keyboardShouldPersistTaps="handled">

                            {/* Ogni opzione comunica il nuovo valore al genitore e chiude il menu. */}
                            {options?.map(option => (
                                <InteractivePressable
                                    key={option.value}
                                    accessibilityRole="button"
                                    accessibilityState={{ selected: option.value === value }}
                                    onPress={() => { onChange?.(option.value); closeMenu(); }}
                                    style={({ pressed }) => [styles.option, option.value === value && styles.selected, pressed && styles.pressed]}>
                                    <AppText>{option.label}</AppText>
                                    {option.value === value && <Image source={require('@/assets/images/icon-checkmark.svg')} style={styles.check} accessible={false} />}
                                </InteractivePressable>
                            ))}
                            {children}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    modal: {
        flex: 1
    },

    backdrop: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        cursor: 'auto'
    },

    menu: {
        position: 'absolute',
        padding: 8,
        borderRadius: 8,
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border
    },

    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: Colors.surface,
        padding: 8,
        borderRadius: 8
    },

    raised: {
        backgroundColor: Colors.border
    },

    icon: {
        width: 12, height: 12
    },

    arrow: {
        width: 10,
        height: 10,
    },


    check: {
        width: 14,
        height: 14
    },

    pressed: { backgroundColor: 'hsl(243, 27%, 16%)' },

    selected: {
        backgroundColor: Colors.surfaceRaised
    },
    option: {
        minHeight: 40,
        paddingHorizontal: 8,
        paddingVertical: 10,
        borderRadius: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12
    },
});
