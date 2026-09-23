import AppText from '@/components/ui/AppText';
import Select from '@/components/ui/Select';
import { Colors } from '@/constants/theme';
import { useUnits } from '@/contexts/UnitsContext';
import { useWeather } from '@/contexts/WeatherContext';
import { dayLabel, weatherIcon } from '@/services/weather';
import { Image } from 'expo-image';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function HourlyForecast({ fillHeight = false }: { fillHeight?: boolean }) {

    const { temperature } = useUnits();
    const [selectedDay, setSelectedDay] = useState('');
    const { data } = useWeather();

    if (!data) return null;

    const { daily, hourly } = data.weather;
    const dayOptions = daily.time.map(date => ({ value: date, label: dayLabel(date, true) }));
    const activeDay = daily.time.includes(selectedDay) ? selectedDay : daily.time[0];

    const hourlyForecast = hourly.time.map((time, index) => {

        const hour = Number(time.slice(11, 13));

        return {
            dateTime: time,
            time: (hour % 12 || 12) + (hour < 12 ? ' AM' : ' PM'),
            temperature: hourly.temperature_2m[index],
            ...weatherIcon(hourly.weather_code[index]),
        };

    }).filter(hour => hour.dateTime.startsWith(activeDay));


    return (
        <View style={[styles.container, fillHeight && styles.fill]}>

            <View style={styles.header}>

                <AppText style={styles.title}>Hourly forecast</AppText>

                <Select
                    label={dayLabel(activeDay, true)}
                    accessibilityLabel={`Forecast day: ${dayLabel(activeDay, true)}`}
                    variant="raised"
                    options={dayOptions}
                    value={activeDay}
                    onChange={setSelectedDay}
                />

            </View>
            {
                fillHeight
                    ? (
                        // card scrollabile per mantenere le dimensioni desktop
                        <ScrollView
                            key={activeDay}
                            style={styles.fill}
                            contentContainerStyle={styles.hours}
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator
                        >
                            {
                                hourlyForecast.map(hour => (

                                    <View key={hour.dateTime} style={styles.card}>

                                        <View style={styles.hour}>

                                            <Image source={hour.icon} style={styles.icon} contentFit="contain" accessibilityLabel={hour.condition} />

                                            <AppText>{hour.time}</AppText>

                                        </View>

                                        <AppText style={{ color: Colors.textSecondary }}>{temperature(hour.temperature)}</AppText>

                                    </View>
                                ))
                            }
                        </ScrollView>

                    ) : (
                        // card mobile, altezza intera, scroll gestito dalla pagina
                        <View style={styles.hours}>
                            {
                                hourlyForecast.map(hour => (

                                    <View key={hour.dateTime} style={styles.card}>

                                        <View style={styles.hour}>

                                            <Image source={hour.icon} style={styles.icon} contentFit="contain" accessibilityLabel={hour.condition} />

                                            <AppText>{hour.time}</AppText>

                                        </View>

                                        <AppText style={{ color: Colors.textSecondary }}>{temperature(hour.temperature)}</AppText>

                                    </View>
                                ))
                            }
                        </View>
                    )
            }
        </View>
    );
}

const styles = StyleSheet.create({
    fill: {
        flex: 1,
        minHeight: 0
    },
    hours: {
        gap: 12
    },
    card: {
        flexShrink: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        padding: 3,
        paddingHorizontal: 10,
        borderRadius: 8,
        backgroundColor: Colors.surfaceRaised,
    },
    hour: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    icon: {
        width: 28,
        height: 28,
    },
    container: {
        padding: 10,
        borderRadius: 12,
        backgroundColor: Colors.surface,
        flexDirection: 'column',
        gap: 12,
    },
    header: {
        flexShrink: 0,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    },
    title: {
        flexShrink: 1,
        fontSize: 14
    },
});
