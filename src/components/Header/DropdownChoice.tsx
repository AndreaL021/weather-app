import { Colors } from '@/constants/theme';
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';
import AppText from '../ui/AppText';
import InteractivePressable from '../ui/InteractivePressable';

type Props = { label: string; selected: boolean; onPress: () => void };

export default function DropdownChoice({ label, selected, onPress }: Props) {
    
    return (

        <InteractivePressable
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            onPress={onPress}
            style={({ pressed }) => [styles.option, selected && styles.selected, pressed && styles.pressed]}
        >

            <AppText>{label}</AppText>

            {
                selected && <Image source={require('@/assets/images/icon-checkmark.svg')} style={styles.check} accessible={false} />
            }

        </InteractivePressable>
    );
}

const styles = StyleSheet.create({
    option: {
        minHeight: 40,
        padding: 5,
        borderRadius: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8
    },
    selected: {
        backgroundColor: Colors.surfaceRaised
    },
    pressed: {
        backgroundColor: 'hsl(243, 27%, 16%)'
    },
    check: {
        width: 14,
        height: 14
    },
});
