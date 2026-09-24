import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import AppText from '../ui/AppText';

import { Colors } from '@/constants/theme';
import { useUnits } from '@/contexts/UnitsContext';
import { useWeather } from '@/contexts/WeatherContext';
import useBreakpoints from '@/hooks/useBreakpoints';
import { weatherIcon } from '@/services/weather';

export default function CurrentWeather() {

    const { temperature } = useUnits();
    const { data } = useWeather();
    const { isXSScreen, isSmallScreen, isXXLScreen } = useBreakpoints()

    if (!data) return null;

    const current = data.weather.current;
    const icon = weatherIcon(current.weather_code);

    const date = new Date(`${current.time.slice(0, 10)}T12:00:00Z`).toLocaleDateString('en-US', {
        weekday: 'long', month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC',
    });

    return (
        <View style={[styles.container, { paddingVertical: isXXLScreen ? 60 : 30 }]}>

            {/* Immagine di sfondo */}
            <Image
                source={isXSScreen ? require('@/assets/images/bg-today-small.svg') : require('@/assets/images/bg-today-large.svg')}
                contentFit="cover"
                accessibilityLabel="Weather Now"
                style={StyleSheet.absoluteFill}
                accessible={false}
            />

            <View style={isSmallScreen ? styles.column : styles.row}>

                <View style={isSmallScreen && styles.textCenter}>

                    <AppText size='title'>

                        {data.place}

                    </AppText>

                    <AppText size='header' style={{ color: Colors.textSecondary }}>

                        {date}

                    </AppText>

                </View>

                <View style={styles.row}>
                    {/* icona meteo */}
                    <Image
                        source={icon.icon}
                        style={[styles.image, { aspectRatio: isXSScreen ? 0.6 : 1, width: isSmallScreen ? 120 : 180 }]}
                        contentFit="contain"
                        accessibilityLabel={icon.condition}
                    />

                    <AppText style={{ fontSize: 80 }}>
                        {/* Temperatura */}
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
        paddingHorizontal: 25,
        borderRadius: 12,
        overflow: 'hidden',
    },
    image: {
        zIndex: 10,
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
