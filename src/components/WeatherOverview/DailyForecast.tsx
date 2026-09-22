import AppText from '@/components/ui/AppText';
import { Colors } from '@/constants/theme';
import { useUnits } from '@/contexts/UnitsContext';
import { useWeather } from '@/contexts/WeatherContext';
import { dayLabel, weatherIcon } from '@/services/weather';
import { Image } from 'expo-image';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

export default function DailyForecast() {
    const { temperature } = useUnits();
    const { width } = useWindowDimensions();
    const isMediumScreen = width < 576;
    const isSmallScreen = width < 375;
    const { data } = useWeather();
    if (!data) return null;
    const daily = data.weather.daily;
    const forecast = daily.time.map((date, index) => ({
        date, day: dayLabel(date), high: daily.temperature_2m_max[index],
        low: daily.temperature_2m_min[index], ...weatherIcon(daily.weather_code[index]),
    }));

    const columns = isSmallScreen ? 3 : isMediumScreen ? 4 : 7;
    const rows = Array.from({ length: Math.ceil(forecast.length / columns) }, (_, index) => forecast.slice(index * columns, (index + 1) * columns));

    return (
        <View style={styles.container}>
            <AppText style={styles.title}>Daily forecast</AppText>
            <View style={styles.rows}>
                {rows.map((row, index) => <View key={index} style={styles.row}>
                {row.map(day => (
                    <View key={day.date} style={styles.card}>
                        <AppText style={styles.day}>{day.day}</AppText>
                        <Image source={day.icon} style={styles.icon} contentFit="contain" accessibilityLabel={day.condition} />
                        <View style={styles.temperatures}>
                            <AppText style={styles.temperature} accessibilityLabel={`Massima ${temperature(day.high, true)}`}>{temperature(day.high)}</AppText>
                            <AppText style={[styles.temperature, styles.low]} accessibilityLabel={`Minima ${temperature(day.low, true)}`}>{temperature(day.low)}</AppText>
                        </View>
                    </View>
                ))}
                {Array.from({ length: columns - row.length }, (_, index) => <View key={`empty-${index}`} style={styles.emptyCard} />)}
                </View>)}
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
        flex: 1,
        minWidth: 0,
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
    rows: { gap: 12 },
    row: { flexDirection: 'row', gap: 10 },
    emptyCard: { flex: 1, minWidth: 0, padding: 10, borderWidth: 1, borderColor: 'transparent' },
});
