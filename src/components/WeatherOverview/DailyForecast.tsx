import AppText from '@/components/ui/AppText';
import { Colors } from '@/constants/theme';
import { useUnits } from '@/contexts/UnitsContext';
import { useWeather } from '@/contexts/WeatherContext';
import useBreakpoints from '@/hooks/useBreakpoints';
import { dayLabel, weatherIcon } from '@/services/weather';
import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

export default function DailyForecast() {

    const { temperature } = useUnits();
    const { data } = useWeather();

    const { isXSScreen, isMediumScreen } = useBreakpoints();


    if (!data) return null;

    const daily = data.weather.daily;

    const forecast = daily.time.map((date, index) => ({
        date, day: dayLabel(date), high: daily.temperature_2m_max[index],
        low: daily.temperature_2m_min[index], ...weatherIcon(daily.weather_code[index]),
    }));

    const columns = isXSScreen ? 3 : isMediumScreen ? 4 : 7;

    const rows = Array.from(
        { length: Math.ceil(forecast.length / columns) },
        (_, index) => forecast.slice(index * columns, (index + 1) * columns)
    );

    return (
        <View>

            <AppText size='header' style={styles.title}>Daily forecast</AppText>

            <View style={styles.rows}>
                {
                    rows.map((row, index) =>
                        <View key={index} style={styles.row}>
                            {
                                row.map(day => (

                                    <View key={day.date} style={styles.card}>

                                        <AppText color='textSecondary' style={styles.day}>{day.day}</AppText>

                                        <Image
                                            source={day.icon}
                                            style={styles.icon}
                                            contentFit="contain"
                                            accessibilityLabel={day.condition}
                                        />

                                        <View style={styles.temperatures}>

                                            <AppText accessibilityLabel={`High ${temperature(day.high, true)}`}>
                                                {temperature(day.high)}
                                            </AppText>

                                            <AppText color='textMuted' accessibilityLabel={`Low ${temperature(day.low, true)}`}>
                                                {temperature(day.low)}
                                            </AppText>

                                        </View>

                                    </View>
                                ))
                            }
                            {
                                // per evitare una card si allarghi in una riga non piena aggiungo delle card vuote
                                Array.from(
                                    { length: columns - row.length },
                                    (_, index) => <View key={`empty-${index}`} style={styles.emptyCard} />
                                )
                            }
                        </View>
                    )
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        paddingVertical: 10,
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
    day: {
        textAlign: 'center',
    },
    icon: {
        width: 48,
        maxWidth: '100%',
        aspectRatio: 1
    },
    temperatures: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 4,
    },
    rows: {
        gap: 12
    },
    row: {
        flexDirection: 'row',
        gap: 10
    },
    emptyCard: {
        flex: 1,
        minWidth: 0,
        padding: 10,
        borderWidth: 1,
        borderColor: 'transparent'
    },
});
