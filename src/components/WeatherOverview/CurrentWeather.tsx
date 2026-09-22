import { Image } from 'expo-image';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import AppText from '../ui/AppText';

import { Colors } from '@/constants/theme';
import { useUnits } from '@/contexts/UnitsContext';
import { useWeather } from '@/contexts/WeatherContext';
import { weatherIcon } from '@/services/weather';

export default function CurrentWeather() {
    const { temperature } = useUnits();

    const { width } = useWindowDimensions();
    const isSmallScreen = width < 375;
    const { data } = useWeather();
    if (!data) return null;
    const current = data.weather.current;
    const icon = weatherIcon(current.weather_code);
    const date = new Date(`${current.time.slice(0, 10)}T12:00:00Z`).toLocaleDateString('en-US', {
        weekday: 'long', month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC',
    });

    return (
        <View style={[styles.container]}>

            {/* backgroundimage */}
            <Image
                source={isSmallScreen ? require('@/assets/images/bg-today-small.svg') : require('@/assets/images/bg-today-large.svg')}
                contentFit="cover"
                accessibilityLabel="Weather Now"
                style={StyleSheet.absoluteFill}
                accessible={false}
            />
            
            <View style={isSmallScreen ? styles.column : styles.row}>
                <View style={isSmallScreen && styles.textCenter}>
                    <AppText style={{ fontSize: 16 }}>
                        {data.place}
                    </AppText>
                    <AppText style={{ color: Colors.textSecondary }}>
                        {date}
                    </AppText>
                </View>
                <View style={styles.row}>
                    <Image
                        source={icon.icon}
                        style={[styles.image, { aspectRatio: isSmallScreen? 0.6 :1 }]}
                        contentFit="contain"
                        accessibilityLabel={icon.condition}
                    />
                    <AppText style={{ fontSize: 60 }}>
                        {temperature(current.temperature_2m)}
                    </AppText>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    textCenter: {
        alignItems: 'center',
    },
    container: {
        padding: 16,
        borderRadius: 12,
        overflow: 'hidden',
        paddingVertical: 50,
    },
    image: {
        zIndex: 10,
        width: 70,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    column: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
