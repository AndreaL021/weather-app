import { Colors } from '@/constants/theme';
import { Image, type ImageSource } from 'expo-image';
import { type ReactNode, useId, useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import AppText from './AppText';
import { useSelectMenu } from './SelectProvider';

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
    const id = useId();
    const buttonRef = useRef<View>(null);
    const { activeId, openMenu, closeMenu } = useSelectMenu();
    const menuOpen = activeId === id;

    const toggleMenu = () => {
        if (menuOpen) {
            closeMenu();
            return;
        }
        buttonRef.current?.measureInWindow((x, y, width, height) => {
            openMenu({
                id,
                anchor: { x, y, width, height },
                triggerRef: buttonRef,
                width: menuWidth,
                renderContent: close => (
                    <ScrollView keyboardShouldPersistTaps="handled">
                        {options?.map(option => (
                            <Pressable
                                key={option.value}
                                accessibilityRole="button"
                                accessibilityState={{ selected: option.value === value }}
                                onPress={() => { onChange?.(option.value); close(); }}
                                style={({ pressed }) => [styles.option, option.value === value && styles.selected, pressed && styles.pressed]}
                            >
                                <AppText>{option.label}</AppText>
                                {option.value === value && <Image source={require('@/assets/images/icon-checkmark.svg')} style={styles.check} accessible={false} />}
                            </Pressable>
                        ))}
                        {children}
                    </ScrollView>
                ),
            });
        });
    };

    return (
        <Pressable
            ref={buttonRef}
            onPress={toggleMenu}
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel}
            accessibilityState={{ expanded: menuOpen }}
            style={({ pressed }) => [styles.button, variant === 'raised' && styles.raised, pressed && styles.pressed]}
        >
            {icon && <Image source={icon} style={styles.icon} contentFit="contain" accessible={false} />}
            <AppText>{label}</AppText>
            <Image source={require('@/assets/images/icon-dropdown.svg')} style={styles.arrow} contentFit="contain" accessible={false} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: Colors.surface, padding: 8, borderRadius: 8 },
    raised: { backgroundColor: Colors.border },
    icon: { width: 12, height: 12 },
    arrow: { width: 10, height: 10 },
    check: { width: 14, height: 14 },
    pressed: { backgroundColor: 'hsl(243, 27%, 16%)' },
    selected: { backgroundColor: Colors.surfaceRaised },
    option: { minHeight: 40, paddingHorizontal: 8, paddingVertical: 10, borderRadius: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
});
