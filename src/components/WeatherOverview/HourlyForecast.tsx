import AppText from '@/components/ui/AppText';
import Select from '@/components/ui/Select';
import { Colors } from '@/constants/theme';
import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

const days = ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday'];
const dayOptions = days.map(day => ({ label: day, value: day }));

// Dati di esempio: verranno sostituiti con le previsioni del giorno selezionato.
const hourlyForecast = [
    { time: '3 PM', temperature: 20, condition: 'Nuvoloso', icon: require('@/assets/images/icon-overcast.webp') },
    { time: '4 PM', temperature: 20, condition: 'Parzialmente nuvoloso', icon: require('@/assets/images/icon-partly-cloudy.webp') },
    { time: '5 PM', temperature: 20, condition: 'Soleggiato', icon: require('@/assets/images/icon-sunny.webp') },
    { time: '6 PM', temperature: 19, condition: 'Nuvoloso', icon: require('@/assets/images/icon-overcast.webp') },
    { time: '7 PM', temperature: 18, condition: 'Neve', icon: require('@/assets/images/icon-snow.webp') },
    { time: '8 PM', temperature: 18, condition: 'Nebbia', icon: require('@/assets/images/icon-fog.webp') },
    { time: '9 PM', temperature: 17, condition: 'Neve', icon: require('@/assets/images/icon-snow.webp') },
    { time: '10 PM', temperature: 17, condition: 'Nuvoloso', icon: require('@/assets/images/icon-overcast.webp') },
];

export default function HourlyForecast({ fillHeight = false }: { fillHeight?: boolean }) {

    const [selectedDay, setSelectedDay] = useState('Tuesday');


    // CARD
    const cards = hourlyForecast.map(hour => (
        <View key={hour.time} style={styles.card}>
            <View style={styles.hour}>
                <Image source={hour.icon} style={styles.icon} contentFit="contain" accessibilityLabel={hour.condition} />
                <AppText>{hour.time}</AppText>
            </View>
            <AppText style={{ color: Colors.textSecondary }}>{hour.temperature}°</AppText>
        </View>
    ));

    return (
        <View style={[styles.container, fillHeight && styles.fill]}>
            <View style={styles.header}>
                <AppText style={styles.title}>Hourly forecast</AppText>
                <Select
                    label={selectedDay}
                    accessibilityLabel={`Giorno delle previsioni: ${selectedDay}`}
                    variant="raised"
                    options={dayOptions}
                    value={selectedDay}
                    onChange={setSelectedDay}
                />
            </View>
            <View style={[styles.hours, fillHeight && styles.hoursFill]}>{cards}</View>
        </View>
    );
}

const styles = StyleSheet.create({
    fill: { flex: 1, minHeight: 0 },
    hours: { gap: 12 },
    hoursFill: { flexGrow: 1, justifyContent: 'space-between' },
    card: {
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
    title: { flexShrink: 1, fontSize: 14 },
});
