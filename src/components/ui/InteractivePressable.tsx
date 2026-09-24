import { Colors } from '@/constants/theme';
import { forwardRef, useState } from 'react';
import { Pressable, StyleSheet, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

// Proprietà di Pressable
type Props = PressableProps & { hoverStyle?: StyleProp<ViewStyle>; showFocusOutline?: boolean; insetOutline?: boolean };

// collega ref ricevuto dall'esterno al Pressable interno.
const InteractivePressable = forwardRef<View, Props>(function InteractivePressable(
    { style, hoverStyle, showFocusOutline = true, insetOutline = false, onHoverIn, onHoverOut, onFocus, onBlur, ...props }, ref,
) {

    const [hovered, setHovered] = useState(false);
    const [focused, setFocused] = useState(false);

    return (

        <Pressable {...props} ref={ref}
            onHoverIn={event => { setHovered(true); onHoverIn?.(event); }}
            onHoverOut={event => { setHovered(false); onHoverOut?.(event); }}
            onFocus={event => { setFocused(true); onFocus?.(event); }}
            onBlur={event => { setFocused(false); onBlur?.(event); }}
            style={
                state => [
                    !showFocusOutline && styles.noOutline,

                    typeof style === 'function' ? style(state) : style,

                    // Applica il colore hover solo se il pulsante è abilitato, e non viene premuto
                    !props.disabled && hovered && !state.pressed && (hoverStyle ? hoverStyle : styles.hover),

                    showFocusOutline && !props.disabled && (focused || state.pressed) && styles.focus,
                    // Nei menu disegna il contorno dentro l'opzione, senza invadere quelle vicine.
                    insetOutline && styles.insetOutline,
                ]
            }
        />
    );
});


const styles = StyleSheet.create({
    noOutline: {
        outlineWidth: 0,
    },
    hover: {
        backgroundColor: 'hsl(243, 23%, 36%)',
    },
    focus: {
        outlineWidth: 2,
        outlineStyle: 'solid',
        outlineColor: Colors.text,
        outlineOffset: 3,
    },
    insetOutline: {
        outlineOffset: -2,
    },
});


export const focusStyle = styles.focus;


export default InteractivePressable;
