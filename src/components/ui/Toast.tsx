import { Colors } from '@/constants/theme';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from './AppText';
import InteractivePressable from './InteractivePressable';

type Props = {
    message: string;
    variant?: 'primary' | 'warning' | 'error';
    duration?: number;
};

export default function Toast({ message, variant = 'primary', duration = 4000 }: Props) {

    // Una nuova chiave riavvia il messaggio e il timer quando cambia il contenuto.
    return <ToastMessage
        key={`${variant}:${message}:${duration}`}
        message={message} variant={variant}
        duration={duration}
    />;

}

function ToastMessage({ message, variant = 'primary', duration = 4000 }: Props) {

    const [dismissed, setDismissed] = useState(false);
    const [hovered, setHovered] = useState(false);
    const remaining = useRef(duration);

    useEffect(() => {

        if (hovered || dismissed) return;

        const startedAt = Date.now();
        const timer = setTimeout(() => setDismissed(true), remaining.current);

        // Conserva il tempo rimasto quando il mouse entra, senza far scadere l'avviso.
        return () => {
            clearTimeout(timer);
            remaining.current = Math.max(0, remaining.current - (Date.now() - startedAt));
        };

    }, [hovered, dismissed]);

    if (dismissed) return null;

    return (

        <View
            onPointerEnter={event => {
                if (event.nativeEvent.pointerType === 'mouse') setHovered(true);
            }}
            onPointerLeave={() => setHovered(false)}
            style={[styles.container, styles[variant], hovered && styles.hover]}
        >

            {/* Se i font non sono disponibili, usa il carattere di sistema. */}
            <AppText size="toast" style={styles.message}>
                {message}
            </AppText>

            {/* chiudi */}
            <InteractivePressable
                accessibilityRole="button"
                accessibilityLabel="Dismiss notification"
                onPress={() => setDismissed(true)}
                hoverStyle={styles.close}
                style={({ pressed }) => [styles.close, pressed && styles.pressed]}
            >
                <AppText style={styles.closeText}>×</AppText>
            </InteractivePressable>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        opacity: 0.8,
        maxWidth: 600,
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingLeft: 16,
        paddingRight: 6,
        paddingVertical: 8,
        gap: 8,
    },
    hover: {
        opacity: 1,
    },
    primary: {
        backgroundColor: Colors.primary,
    },
    warning: {
        backgroundColor: Colors.accent,
    },
    error: {
        backgroundColor: '#B42318',
    },
    message: {
        flex: 1,
    },
    close: {
        width: 44,
        minHeight: 44,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    closeText: {
        fontSize: 40,
    },
    pressed: {
        opacity: 0.6,
    },
});
