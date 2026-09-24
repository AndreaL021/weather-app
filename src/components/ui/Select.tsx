import { Colors, FontSizes } from '@/constants/theme';
import useBreakpoints from '@/hooks/useBreakpoints';
import { Image, type ImageSource } from 'expo-image';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { Animated, Modal, Platform, Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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

    const { isSmallScreen } = useBreakpoints()

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
    const modalRef = useRef<View>(null);
    const [modalFrame, setModalFrame] = useState<{ x: number; y: number; width: number; height: number } | null>(null);


    const { width, height } = useWindowDimensions();
    const insets = useSafeAreaInsets();

    const closeMenu = () => setIsOpen(false);
    const openMenu = () => {
        setModalFrame(null);

        // Su Android usa le coordinate della pagina: includono già il padding della SafeAreaView.
        // measureInWindow può invece sottrarre lo spazio della barra di stato.
        if (Platform.OS === 'android') {
            buttonRef.current?.measure((_x, _y, width, height, pageX, pageY) => {
                setButton({ x: pageX, y: pageY, width, height });
                setIsOpen(true);
            });
            return;
        }

        // Misura il pulsante nella finestra e rende visibile il menu.
        buttonRef.current?.measureInWindow((x, y, width, height) => {
            setButton({ x, y, width, height });
            setIsOpen(true);
        });
    };

    const measureModal = () => {
        if (Platform.OS === 'android') {
            modalRef.current?.measure((_x, _y, width, height, pageX, pageY) => {
                setModalFrame({ x: pageX, y: pageY, width, height });
            });
            return;
        }

        modalRef.current?.measureInWindow((x, y, width, height) => {
            setModalFrame({ x, y, width, height });
        });
    };

    // Converte le coordinate della finestra in coordinate relative al Modal.
    const buttonX = button.x - (modalFrame?.x ?? 0);
    const buttonY = button.y - (modalFrame?.y ?? 0);
    const modalWidth = modalFrame?.width ?? width;
    const modalHeight = modalFrame?.height ?? height;
    // Mantiene il menu lontano da notch e barre di sistema, oltre ai 12 di margine.
    const leftLimit = insets.left + 12;
    const rightLimit = modalWidth - insets.right - 12;
    const actualWidth = Math.max(0, Math.min(menuWidth, rightLimit - leftLimit));
    const below = modalHeight - insets.bottom - buttonY - button.height - 20;
    const spaceAbove = buttonY - insets.top - 20;

    // Se sotto c'è poco spazio e sopra ce n'è di più, apre verso l'alto.
    const above = below < 260 && spaceAbove > below;

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
                {
                    icon && <Image source={icon} style={styles.icon} contentFit="contain" accessible={false} />
                }

                <AppText style={{ fontSize: isSmallScreen ? FontSizes.xs: FontSizes.small }}>{label}</AppText>

                {/* animazione */}
                <Animated.View style={{ transform: [{ rotate: rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] }) }] }}>

                    {/* icona animata */}
                    <Image source={require('@/assets/images/icon-dropdown.svg')} style={styles.arrow} contentFit="contain" accessible={false} />

                </Animated.View>

            </InteractivePressable>

            {/* dropdown */}
            <Modal visible={isOpen} transparent animationType="none" onRequestClose={closeMenu} onShow={measureModal} statusBarTranslucent navigationBarTranslucent>

                <View ref={modalRef} collapsable={false} onLayout={measureModal} style={styles.modal}>

                    {/* Chiusura menu con tocco esterno */}
                    <Pressable style={styles.backdrop} onPress={closeMenu} accessibilityRole="button" accessibilityLabel="Close menu" />

                    <View
                        style={[styles.menu, {
                            width: actualWidth,
                            opacity: modalFrame ? 1 : 0,
                            left: Math.max(leftLimit, Math.min(buttonX + button.width - actualWidth, rightLimit - actualWidth)),
                            // Limita il menu allo spazio disponibile: le opzioni in eccesso scorrono all'interno.
                            maxHeight: Math.max(0, above ? spaceAbove : below),
                            // Usa bottom oppure top per lasciare 8 di distanza dal pulsante.
                            ...(above ? { bottom: modalHeight - buttonY + 8 } : { top: buttonY + button.height + 8 }),
                        }]}
                    >

                        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.menuContent}>

                            {/* Ogni opzione comunica il nuovo valore al genitore e chiude il menu. */}
                            {
                                options?.map(option => (
                                    <InteractivePressable
                                        insetOutline
                                        key={option.value}
                                        accessibilityRole="button"
                                        accessibilityState={{ selected: option.value === value }}
                                        onPress={() => { onChange?.(option.value); closeMenu(); }}
                                        style={({ pressed }) => [styles.option, option.value === value && styles.selected, pressed && styles.pressed]}
                                    >

                                        <AppText style={{ fontSize: isSmallScreen ? FontSizes.xs: FontSizes.small }}>{option.label}</AppText>
                                        {
                                            option.value === value && <Image source={require('@/assets/images/icon-checkmark.svg')} style={styles.check} accessible={false} />
                                        }

                                    </InteractivePressable>
                                ))
                            }

                            {/* necessario per menu personalizzato units */}
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
        borderRadius: 8,
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border
    },
    menuContent: {
        // Lascia spazio al contorno delle opzioni dentro l'area scorrevole.
        padding: 8,
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
        width: 12,
        height: 12
    },
    arrow: {
        width: 10,
        height: 10,
    },
    check: {
        width: 14,
        height: 14
    },
    pressed: {
        backgroundColor: 'hsl(243, 27%, 16%)'
    },
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
