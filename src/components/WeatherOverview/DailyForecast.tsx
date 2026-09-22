import AppText from '@/components/ui/AppText';
import { Colors } from '@/constants/theme';
import { Image } from 'expo-image';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

// Dati dimostrativi del design.
const forecast = [
    { day: 'Tue', high: 20, low: 14, condition: 'Pioviggine', icon: require('@/assets/images/icon-drizzle.webp') },
    { day: 'Wed', high: 21, low: 15, condition: 'Pioggia', icon: require('@/assets/images/icon-rain.webp') },
    { day: 'Thu', high: 24, low: 14, condition: 'Soleggiato', icon: require('@/assets/images/icon-sunny.webp') },
    { day: 'Fri', high: 25, low: 13, condition: 'Parzialmente nuvoloso', icon: require('@/assets/images/icon-partly-cloudy.webp') },
    { day: 'Sat', high: 21, low: 15, condition: 'Temporale', icon: require('@/assets/images/icon-storm.webp') },
    { day: 'Sun', high: 25, low: 16, condition: 'Neve', icon: require('@/assets/images/icon-snow.webp') },
    { day: 'Mon', high: 24, low: 15, condition: 'Nebbia', icon: require('@/assets/images/icon-fog.webp') },
];

export default function DailyForecast() {
    const { width } = useWindowDimensions();
    const isMediumScreen = width < 576;
    const isSmallScreen = width < 375;

    return (
        <View style={styles.container}>
            <AppText style={styles.title}>Daily forecast</AppText>
            <View style={[styles.row, isMediumScreen && styles.mobileRow]}>
                {forecast.map(day => (
                    <View key={day.day} style={[styles.card, isMediumScreen && styles.mobileCard, isSmallScreen && styles.smallCard]}>
                        <AppText style={styles.day}>{day.day}</AppText>
                        <Image source={day.icon} style={styles.icon} contentFit="contain" accessibilityLabel={day.condition} />
                        <View style={styles.temperatures}>
                            <AppText style={styles.temperature} accessibilityLabel={`Massima ${day.high} gradi`}>{day.high}°</AppText>
                            <AppText style={[styles.temperature, styles.low]} accessibilityLabel={`Minima ${day.low} gradi`}>{day.low}°</AppText>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // backgroundColor: 'yellow',
    },
    title: {
        color: Colors.text,
        paddingBottom: 10,
        fontSize: 14,
    },
    card: {
        backgroundColor: Colors.surfaceRaised,
        width: '13%',
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.border,
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
    },
    day: { textAlign: 'center', fontSize: 14, color: Colors.textMuted},
    icon: { width: 48, maxWidth: '100%', aspectRatio: 1 },
    temperatures: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 4,
    },
    temperature: { fontSize: 12 },
    low: { color: Colors.textSecondary },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    mobileRow: {
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        columnGap: '2%',
        rowGap: 12,
    },
    mobileCard: {
        width: '23.5%',
    },
    smallCard: {
        width: '32%',
    },
});
