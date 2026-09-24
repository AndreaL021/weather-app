import { Colors } from '@/constants/theme';
import { useUnits } from '@/contexts/UnitsContext';
import { StyleSheet, View } from 'react-native';
import AppText from '../ui/AppText';
import DropdownChoice from './DropdownChoice';


export default function DropdownMenu() {

    const { units, system, setSystem, setUnit } = useUnits();

    return (
        <View style={styles.container}>

            <View accessibilityRole="radiogroup" accessibilityLabel="Measurement system">

                <AppText size='header' color="textMuted" style={styles.heading}>Measurement system</AppText>

                <DropdownChoice label="Metric" selected={system === 'metric'} onPress={() => setSystem('metric')} />
                <DropdownChoice label="Imperial" selected={system === 'imperial'} onPress={() => setSystem('imperial')} />

            </View>
            <View style={styles.group} accessibilityRole="radiogroup" accessibilityLabel="Temperature">

                <AppText size='header' color="textMuted" style={styles.heading}>Temperature</AppText>

                <DropdownChoice label="Celsius (°C)" selected={units.temperature === 'celsius'} onPress={() => setUnit('temperature', 'celsius')} />
                <DropdownChoice label="Fahrenheit (°F)" selected={units.temperature === 'fahrenheit'} onPress={() => setUnit('temperature', 'fahrenheit')} />

            </View>
            <View style={styles.group} accessibilityRole="radiogroup" accessibilityLabel="Wind speed">

                <AppText size='header' color="textMuted" style={styles.heading}>Wind speed</AppText>

                <DropdownChoice label="km/h" selected={units.wind === 'kmh'} onPress={() => setUnit('wind', 'kmh')} />
                <DropdownChoice label="mph" selected={units.wind === 'mph'} onPress={() => setUnit('wind', 'mph')} />

            </View>
            <View style={styles.group} accessibilityRole="radiogroup" accessibilityLabel="Precipitation">

                <AppText size='header' color="textMuted" style={styles.heading}>Precipitation</AppText>

                <DropdownChoice label="Millimeters (mm)" selected={units.precipitation === 'mm'} onPress={() => setUnit('precipitation', 'mm')} />
                <DropdownChoice label="Inches (in)" selected={units.precipitation === 'in'} onPress={() => setUnit('precipitation', 'in')} />

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 2
    },
    group: {
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        paddingTop: 5
    },
    heading: {
        padding: 3
    },
});
