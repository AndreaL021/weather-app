import { Colors } from '@/constants/theme';
import { forwardRef, useState } from 'react';
import { Pressable, StyleSheet, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

// pressable props
type Props = PressableProps & { hoverStyle?: StyleProp<ViewStyle>; showFocusOutline?: boolean };

// collega ref ricevuto dall'esterno al Pressable interno.
const InteractivePressable = forwardRef<View, Props>(function InteractivePressable(
    { style, hoverStyle, showFocusOutline = true, onHoverIn, onHoverOut, onFocus, onBlur, ...props }, ref,
) {
    
    const [hovered, setHovered] = useState(false);
    const [focused, setFocused] = useState(false);
    return (
        
        <Pressable {...props} ref={ref}
            onHoverIn={event => { setHovered(true); onHoverIn?.(event); }}
            onHoverOut={event => { setHovered(false); onHoverOut?.(event); }}
            onFocus={event => { setFocused(true); onFocus?.(event); }}
            onBlur={event => { setFocused(false); onBlur?.(event); }}
            style={state => [

                !showFocusOutline && styles.noOutline,
                typeof style === 'function' ? style(state) : style,
                !props.disabled && hovered && !state.pressed && (hoverStyle ?? styles.hover),
                showFocusOutline && focused && styles.focus,
            ]}
        />
    );
});


export const focusStyle: ViewStyle = { outlineWidth: 2, outlineStyle: 'solid', outlineColor: Colors.text };


const styles = StyleSheet.create({
    noOutline: { outlineWidth: 0 },
    hover: { backgroundColor: 'hsl(243, 23%, 36%)' },
    focus: focusStyle,
});

export default InteractivePressable;
